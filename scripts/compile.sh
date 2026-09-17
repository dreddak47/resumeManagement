#!/usr/bin/env bash
# Compile a resume .tex file to PDF and report page count + extracted text.
#
# Usage: scripts/compile.sh resumes/sde.tex
#
# Uses the vendored tectonic binary (.bin/tectonic) since no system LaTeX
# install exists on this machine. Output PDF goes to build/<name>.pdf.
# Prints "PAGES: N" on success so callers can parse the page count.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEX_FILE="$1"

if [[ ! -f "$TEX_FILE" ]]; then
  echo "error: tex file not found: $TEX_FILE" >&2
  exit 1
fi

TECTONIC="$ROOT_DIR/.bin/tectonic"
BUILD_DIR="$ROOT_DIR/build"
mkdir -p "$BUILD_DIR"

BASENAME="$(basename "$TEX_FILE" .tex)"

"$TECTONIC" --outdir "$BUILD_DIR" "$TEX_FILE"

PDF_PATH="$BUILD_DIR/$BASENAME.pdf"

if [[ ! -f "$PDF_PATH" ]]; then
  echo "error: compile did not produce $PDF_PATH" >&2
  exit 1
fi

PAGES="$("$ROOT_DIR/.venv/bin/python" "$ROOT_DIR/scripts/pdf_info.py" "$PDF_PATH" --pages-only)"

echo "PDF: $PDF_PATH"
echo "PAGES: $PAGES"
