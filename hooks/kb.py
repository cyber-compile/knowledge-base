"""
MkDocs build hook for the cybercompile knowledge base.

Single source of truth: the folder tree under ``docs/`` plus a ``_category.json``
in each category directory. From that this hook:

  * builds the site navigation (ordered, titled, icon-aware), and
  * computes the data the custom homepage renders — the category grid, the
    live status strip, the changelog feed, and the hero shortcut pills.

This mirrors the logic of the previous Next.js site's ``lib/content.ts`` so the
MkDocs build stays data-driven from content on disk rather than hardcoded.
"""

from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone
from functools import lru_cache

import yaml

# Directories/files that are metadata, not content pages.
IGNORED_PREFIXES = ("_", ".")

# Theme asset directories under docs/ that must never be treated as content.
RESERVED_DIRS = {"assets", "javascripts", "stylesheets", "css", "js", "img", "images"}


# --------------------------------------------------------------------------- #
# Front matter + timestamps
# --------------------------------------------------------------------------- #

def _read_frontmatter(path: str) -> dict:
    """Return the YAML front matter of a markdown file as a dict (best effort)."""
    try:
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
    except OSError:
        return {}
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    try:
        data = yaml.safe_load(block)
        return data if isinstance(data, dict) else {}
    except yaml.YAMLError:
        return {}


