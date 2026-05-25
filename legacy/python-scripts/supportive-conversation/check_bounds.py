#!/usr/bin/env python3
"""
Check if response stays within appropriate boundaries.

Usage:
    python3 scripts/check_bounds.py --input response.txt [--format json|text]
    python3 scripts/check_bounds.py --text "You should try meditation" --format json
"""
import argparse
import json
import re
import sys


OUT_OF_BOUNDS = {
    "clinical_advice": [
        r"(diagnos|treat|prescribe|medication|therapy)",
        r"(you (have|should see).*(doctor|psychiatrist|therapist))",
    ],
    "promising_outcomes": [
        r"(guarantee|sure|definitely).*better",
        r"(will|will definitely|will surely).*(fix|solve|heal)",
    ],
    "dismissive": [
        r"(don'?t (be|sad|cry|worry|feel))",
        r"(it'?s (not|never) (a big deal|that bad))",
    ],
    "cliches": [
        r"(everything happens for a reason)",
        r"(time heals all wounds)",
    ],
}


IN_BOUNDS = [
    r"(i'?m (sorry|here|not a professional))",
    r"(i can)?( offer| provide).*(support|presence|listening)",
    r"(suggest|consider|may want to).*(professional help|resources|support)",
    r"(not (sure|certain|know))",
    r"(everyone).*(different)",
]


def check_bounds(text: str) -> dict:
    """Check if response is within appropriate boundaries."""
    text_lower = text.lower()
    result = {
        "within_bounds": True,
        "issues": [],
        "positives": [],
    }

    for category, patterns in OUT_OF_BOUNDS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                result["issues"].append(f"Out of bounds: {category}")
                result["within_bounds"] = False

    for pattern in IN_BOUNDS:
        if re.search(pattern, text_lower):
            result["positives"].append(f"In bounds: {pattern}")

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Check if response stays within boundaries",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", help="Input file to check")
    parser.add_argument("--text", "-t", help="Text to check directly")
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
    else:
        text = args.text

    result = check_bounds(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["within_bounds"]:
            print("Response is within boundaries")
        else:
            print("Response has boundary issues:")
            for issue in result["issues"]:
                print(f"  - {issue}")

        if args.verbose and result["positives"]:
            print("\nPositive indicators:")
            for pos in result["positives"]:
                print(f"  + {pos}")

    sys.exit(0 if result["within_bounds"] else 1)


if __name__ == "__main__":
    main()
