#!/usr/bin/env python3
"""Generate nav stub index.md files for missing content directories."""

import pathlib

CONTENT = pathlib.Path("content")
TEMPLATE = CONTENT / "nav-stub-template.md"

SECTIONS = {
    "01-foundations/roadmaps/offensive-security": (
        "Offensive Security",
        "Roadmap for breaking into offensive security: the prerequisite skills, the progression from beginner to advanced, and the hands-on milestones that matter.",
    ),
    "01-foundations/roadmaps/application-security": (
        "Application Security",
        "Roadmap for understanding and securing web and native applications: from OWASP Top 10 fundamentals through secure SDLC, code review, and runtime protection.",
    ),
    "01-foundations/roadmaps/cloud-security": (
        "Cloud Security",
        "Roadmap for securing cloud environments across providers: shared responsibility, identity and access, workload protection, and cloud-native detection and response.",
    ),
    "01-foundations/roadmaps/defensive-security": (
        "Defensive Security",
        "Roadmap for security operations, detection engineering, threat hunting, and blue-team fundamentals: from Tier 1 monitoring through advanced incident handling.",
    ),
    "01-foundations/roadmaps/digital-forensics-incident-response": (
        "Digital Forensics & Incident Response",
        "Roadmap for forensic acquisition, evidence handling, timeline reconstruction, and structured incident response from triage through lessons learned.",
    ),
    "01-foundations/roadmaps/governance-risk-compliance": (
        "Governance, Risk & Compliance",
        "Roadmap for GRC work: frameworks, risk assessments, control mapping, audit preparation, and turning security policy into something an organization can actually run.",
    ),
    "01-foundations/fundamentals/cryptography": (
        "Cryptography",
        "Core cryptographic concepts: symmetric and asymmetric primitives, hashing, certificates and PKI, key management, and the common mistakes that turn crypto into liability.",
    ),
    "01-foundations/fundamentals/networking": (
        "Networking",
        "Networking fundamentals for security work: protocols, packet flow, addressing, common services, and the network concepts behind most real-world attacks and defenses.",
    ),
    "01-foundations/fundamentals/operating-systems": (
        "Operating Systems",
        "Operating-system fundamentals for security: processes, memory, file systems, permissions, and the OS internals that show up in exploits, forensics, and hardening.",
    ),
    "01-foundations/fundamentals/scripting": (
        "Scripting",
        "Scripting fundamentals for security automation: reading and writing small tools, text processing, interacting with APIs, and turning repetitive tasks into repeatable workflows.",
    ),
    "01-foundations/certifications": (
        "Certifications",
        "A guided list of security certifications: what each one covers, who it is aimed at, and where it tends to fit in a career path.",
    ),
    "01-foundations/courseware": (
        "Courseware",
        "Structured learning material: courses, modules, and curated study paths that back up the roadmaps and fundamentals in this library.",
    ),
    "01-foundations/glossary": (
        "Glossary",
        "A working glossary of security terms used across the library: quick definitions for the words that show up everywhere else.",
    ),
    "02-hands-on-work/home-labs": (
        "Home Labs",
        "Blueprints for building security home labs: virtual networks, lab topologies, safe practice environments, and the tooling that turns a laptop into a miniature security shop.",
    ),
    "02-hands-on-work/vulnerable-apps": (
        "Vulnerable Applications",
        "Intentionally vulnerable applications and environments for safe, legal practice: what they are, how to run them, and what to practice on inside them.",
    ),
    "03-toolkit/reconnaissance": (
        "Reconnaissance",
        "Reconnaissance tooling: open-source discovery, passive and active information gathering, and the preliminaries that shape everything afterward.",
    ),
    "03-toolkit/scanning-enumeration": (
        "Scanning & Enumeration",
        "Scanning and enumeration tooling: port and service discovery, version detection, and the structured probing that turns a target into a usable attack surface map.",
    ),
    "03-toolkit/exploitation": (
        "Exploitation",
        "Exploitation tooling and techniques: how common exploit workflows operate, the tools people use to exercise them, and the operational notes that matter more than the buttons.",
    ),
    "03-toolkit/post-exploitation": (
        "Post-Exploitation",
        "Post-exploitation tooling: what happens after initial access in a lab environment: enumeration, persistence concepts, and the evidence that matters for learning.",
    ),
    "03-toolkit/password-cracking": (
        "Password Cracking",
        "Password-cracking tooling: hash formats, attack strategies, wordlist hygiene, and the operational realities behind the benchmarks you see online.",
    ),
    "03-toolkit/network-defense": (
        "Network Defense",
        "Network-defense tooling: monitoring, traffic analysis, detection basics, and the tools used to see what is moving across a network.",
    ),
    "03-toolkit/cloud-security-tools": (
        "Cloud Security Tools",
        "Cloud security tooling: posture assessment, configuration review, workload scanning, and the utilities that help you reason about cloud environments you do not fully control.",
    ),
    "03-toolkit/container-kubernetes-security": (
        "Container & Kubernetes Security",
        "Container and Kubernetes security tooling: image scanning, cluster configuration review, runtime protection concepts, and the specific mistakes that make clusters noisy targets.",
    ),
    "03-toolkit/forensics-tools": (
        "Forensics Tools",
        "Forensic tooling: acquisition, imaging, timeline construction, artifact analysis, and the utilities commonly used when the goal is to reconstruct what happened.",
    ),
    "03-toolkit/malware-analysis-tools": (
        "Malware Analysis Tools",
        "Malware-analysis tooling: static and dynamic analysis utilities, sandboxing helpers, and the basic environment setup used to study malicious samples safely.",
    ),
    "03-toolkit/osint-tools": (
        "OSINT Tools",
        "Open-source intelligence tooling: search techniques, public-data aggregation, and the tools people use to connect publicly available dots.",
    ),
    "03-toolkit/tool-spotlight": (
        "Tool Spotlight",
        "Deeper dives on individual tools: how they work, when they are useful, and the gotchas that only show up after you have used them a few times.",
    ),
    "04-cheatsheets/command-cheatsheets": (
        "Command Cheatsheets",
        "Quick command references for common security tasks: the flags, syntax, and one-liners worth keeping at hand when you are working live.",
    ),
    "04-cheatsheets/frameworks": (
        "Frameworks",
        "Framework cheatsheets: structural references for common security frameworks, testing methodologies, and control models used across the industry.",
    ),
    "04-cheatsheets/payload-cheatsheets": (
        "Payload Cheatsheets",
        "Payload references for lab and study use: common patterns, encoding ideas, and the structural notes that help you understand what a payload is doing rather than just running it.",
    ),
    "05-research/blogs": (
        "Blogs",
        "Curated security blogs and writers worth following: organized by focus area so you can follow the parts of the field that matter to you.",
    ),
    "05-research/books": (
        "Books",
        "Security books worth reading, with notes on what each one is good for and where it fits in a learning path.",
    ),
    "06-grc/framework-primers": (
        "Framework Primers",
        "Short primers on common GRC frameworks and control models: what they are, what they are for, and how they tend to be used in practice.",
    ),
    "06-grc/templates": (
        "Templates",
        "Ready-to-adapt templates for common GRC and security-program artifacts: policies, assessments, runbooks, and the paperwork that keeps security legible to an organization.",
    ),
    "07-dfir-malware-analysis/ir-playbooks": (
        "Incident Response Playbooks",
        "Playbooks for common incident-response scenarios: structured steps for triage, containment, eviction, and recovery in a lab and study context.",
    ),
    "07-dfir-malware-analysis/memory-forensics": (
        "Memory Forensics",
        "Memory-forensics guides: acquisition concepts, volatile-data priorities, and the analysis techniques used to examine a system's runtime state.",
    ),
    "07-dfir-malware-analysis/sandboxing-guides": (
        "Sandboxing Guides",
        "Sandboxing guides: how to stand up and use analysis sandboxes safely, what to isolate, and how to interpret the observations they produce.",
    ),
    "07-dfir-malware-analysis/yara-rules": (
        "YARA Rules",
        "YARA rule references and examples: pattern ideas, rule structure, and the notes that help you write rules that detect something real without drowning in noise.",
    ),
    "08-scripts": (
        "Scripts",
        "Scripts that back the library and its workflows: utilities for content processing, site maintenance, and the repetitive tasks that come with running a large knowledge base.",
    ),
}


