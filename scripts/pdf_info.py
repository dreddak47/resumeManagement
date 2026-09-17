#!/usr/bin/env python3
"""Report page count and extracted text for a compiled resume PDF.

Usage:
  scripts/pdf_info.py build/sde.pdf              # prints page count + full text
  scripts/pdf_info.py build/sde.pdf --pages-only # prints just the integer page count
"""
import argparse
import sys

from pypdf import PdfReader


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf_path")
    parser.add_argument("--pages-only", action="store_true")
    args = parser.parse_args()

    reader = PdfReader(args.pdf_path)
    num_pages = len(reader.pages)

    if args.pages_only:
        print(num_pages)
        return

    print(f"PAGES: {num_pages}")
    print("--- TEXT ---")
    for i, page in enumerate(reader.pages, 1):
        print(f"\n[page {i}]")
        print(page.extract_text())


if __name__ == "__main__":
    sys.exit(main())
