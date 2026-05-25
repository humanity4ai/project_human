#!/usr/bin/env python3
"""
Audit content for age-related assumptions.

Usage:
    python3 scripts/audit_assumptions.py --input content.txt [--format json|text]
"""
import argparse
import json
import re
import sys


AGE_ASSUMPTIONS = {
    "negative": [
        (r"\b(elderly|senior|old (people|adults|users))\s+(can'?t|don'?t|will not|are not able to)", "Assumes inability"),
        (r"\b(older users|elderly)\s+(always|never|can'?t)", "Overgeneralization"),
        (r"(tech-?illiterate|technology averse|can'?t learn)", "Tech stereotype"),
        (r"(memory problems|dementia|senile)", "Health assumption"),
    ],
    "positive": [
        r"\b(may prefer|often prefer|can benefit from|consider)",
    ]
}


def audit_assumptions(text: str) -> dict:
    """Audit for age-related assumptions."""
    text_lower = text.lower()
    result = {"issues": [], "assumptions_found": False}

    for category, patterns in AGE_ASSUMPTIONS["negative"]:
        if category == "negative":
            for pattern in patterns:
                if re.search(pattern[0], text_lower):
                    result["issues"].append(f"Issue: {pattern[1]}")
                    result["assumptions_found"] = True

    return result


def main():
    parser = argparse.ArgumentParser(description="Audit age assumptions", epilog=__doc__)
    parser.add_argument("--input", "-i", help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()
    if not args.input:
        print("Error: --input required", file=sys.stderr)
        sys.exit(2)

    with open(args.input) as f:
        text = f.read()

    result = audit_assumptions(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["assumptions_found"]:
            print("Age assumptions detected:")
            for issue in result["issues"]:
                print(f"  - {issue}")
        else:
            print("No problematic age assumptions detected")

    sys.exit(0 if not result["assumptions_found"] else 1)


if __name__ == "__main__":
    main()
