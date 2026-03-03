#!/usr/bin/env python3
"""
Detect age stereotypes in content.

Usage:
    python3 scripts/detect_stereotypes.py --input content.txt [--format json|text]
"""
import argparse
import json
import re
import sys


STEREOTYPES = [
    (r"\belderly\b", "Use 'older adults' instead of 'elderly'"),
    (r"\bsenile\b", "Avoid - use specific terms"),
    (r"\bold (people|folk|sters)\b", "Use 'older adults'"),
    (r"\bgrandma|grandpa\b", "Avoid - unless referring to family"),
    (r"\btech-?illiterate\b", "Avoid stereotype"),
    (r"\bdon'?t understand (technology|computers|the internet)\b", "Overgeneralization"),
    (r"\b(never|can'?t) learn (new things|technology)\b", "Assumption about ability"),
]


def detect_stereotypes(text: str) -> dict:
    """Detect age stereotypes."""
    text_lower = text.lower()
    result = {"stereotypes_found": False, "issues": []}

    for pattern, suggestion in STEREOTYPES:
        if re.search(pattern, text_lower):
            result["stereotypes_found"] = True
            result["issues"].append({"pattern": pattern, "suggestion": suggestion})

    return result


def main():
    parser = argparse.ArgumentParser(description="Detect age stereotypes", epilog=__doc__)
    parser.add_argument("--input", "-i", help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()
    if not args.input:
        print("Error: --input required", file=sys.stderr)
        sys.exit(2)

    with open(args.input) as f:
        text = f.read()

    result = detect_stereotypes(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["stereotypes_found"]:
            print("Age stereotypes detected:")
            for issue in result["issues"]:
                print(f"  - {issue['pattern']}: {issue['suggestion']}")
        else:
            print("No age stereotypes detected")

    sys.exit(0 if not result["stereotypes_found"] else 1)


if __name__ == "__main__":
    main()