def section_subtopics(path_key: str) -> list[str]:
    if path_key.startswith("01-foundations/roadmaps/"):
        return [
            "Prerequisites and assumed background",
            "Phase-by-phase progression",
            "Hands-on milestones and proof-of-work",
            "Common backtracking points and how to recover",
            "How this roadmap connects to adjacent tracks",
        ]
    if path_key.startswith("01-foundations/fundamentals/"):
        return [
            "Core concepts you actually need",
            "The parts most security work depends on",
            "Common misunderstandings to unlearn early",
            "Exercises and verification ideas",
        ]
    if path_key.startswith("02-hands-on-work/"):
        return [
            "Purpose and safe-use boundaries",
            "Requirements and setup steps",
            "Baseline exercises to run first",
            "What practice here is meant to teach",
        ]
    if path_key.startswith("03-toolkit/"):
        return [
            "What the tool category is for",
            "Representative tools and where they differ",
            "Operational notes worth knowing",
            "Quick reference pointers into the rest of the library",
        ]
    if path_key.startswith("04-cheatsheets/"):
        return [
            "What the cheatsheet category covers",
            "How to use these pages at the terminal",
            "Coverage notes and known gaps",
        ]
    if path_key.startswith("05-research/"):
        return [
            "Selection criteria",
            "How the list is organized",
            "How to suggest additions",
        ]
    if path_key.startswith("06-grc/"):
        return [
            "What this section is for",
            "How primers and templates relate",
            "How to adapt a template without breaking it",
        ]
    if path_key.startswith("07-dfir-malware-analysis/"):
        return [
            "Scope and safe-use boundaries",
            "Prerequisites for the section",
            "How playbooks, forensics, sandboxing, and rules connect",
        ]
    if path_key.startswith("08-scripts/"):
        return [
            "What the script does",
            "Usage and expected inputs",
            "Where its output goes",
            "Maintenance notes",
        ]
    return ["Coming soon"]


