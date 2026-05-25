#!/usr/bin/env python3
"""
Validate that a response is safe and appropriate.

Usage:
    python3 scripts/validate_safe.py --input response.txt [--format json|text]
    python3 scripts/validate_safe.py --text "Call 988 for help" --format json
"""
import argparse
import json
import re
import sys


UNSAFE_PATTERNS = {
    "dismissive": [
        r"(don'?t (be|sad|cry|worry|feel|panic))",
        r"(it'?s (not|never|not that)) (a big deal|that bad|important)",
        r"(you should(n't)? (be|sad|worried|afraid))",
    ],
    "minimizing": [
        r"(it could be worse|at least)",
        r"(you should be grateful|other people)",
        r"(not (that|very|so) (bad|serious|important))",
    ],
    "fixing": [
        r"(have you tried|you should|you need to|why don'?t you)",
        r"(just (think|do|get|take).*(better|happy|solved))",
    ],
    "cliches": [
        r"(everything happens for a reason)",
        r"(time heals all wounds)",
        r"(everything will (be fine|work out|get better))",
        r"(god has a plan|in a better place)",
    ],
    "promising": [
        r"(guarantee|will definitely|will surely)",
        r"(definitely (fix|solve|make.*better))",
    ],
    "diagnosing": [
        r"(you (have|are|seem).*(depression|anxiety|mental))",
        r"(that'?s (a|signs? of) (mental|psychological))",
    ],
    "advice_clinical": [
        r"(prescribe|medication|drugs?|treatment plan)",
        r"(see a (doctor|psychiatrist|therapist|therapist))",
    ],
}


SAFE_PATTERNS = [
    r"(i'?m (sorry|here|not))",
    r"(you (feel|are feeling))",
    r"(it makes sense)",
    r"(your feelings are valid)",
    r"(thank you for)",
    r"(i hear you)",
    r"(i can'?t|unable to)",
    r"(i'?m not a professional)",
    r"(suggest|consider).*(professional|resources|help)",
    r"(988|crisis line|support)",
]


def validate_safe(text: str) -> dict:
    """Validate that a response is safe."""
    text_lower = text.lower()
    result = {
        "is_safe": True,
        "score": 5,
        "issues": [],
        "warnings": [],
    }

    for category, patterns in UNSAFE_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                result["issues"].append(f"Unsafe: {category}")
                result["is_safe"] = False
                result["score"] -= 1

    safe_count = 0
    for pattern in SAFE_PATTERNS:
        if re.search(pattern, text_lower):
            safe_count += 1

    if safe_count == 0:
        result["warnings"].append("No validating language detected")
        result["score"] -= 1

    if "988" not in text_lower and any(
        re.search(p, text_lower)
        for p in [r"(suicide|suicidal|kill|harm|die)", r"(end it)"]
    ):
        result["warnings"].append("Crisis detected but no resources provided")
        result["score"] -= 2
        result["is_safe"] = False

    result["score"] = max(1, min(5, result["score"]))

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Validate safe response",
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
    else:
        text = args.text

    result = validate_safe(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["is_safe"]:
            print(f"Response is safe (score: {result['score']}/5)")
        else:
            print(f"Response needs improvement (score: {result['score']}/5)")
            for issue in result["issues"]:
                print(f"  - {issue}")

        if args.verbose:
            if result["warnings"]:
                print("\nWarnings:")
                for warning in result["warnings"]:
                    print(f"  ! {warning}")

    sys.exit(0 if result["is_safe"] else 1)


if __name__ == "__main__":
    main()