@lru_cache(maxsize=None)
def _git_timestamp(path: str) -> float | None:
    """Last-commit time (epoch seconds) for a file, or None if git is unavailable."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%ct", "--", path],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=os.path.dirname(path) or ".",
        )
        stamp = out.stdout.strip()
        if stamp:
            return float(stamp)
    except (OSError, ValueError, subprocess.SubprocessError):
        pass
    return None


def _page_timestamp(path: str, frontmatter: dict) -> float:
    """Best available timestamp: front matter ``date`` > git > file mtime."""
    raw = frontmatter.get("date")
    if raw is not None:
        parsed = _parse_date(raw)
        if parsed is not None:
            return parsed
    git = _git_timestamp(os.path.abspath(path))
    if git is not None:
        return git
    try:
        return os.path.getmtime(path)
    except OSError:
        return 0.0


def _parse_date(raw) -> float | None:
    if isinstance(raw, (datetime,)):
        return raw.replace(tzinfo=raw.tzinfo or timezone.utc).timestamp()
    if hasattr(raw, "isoformat") and not isinstance(raw, str):  # datetime.date
        try:
            return datetime(raw.year, raw.month, raw.day, tzinfo=timezone.utc).timestamp()
        except (AttributeError, ValueError):
            return None
    if isinstance(raw, str):
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S%z"):
            try:
                dt = datetime.strptime(raw, fmt)
                return dt.replace(tzinfo=dt.tzinfo or timezone.utc).timestamp()
            except ValueError:
                continue
    return None


def _relative_time(epoch: float) -> str:
    seconds = max(0, int(datetime.now(timezone.utc).timestamp() - epoch))
    if seconds < 60:
        return "just now"
    minutes = round(seconds / 60)
    if minutes < 60:
        return f"{minutes}m ago"
    hours = round(minutes / 60)
    if hours < 24:
        return f"{hours}h ago"
    days = round(hours / 24)
    if days < 30:
        return f"{days}d ago"
    months = round(days / 30)
    if months < 12:
        return f"{months}mo ago"
    return f"{round(months / 12)}y ago"


def _titleize(slug: str) -> str:
    return " ".join(word[:1].upper() + word[1:] for word in slug.split("-"))


# --------------------------------------------------------------------------- #
# Tree building
# --------------------------------------------------------------------------- #

def _read_category_meta(directory: str, slug_part: str) -> dict:
    meta_path = os.path.join(directory, "_category.json")
    if os.path.exists(meta_path):
        try:
            with open(meta_path, "r", encoding="utf-8") as fh:
                raw = json.load(fh)
        except (OSError, json.JSONDecodeError):
            raw = {}
        return {
            "title": raw.get("title") or _titleize(slug_part),
            "description": raw.get("description"),
            "icon": raw.get("icon"),
            "order": raw.get("order") if isinstance(raw.get("order"), (int, float)) else 999,
        }
    return {"title": _titleize(slug_part), "description": None, "icon": None, "order": 999}


def _has_content(directory: str) -> bool:
    """True if the directory defines a category or holds markdown anywhere below it."""
    if os.path.exists(os.path.join(directory, "_category.json")):
        return True
    for _root, _dirs, files in os.walk(directory):
        if any(f.endswith(".md") and f != "index.md" for f in files):
            return True
    return False


def _build_tree(directory: str, parent_slug: list[str]) -> list[dict]:
    if not os.path.isdir(directory):
        return []

    nodes: list[dict] = []
    for entry in sorted(os.listdir(directory)):
        if entry.startswith(IGNORED_PREFIXES):
            continue
        full = os.path.join(directory, entry)
        if os.path.isdir(full):
            # Skip theme asset folders and any directory with no content.
            if not parent_slug and entry in RESERVED_DIRS:
                continue
            if not _has_content(full):
                continue
            slug = parent_slug + [entry]
            meta = _read_category_meta(full, entry)
            nodes.append({
                "type": "category",
                "slug": slug,
                "title": meta["title"],
                "description": meta["description"],
                "icon": meta["icon"],
                "order": meta["order"],
                "children": _build_tree(full, slug),
            })
        elif entry.endswith(".md") and entry != "index.md":
            base = entry[:-3]
            slug = parent_slug + [base]
            fm = _read_frontmatter(full)
            nodes.append({
                "type": "page",
                "slug": slug,
                "path": full,
                "src": "/".join(slug) + ".md",
                "title": fm.get("title") or _titleize(base),
                "description": fm.get("description"),
                "order": fm.get("order") if isinstance(fm.get("order"), (int, float)) else 999,
                "timestamp": _page_timestamp(full, fm),
            })

    nodes.sort(key=lambda n: (n["order"], n["title"].lower()))
    return nodes


def _count_pages(node: dict) -> int:
    if node["type"] == "page":
        return 1
    return sum(_count_pages(child) for child in node["children"])


def _flatten_pages(nodes: list[dict]) -> list[dict]:
    pages: list[dict] = []
    for node in nodes:
        if node["type"] == "page":
            pages.append(node)
        else:
            pages.extend(_flatten_pages(node["children"]))
    return pages


def _href(slug: list[str]) -> str:
    return "/" + "/".join(slug) + "/"


# --------------------------------------------------------------------------- #
# Navigation
# --------------------------------------------------------------------------- #

def _nav_entry(node: dict):
    """Convert a tree node into a MkDocs nav entry, or None if empty."""
    if node["type"] == "page":
        return {node["title"]: node["src"]}
    children = [entry for entry in (_nav_entry(c) for c in node["children"]) if entry]
    if not children:
        return None
    return {node["title"]: children}


def _build_nav(tree: list[dict]):
    nav = [{"Home": "index.md"}]
    for node in tree:
        entry = _nav_entry(node)
        if entry:
            nav.append(entry)
    return nav


# --------------------------------------------------------------------------- #
# Homepage data (grid / stats / changelog / shortcuts)
# --------------------------------------------------------------------------- #

MAX_PILLS = 3

PREFERRED_SHORTCUTS = [
    ["cheatsheets", "tools", "nmap"],
    ["cheatsheets", "privilege-escalation"],
    ["toolkit", "password-cracking", "hashcat"],
    ["cve-in-the-wild", "2026", "cve-2026-67276"],
]


def _grid(tree: list[dict]) -> list[dict]:
    cards = []
    for node in tree:
        if node["type"] != "category":
            continue
        subcats = [c for c in node["children"] if c["type"] == "category"]
        cards.append({
            "title": node["title"],
            "description": node["description"],
            "icon": node["icon"] or "folder",
            "href": _href(node["slug"]),
            "count": _count_pages(node),
            "pills": [c["title"] for c in subcats[:MAX_PILLS]],
            "overflow": max(0, len(subcats) - MAX_PILLS),
        })
    return cards


def _find_category(tree: list[dict], keywords: list[str]) -> dict | None:
    matches: list[dict] = []

    def walk(nodes):
        for node in nodes:
            if node["type"] != "category":
                continue
            hay = ("/".join(node["slug"]) + " " + node["title"]).lower()
            if any(k in hay for k in keywords):
                matches.append(node)
            walk(node["children"])

    walk(tree)
    matches.sort(key=lambda n: len(n["slug"]))
    return matches[0] if matches else None


def _newest_under(pages: list[dict], prefix: list[str]) -> dict | None:
    key = "/".join(prefix)
    scope = [p for p in pages if "/".join(p["slug"][: len(prefix)]) == key] if prefix else pages
    return max(scope, key=lambda p: p["timestamp"]) if scope else None


def _stats(tree: list[dict], pages: list[dict]) -> list[dict]:
    stats: list[dict] = []

    cve_cat = _find_category(tree, ["cve", "in-the-wild"])
    newest = _newest_under(pages, cve_cat["slug"]) if cve_cat else None
    if newest is None:
        newest = _newest_under(pages, [])
    if newest:
        stats.append({
            "label": "Last CVE researched" if cve_cat else "Last update",
            "value": _relative_time(newest["timestamp"]),
            "href": _href(newest["slug"]),
        })

    def count_stat(keywords, singular, plural):
        cat = _find_category(tree, keywords)
        if not cat:
            return None
        total = _count_pages(cat)
        if total == 0:
            return None
        return {
            "label": singular if total == 1 else plural,
            "value": str(total),
            "href": _href(cat["slug"]),
        }

    for candidate in (
        count_stat(["toolkit", "tool"], "Tool researched", "Tools researched"),
        count_stat(["cheatsheet"], "Cheatsheet published", "Cheatsheets published"),
        count_stat(["do-it-yourself", "diy", "lab"], "DIY lab published", "DIY labs published"),
    ):
        if candidate and not any(s["href"] == candidate["href"] for s in stats):
            stats.append(candidate)

    if len(stats) < 4 and pages:
        stats.append({
            "label": "Page published" if len(pages) == 1 else "Pages published",
            "value": str(len(pages)),
            "href": "/",
        })
    if len(stats) < 4:
        sections = sum(1 for n in tree if n["type"] == "category")
        if sections:
            stats.append({
                "label": "Section" if sections == 1 else "Sections",
                "value": str(sections),
                "href": "/",
            })

    return stats[:4]


def _breadcrumb_titles(tree: list[dict], slug: list[str]) -> list[str]:
    titles: list[str] = []
    nodes = tree
    for i in range(len(slug)):
        partial = slug[: i + 1]
        match = next((n for n in nodes if n["slug"] == partial), None)
        if not match:
            break
        titles.append(match["title"])
        if match["type"] == "category":
            nodes = match["children"]
    return titles


def _changelog(tree: list[dict], pages: list[dict], limit: int = 12) -> list[dict]:
    ordered = sorted(pages, key=lambda p: p["timestamp"], reverse=True)[:limit]
    entries = []
    for page in ordered:
        crumbs = _breadcrumb_titles(tree, page["slug"])
        entries.append({
            "title": page["title"],
            "href": _href(page["slug"]),
            "section": " / ".join(crumbs[:-1]) or "Docs",
            "relative": _relative_time(page["timestamp"]),
        })
    return entries


def _shortcuts(pages: list[dict], limit: int = 4) -> list[dict]:
    by_key = {"/".join(p["slug"]): p for p in pages}
    picked: list[dict] = []
    for slug in PREFERRED_SHORTCUTS:
        page = by_key.get("/".join(slug))
        if page:
            picked.append(page)
        if len(picked) == limit:
            break
    if len(picked) < limit:
        chosen = {"/".join(p["slug"]) for p in picked}
        fillers = sorted(
            (p for p in pages if "/".join(p["slug"]) not in chosen),
            key=lambda p: p["timestamp"],
            reverse=True,
        )
        picked.extend(fillers[: limit - len(picked)])
    return [{"title": p["title"], "href": _href(p["slug"])} for p in picked]


# --------------------------------------------------------------------------- #
# MkDocs hook entry points
# --------------------------------------------------------------------------- #

def on_config(config, **kwargs):
    docs_dir = config["docs_dir"]
    tree = _build_tree(docs_dir, [])
    pages = _flatten_pages(tree)

    config["nav"] = _build_nav(tree)

    config["extra"].setdefault("kb", {})
    config["extra"]["kb"] = {
        "grid": _grid(tree),
        "stats": _stats(tree, pages),
        "changelog": _changelog(tree, pages),
        "shortcuts": _shortcuts(pages),
        "total_pages": len(pages),
    }
    return config