def main(force: bool = False) -> None:
    template_text = TEMPLATE.read_text(encoding="utf-8")

    missing = []
    existing = []
    for path_str in SECTIONS:
        idx = CONTENT / path_str / "index.md"
        if not idx.exists():
            missing.append(idx)
        elif force:
            existing.append(idx)

    print(f"Missing index.md files: {len(missing)}")
    for p in missing:
        print(" -", p.relative_to(CONTENT))

    if force:
        print(f"Existing index.md files to refresh: {len(existing)}")
        for p in existing:
            print(" -", p.relative_to(CONTENT))
    print()

    # Work on missing + (if forced) existing
    targets = list(SECTIONS.keys())
    if not force:
        targets = [p for p in targets if not (CONTENT / p / "index.md").exists()]

    generated = 0
    for path_str in targets:
        name, intro = SECTIONS[path_str]
        idx = CONTENT / path_str / "index.md"

        idx.parent.mkdir(parents=True, exist_ok=True)
        toc_lines = "\n".join(f"- {s}" for s in section_subtopics(path_str))
        body = (
            template_text
            .replace("{{SECTION_NAME}}", name)
            .replace("{{SECTION_INTRO}}", intro)
            .replace("{{TOC}}", toc_lines)
        )
        idx.write_text(body, encoding="utf-8")
        print("wrote", idx.relative_to(CONTENT))
        generated += 1

    print(f"\nGenerated/ refreshed: {generated}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate nav stub index.md files for content directories."
    )
    parser.add_argument(
        "-r",
        "--refresh",
        action="store_true",
        help="Regenerate all section index.md files from the current template.",
    )
    args = parser.parse_args()

    main(force=args.refresh)
