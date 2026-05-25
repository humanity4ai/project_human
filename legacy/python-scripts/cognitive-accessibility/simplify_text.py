#!/usr/bin/env python3
"""Simplify Text - Suggest simplifications"""
import argparse
import re
import sys
from pathlib import Path

JARGON_MAP = {
    "utilize": "use",
    "implement": "do",
    "facilitate": "help",
    "commence": "start",
    "terminate": "end",
    "authentication": "sign in",
    "authorization": "permission",
    "submit": "send",
    "inquire": "ask",
    "additional": "more",
}

def simplify_text(text: str) -> dict:
    suggestions = []
    for old, new in JARGON_MAP.items():
        if re.search(old, text, re.IGNORECASE):
            suggestions.append({"from": old, "to": new})
    return {'success': len(suggestions) == 0, 'suggestions': suggestions}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = simplify_text(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Simplifications: {len(result['suggestions'])}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
