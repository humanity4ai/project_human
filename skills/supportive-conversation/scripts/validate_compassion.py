#!/usr/bin/env python3
"""
Validate that a response is compassionate and supportive.

Usage:
    python3 scripts/validate_compassion.py --input response.txt [--format json|text]
    python3 scripts/validate_compassion.py --text "I'm here for you" --format json
"""
import argparse
import json
import re
import sys


HARMFUL_PATTERNS = {
    "minimizing": [
        r"(it could be worse|at least|you should be grateful)",
        r"(don'?t (be|cry|worry|cheer))",
        r"(not that (big|hard|bad))",
        r"(others have it worse)",
    ],
    "fixing": [
        r"(have you tried|you should|you need to|why don'?t you)",
        r"(just think positive|just relax|just (do|get)).*better",
    ],
    "cliches": [
        r"(everything happens for a reason|time heals all wounds)",
        r"(everything will (work out|be fine|get better))",
        r"(in a better place|god has a plan)",
    ],
    "comparisons": [
        r"(i had it worse|i).*?(harder| worse|better)",
        r"(at least).*?(than others|than me)",
    ],
    "dismissive": [
        r"(it'?s fine|it'?s okay|you'?ll be fine)",
        r"(get over it|move on|past it)",
    ],
}

SUPPORTIVE_PATTERNS = [
    r"(i'?m (so )?(sorry|here))",
    r"(that sounds (difficult|hard|challenging))",
    r"(it makes sense)",
    r"(validate|valid)",
    r"(understand)",
    r"(thank you for)",
    r"(i'?m with you)",
    r"(you'?re not alone)",
    r"(take your time)",
    r"(i hear you)",
]


def validate_compassion(text: str) -> dict:
    """Validate that a response is compassionate."""
    text_lower = text.lower()
    result = {
        "is_compassionate": True,
        "score": 5,
        "issues": [],
        "positives": [],
    }

    for category, patterns in HARMFUL_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                result["issues"].append(f"Issue: {category} language detected")
                result["is_compassionate"] = False
                result["score"] -= 1

    for pattern in SUPPORTIVE_PATTERNS:
        if re.search(pattern, text_lower):
            result["positives"].append(f"Positive: Found supportive pattern")

    result["score"] = max(1, min(5, result["score"]))

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Validate compassionate response",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", help="Input file to validate")
    parser.add_argument("--text", "-t", help="Text to validate directly")
    parser.add_argument(
        "--format",
        "-f",
        choices=["json", "text"],
        default="text",
        help="Output format",
    )
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    if not args.input and not args.text:
        print("Error: Either --input or --text must be provided", file=sys.stderr)
        sys.exit(2)

    if args.input:
        try:
            with open(args.input) as f:
                text = f.read()
        except FileNotFoundError:
            print(f"Error: File not found: {args.input}", file=sys.stderr)
            sys.exit(1)
        except PermissionError:
            print(f"Error: Permission denied: {args.input}", file=sys.stderr)
            sys.exit(1)
    else:
        text = args.text

    result = validate_compassion(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["is_compassionate"]:
            print(f"Response is compassionate (score: {result['score']}/5)")
        else:
            print(f"Response needs improvement (score: {result['score']}/5)")
            for issue in result["issues"]:
                print(f"  - {issue}")

        if args.verbose and result["positives"]:
            print("\nPositives:")
            for pos in result["positives"]:
                print(f"  + {pos}")

    sys.exit(0 if result["is_compassionate"] else 1)


if __name__ == "__main__":
    main()
