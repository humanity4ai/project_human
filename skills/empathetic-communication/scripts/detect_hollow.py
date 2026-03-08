#!/usr/bin/env python3
"""
Detect hollow empathy phrases in text.

Usage:
    python3 scripts/detect_hollow.py --input response.txt [--format json|text]
"""
import argparse
import json
import re
import sys


HOLLOW_PHRASES = [
    (r"i know how you feel", "Claims to know exactly how they feel"),
    (r"i understand how you feel", "Claims to understand"),
    (r"i know exactly what you're going through", "Claims certainty"),
    (r"it could be worse", "Minimizes with comparison"),
    (r"at least", "Minimizes with positive spin"),
    (r"you.?ll be fine", "False reassurance"),
    (r"stay positive", "Dismisses feelings"),
    (r"everything happens for a reason", "Dismissive cliché"),
    (r"it.?ll all work out", "False positivity"),
]


def detect_hollow(text: str) -> dict:
    """Detect hollow empathy."""
    text_lower = text.lower()
    result = {"hollow_detected": False, "phrases": []}

    for pattern, description in HOLLOW_PHRASES:
        if re.search(pattern, text_lower):
            result["hollow_detected"] = True
            result["phrases"].append({"pattern": pattern, "issue": description})

    return result


def main():
    parser = argparse.ArgumentParser(description="Detect hollow empathy", epilog=__doc__)
    parser.add_argument("--input", "-i", help="Input file")
    parser.add_argument("--text", "-t", help="Text to analyze")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()
    if not args.input and not args.text:
        print("Error: --input or --text required", file=sys.stderr)
        sys.exit(2)

    text = args.text or open(args.input).read()
    result = detect_hollow(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["hollow_detected"]:
            print("Hollow empathy detected:")
            for p in result["phrases"]:
                print(f"  - {p['issue']}")
        else:
            print("No hollow empathy detected")

    sys.exit(0 if not result["hollow_detected"] else 1)


if __name__ == "__main__":
    main()
