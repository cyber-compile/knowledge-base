#!/usr/bin/env bash
# Cloudflare Pages build script for CyberCompile.
#
# The repo is MkDocs + Material for MkDocs. Cloudflare Pages runs this
# script (or the build command below), and the site/ output directory is
# what gets served — not the raw markdown repo.
set -euo pipefail

echo "==> Installing Python dependencies"
python3 -m pip install --quiet --upgrade pip
python3 -m pip install --quiet -r requirements.txt

echo "==> Building site with MkDocs"
python3 -m mkdocs build --clean

echo "==> Build complete. Output in site/"
ls -la site/
