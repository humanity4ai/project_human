#!/usr/bin/env python3
"""Visual Hierarchy - Check visual hierarchy"""
import argparse
import sys
from pathlib import Path

def visual_hierarchy(text: str) -> dict:
    headings = [l for l in text.split('\n') if l.startswith('#')]
    return {'success': len(headings) > 0, 'heading_count': len(headings)}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = visual_hierarchy(content)
    print(f"Headings: {result['heading_count']}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
