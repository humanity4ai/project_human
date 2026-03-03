#!/usr/bin/env python3
"""
Validate that a response shows genuine empathy.

Usage:
    python3 scripts/validate_empathy.py --input response.txt [--format json|text]
    python3 scripts/validate_empathy.py --text "I'm so sorry you're going through this" --format json
"""
import argparse
import json
import re
import sys


EMPATHETIC_PATTERNS = [
    r"(i can (hear|see|understand))",
    r"(that sounds)",
    r"(i'?m (sorry|here))",
    r"(your feelings)",
    r"(make(s)? (complete|sense))",
    r"(valid)",
    r"(difficult|hard|frustrating)",
    r"(what you'?re going through)",
]

HOLLOW_PATTERNS = [
    r"(i know how you feel)",
    r"(i understand how you feel)",
    r"(i know exactly)",
    r"(it could be worse)",
    r"(at least)",
    r"(you'?ll be fine)",
    r"(stay positive)",
    r"(everything happens for a reason)",
]


def validate_empathy(text: str) -> dict:
    """Validate empathy in text."""
    text_lower = text.lower()
    result = {"is_empathetic": True, "score": 5, "issues": [], "positives": []}

    for pattern in HOLLOW_PATTERNS:
        if re.search(pattern, text_lower):
            result["issues"].append(f"Hollow empathy: {pattern}")
            result["is_empathetic"] = False
            result["score"] -= 1

    for pattern in EMPATHETIC_PATTERNS:
        if re.search(pattern, text_lower):
            result["positives"].append(f"Found: {pattern}")

    result["score"] = max(1, min(5, result["score"]))
    return result


def main():
    parser = argparse.ArgumentParser(description="Validate empathy", epilog=__doc__)
    parser.add_argument("--input", "-i", help="Input file")
    parser.add_argument("--text", "-t", help="Text to validate")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()
    if not args.input and not args.text:
        print("Error: --input or --text required", file=sys.stderr)
        sys.exit(2)

    text = args.text or open(args.input).read()
    result = validate_empathy(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        status = "Empathetic" if result["is_empathetic"] else "Needs improvement"
        print(f"{status} (score: {result['score']}/5)")
        if result["issues"]:
            print("Issues:")
            for issue in result["issues"]:
                print(f"  - {issue}")

    sys.exit(0 if result["is_empathetic"] else 1)


if __name__ == "__main__":
    main()
