#!/usr/bin/env python3
"""
Detect risk indicators in text for crisis identification.

Usage:
    python3 scripts/detect_risk.py --input message.txt [--format json|text]
    python3 scripts/detect_risk.py --text "I want to end it all" --format json
"""
import argparse
import json
import re
import sys


RISK_PATTERNS = {
    "suicidal_ideation": [
        r"want to (die|kill myself|end it all|end my life)",
        r"thoughts? of (suicide|dying|killing myself)",
        r"(suicide|kill myself|end it)",
        r"(better off|better if).*without me",
        r"(no point|nothing to live for)",
        r"life isn'?t worth living",
        r"(tired of|can'?t do).*anymore",
        r"(burden|worthless)",
    ],
    "self_harm": [
        r"cut(ting)? myself",
        r"hurt(ing)? myself",
        r"self.?harm",
        r"(pills|medication|rope|knife).*ways?.*harm",
        r"(overdose|kill myself).*method",
    ],
    "hopelessness": [
        r"(never|can'?t).*get.*better",
        r"(nothing|everything).*hopeless",
        r"no way out",
        r"(won'?t|can'?t).*improve",
    ],
    "immediate_danger": [
        r"(have|got).*(pills|knife|rope|weapon)",
        r"(going to|tomorrow|today).*do.*(it|harm)",
        r"final.*(goodbye|message)",
        r"(right now|immediate).*harm",
    ],
}


def detect_risk(text: str) -> dict:
    """Detect risk indicators in text."""
    text_lower = text.lower()
    results = {
        "risk_detected": False,
        "risk_level": "none",
        "indicators": [],
        "categories": [],
    }

    for category, patterns in RISK_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                results["indicators"].append(pattern)
                results["categories"].append(category)
                results["risk_detected"] = True

    if results["risk_detected"]:
        if "immediate_danger" in results["categories"]:
            results["risk_level"] = "immediate"
        elif "suicidal_ideation" in results["categories"]:
            results["risk_level"] = "high"
        elif "self_harm" in results["categories"]:
            results["risk_level"] = "high"
        elif "hopelessness" in results["categories"]:
            results["risk_level"] = "moderate"

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Detect risk indicators in text",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", help="Input file to analyze")
    parser.add_argument("--text", "-t", help="Text to analyze directly")
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

    result = detect_risk(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["risk_detected"]:
            print(f"RISK DETECTED: {result['risk_level'].upper()}")
            print(f"Categories: {', '.join(result['categories'])}")
            if args.verbose:
                print(f"Matched patterns: {result['indicators']}")
            print("\nResources:")
            print("  - Call/text 988 (US)")
            print("  - Text HOME to 741741")
        else:
            print("No risk indicators detected")

    sys.exit(0 if not result["risk_detected"] else 1)


if __name__ == "__main__":
    main()
