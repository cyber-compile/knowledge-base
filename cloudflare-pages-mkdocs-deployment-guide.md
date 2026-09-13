# Deploying a Cybersecurity Knowledge Base with MkDocs Material + Cloudflare Pages

A complete path from an empty GitHub repo to a live, themeable, function-capable site.

---

## Part 1 — Repo & Local Setup

### Step 1: Clone your new repo and set up the project structure

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

Create the base structure:

```bash
mkdir -p docs/{cheatsheets,cve-feed,labs,ai-security,homelab,career}
touch docs/index.md
```

### Step 2: Set up a Python virtual environment and install MkDocs Material

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install mkdocs-material mkdocs-git-revision-date-localized-plugin mkdocs-minify-plugin
```

Freeze dependencies so Cloudflare's build environment installs the exact same versions:

```bash
pip freeze > requirements.txt
```

### Step 3: Initialize the MkDocs config

Create `mkdocs.yml` in the repo root:

```yaml
site_name: Bachohaym Security KB
site_url: https://yourdomain.com
repo_url: https://github.com/<your-username>/<your-repo>
repo_name: <your-repo>

theme:
  name: material
  palette:
    - scheme: slate
      primary: black
      accent: red
      toggle:
        icon: material/weather-night
        name: Switch to light mode
    - scheme: default
      primary: black
      accent: red
      toggle:
        icon: material/weather-sunny
        name: Switch to dark mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - navigation.instant
    - search.suggest
    - search.highlight
    - content.code.copy
    - content.tabs.link
  logo: assets/logo.svg
  favicon: assets/favicon.png

plugins:
  - search
  - git-revision-date-localized:
      enable_creation_date: true
  - minify:
      minify_html: true

extra_css:
  - stylesheets/extra.css
extra_javascript:
  - javascripts/extra.js

nav:
  - Home: index.md
  - Cheat Sheets: cheatsheets/
  - CVE Feed: cve-feed/
  - Labs: labs/
  - AI Security: ai-security/
  - Homelab & Infra: homelab/
  - Career & Certs: career/
```

### Step 4: Preview locally before touching Cloudflare

```bash
mkdocs serve
```

Open `http://127.0.0.1:8000`. Confirm nav, search, and dark/light toggle work before deploying.

### Step 5: Commit and push

```bash
git add .
git commit -m "Initial MkDocs Material scaffold"
git push origin main
```

---

## Part 2 — Connecting Cloudflare Pages

### Step 6: Create the Pages project

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**. Authorize GitHub, select your repo.

### Step 7: Configure the build

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pip install -r requirements.txt && mkdocs build` |
| Build output directory | `site` |
| Root directory | `/` (or subfolder if monorepo) |

Cloudflare's default build image includes Python, so no extra config is usually needed. If the build fails on Python version, add an environment variable `PYTHON_VERSION = 3.12` under **Settings → Environment variables**.

### Step 8: Deploy and verify

Save and deploy. Cloudflare gives you a `<project>.pages.dev` URL immediately. Open it and confirm the site matches your local preview.

### Step 9: Attach your custom domain

**Pages project → Custom domains → Set up a custom domain**. If your domain's nameservers are already on Cloudflare, the DNS record and TLS cert are added automatically. Otherwise, add the CNAME Cloudflare gives you at your registrar.

### Step 10: Every future push auto-deploys

From here, any `git push origin main` triggers a new build and deploy automatically — no separate GitHub Actions workflow is required for this part; Cloudflare's Git integration handles CI/CD natively.

---

## Part 3 — Designing and Editing the Theme

### Step 11: Override colors, fonts, and spacing with custom CSS

Create `docs/stylesheets/extra.css` (already wired in via `extra_css` above):

```css
:root {
  --md-primary-fg-color: #0d0d0d;
  --md-accent-fg-color: #e53935;
  --md-typeset-a-color: #e53935;
}

.md-header {
  box-shadow: 0 1px 0 rgba(255,255,255,0.05);
}

/* Custom hero block for the homepage */
.hero {
  padding: 4rem 1rem;
  text-align: center;
}
.hero h1 {
  font-size: 2.4rem;
  font-weight: 700;
}
```

Use this hero block in `docs/index.md` with raw HTML (MkDocs Material allows inline HTML in markdown):

```html
<div class="hero">
  <h1>Built for security engineers who'd rather run the command than read about it.</h1>
  <p>Hands-on labs, a curated toolkit, and cheatsheets kept current by an automated pipeline.</p>
</div>
```

### Step 12: Add custom fonts

In `mkdocs.yml`:

```yaml
theme:
  font:
    text: Inter
    code: JetBrains Mono
