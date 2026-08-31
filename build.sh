#!/usr/bin/env bash
# CyberCompile - Cloudflare Pages build script
# Builds both the static site (index.html, style.css, script.js) 
# and the MkDocs documentation site
set -euo pipefail

echo "==> CyberCompile Build Starting =="
echo "    Repository: $(git remote get-url origin 2>/dev/null || echo 'N/A')"
echo "    Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')"
echo ""

# Static site files are already in the repo - no build needed
echo "==> Static site files ready =="
echo "    - index.html"
echo "    - style.css"
echo "    - script.js"
echo "    - favicon.svg"
echo ""

# Optionally build MkDocs site if mkdocs.yml exists
if [ -f "mkdocs.yml" ]; then
    echo "==> Checking for MkDocs documentation =="
    
    if command -v python3 &> /dev/null && python3 -c "import mkdocs" 2>/dev/null; then
        echo "    Building MkDocs site..."
        python3 -m mkdocs build --clean
        echo "    MkDocs site built to site/"
    else
        echo "    Skipping MkDocs build (mkdocs not installed)"
        echo "    Install with: pip install -r requirements.txt"
    fi
else
    echo "==> No mkdocs.yml found - skipping MkDocs build =="
fi

echo ""
echo "==> Build Complete =="
echo "    Serving: index.html (static site)"
echo "    Optional: site/ (MkDocs documentation)"
