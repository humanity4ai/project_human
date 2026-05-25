#!/usr/bin/env python3
"""
Assess severity of emotional distress in text.

Usage:
    python3 scripts/assess_severity.py --input message.txt [--format json|text]
    python3 scripts/assess_severity.py --text "I'm really struggling" --format json
"""
import argparse
import json
import re
import sys


SEVERITY_INDICATORS = {
    "critical": [
        r"(suicide|suicidal|kill myself|end my life|end it all)",
        r"(better off|better if).*without me",
        r"(harm|kill).*self",
        r"(pills|rope|knife|weapon).*(now|ways?)",
    ],
    "high": [
        r"(hopeless|worthless|burden)",
        r"(can'?t do|don'?t want to).*anymore",
        r"(nothing|much longer).*(take|handle|do)",
        r"(pain|suffering).*unbearable",
    ],
    "moderate": [
        r"(overwhelmed|stressed|anxious|depressed).*(lot|very|really)",
        r"(struggling|hard time).*(coping|dealing|getting through)",
        r"(don'?t know|can'?t).*what.*do",
    ],
    "low": [
        r"(upset|sad|frustrated|annoyed).*(little|bit|slightly)",
        r"(hard|difficult).*(day|moment|while)",
        r"(could use|talking helps).*(support|vent)",
    ],
}


def assess_severity(text: str) -> dict:
    """Assess severity of emotional distress."""
    text_lower = text.lower()
    result = {
        "severity": "low",
        "severity_score": 1,
        "indicators": [],
        "recommendation": "Standard support",
    }

    severity_order = ["critical", "high", "moderate", "low"]

    for severity in severity_order:
        for pattern in SEVERITY_INDICATORS.get(severity, []):
            if re.search(pattern, text_lower):
                result["indicators"].append(pattern)
                result["severity"] = severity
                result["severity_score"] = 4 if severity == "critical" else 3 if severity == "high" else 2
                break

    if result["severity"] == "critical":
        result["recommendation"] = "Immediate crisis response required - provide 988, Crisis Text Line"
    elif result["severity"] == "high":
        result["recommendation"] = "High priority - provide crisis resources, encourage professional help"
    elif result["severity"] == "moderate":
        result["recommendation"] = "Offer support, suggest professional help if ongoing"
    else:
        result["recommendation"] = "Standard emotional support"

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Assess severity of emotional distress",
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

    result = assess_severity(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"Severity: {result['severity'].upper()} ({result['severity_score']}/4)")
        print(f"Recommendation: {result['recommendation']}")
        if args.verbose and result["indicators"]:
            print(f"Indicators found: {result['indicators']}")

    sys.exit(0)


if __name__ == "__main__":
    main()