```

MkDocs Material pulls these from Google Fonts automatically at build time — no extra CSS needed unless self-hosting fonts for privacy reasons (recommended if you want zero third-party requests; download the font files into `docs/assets/fonts/` and reference them with `@font-face` in `extra.css` instead).

### Step 13: Add your logo, favicon, and social preview image

Drop files into `docs/assets/`:
- `logo.svg` — referenced in `mkdocs.yml` under `theme.logo`
- `favicon.png` — referenced under `theme.favicon`
- `social-preview.png` — used for link previews; add under `extra`:

```yaml
extra:
  social_preview_image: assets/social-preview.png
```

### Step 14: Customize layout with theme overrides

For changes beyond CSS (e.g., editing the footer, header layout, or homepage template), use MkDocs Material's override system rather than forking the theme:

```
mkdir -p overrides/partials
```

Copy the specific partial you want to change from the installed theme package (find it via `pip show mkdocs-material`) into `overrides/partials/`, edit it, then point to it in `mkdocs.yml`:

```yaml
theme:
  custom_dir: overrides
```

Only override the specific `.html` partial you're changing (e.g. `footer.html`) — don't copy the whole theme, or you'll lose upstream updates.

### Step 15: Add interactive JS (e.g., the live CVE ticker or status strip)

Create `docs/javascripts/extra.js`:

```javascript
document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/latest-cve")
    .then(res => res.json())
    .then(data => {
      const ticker = document.querySelector(".cve-ticker");
      if (ticker) ticker.textContent = `Last CVE ingested: ${data.title} (${data.age})`;
    });
});
```

This calls a Pages Function you'll build in Part 4 — add a `<div class="cve-ticker"></div>` wherever you want it to render, e.g. in your homepage hero or in `overrides/partials/header.html`.

---

## Part 4 — Adding Functions (Serverless Backend)

Cloudflare Pages Functions let you add API routes and dynamic behavior without a separate server. Files map directly to routes.

### Step 16: Create the functions directory

```bash
mkdir -p functions/api
```

Anything in `/functions` is auto-deployed as a route matching its file path. `functions/api/latest-cve.js` becomes `yourdomain.com/api/latest-cve`.

### Step 17: Write a basic function

```javascript
// functions/api/latest-cve.js
export async function onRequestGet(context) {
  // Example: pull from Cloudflare KV where your CVE pipeline writes data
  const latest = await context.env.CVE_KV.get("latest", { type: "json" });

  return new Response(JSON.stringify(latest ?? { title: "No data yet", age: "n/a" }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

### Step 18: Bind storage (KV, D1, or Vectorize) to the function

In the Cloudflare dashboard: **Pages project → Settings → Functions → KV namespace bindings** (or D1/Vectorize bindings). Bind a namespace called `CVE_KV`, matching the variable name used in `context.env` above.

Locally, define the same binding in `wrangler.toml` for testing:

```toml
[[kv_namespaces]]
binding = "CVE_KV"
id = "<namespace-id>"
```

### Step 19: Test functions locally before deploying

```bash
npm install -g wrangler
wrangler pages dev site --kv CVE_KV
```

This serves your built `site/` folder plus live functions locally, so you can test the API route exactly as it'll behave in production.

### Step 20: Add security headers via `_headers`

Create `docs/_headers` (MkDocs will copy it into `site/` on build since it lives in the docs source):

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Cloudflare Pages reads this file automatically on deploy — no extra config needed. Adjust `Content-Security-Policy` if you load Google Fonts or external scripts.

### Step 21: Add redirects if needed

Create `docs/_redirects`:

```
/old-path  /new-path  301
```

### Step 22: Push and confirm the full pipeline

```bash
git add .
git commit -m "Add theme customization, CVE ticker function, and security headers"
git push origin main
```

Watch the build in the Cloudflare dashboard, then verify: the homepage renders with your custom hero/colors, `/api/latest-cve` returns data, and response headers show your security policy (check with `curl -I https://yourdomain.com`).

---

## What's next

- Wire your Hermes pipeline to write into the same KV namespace the function reads from, so the ticker updates automatically as new CVEs are ingested.
- If you outgrow Pages Functions (heavier RAG/vector search for "Ask Hermes"), migrate that specific function to a standalone Cloudflare Worker with Vectorize bound — same deployment model, more compute headroom.
- Add a GitHub Actions step only if you need pre-build checks (link checking, markdown linting) before Cloudflare's own build runs; Cloudflare's Git integration already handles the deploy itself.
