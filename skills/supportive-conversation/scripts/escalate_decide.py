#!/usr/bin/env python3
"""
Determine if escalation to professional help is needed.

Usage:
    python3 scripts/escalate_decide.py --input message.txt [--format json|text]
    python3 scripts/escalate_decide.py --text "I want to end it all" --format json
"""
import argparse
import json
import re
import sys


ESCALATE_IMMEDIATE = [
    r"(suicide|suicidal|kill myself|end my life|end it all)",
    r"(better off|better if).*without me",
    r"(have|got).*(pills|knife|rope|weapon).*(now|ways?)",
    r"(going to|today|tomorrow).*(do it|harm)",
]

ESCALATE_HIGH = [
    r"(harm|kill).*(self|myself)",
    r"(hopeless|worthless|burden)",
    r"(can'?t do|don'?t want to).*anymore",
    r"(pain|suffering).*unbearable",
    r"(overdose|take all).*pills",
]

ESCALATE_SUGGEST = [
    r"(stressed|overwhelmed|depressed|anxious).*(lot|very|really|constantly)",
    r"(struggling|hard time).*(coping|dealing|getting through)",
    r"(can'?t|don'?t know).*what.*do",
    r"(need|want).*help",
    r"(therapy|counselor|professional).*need",
]

ESCALATE_NONE = [
    r"(fine|okay|good).*(today|now|okay)",
    r"(better|improving).*(lot|much|now)",
    r"(just|only).*(vent|talk|share)",
]


def should_escalate(text: str) -> dict:
    """Determine if escalation is needed."""
    text_lower = text.lower()
    result = {
        "escalate": False,
        "level": "none",
        "reason": "No escalation needed",
        "resources_to_provide": [],
    }

    for pattern in ESCALATE_IMMEDIATE:
        if re.search(pattern, text_lower):
            result["escalate"] = True
            result["level"] = "immediate"
            result["reason"] = "Immediate risk indicators detected"
            result["resources_to_provide"] = [
                "Call/text 988 (US)",
                "Text HOME to 741741",
                "Call 911 if immediate danger",
            ]
            return result

    for pattern in ESCALATE_HIGH:
        if re.search(pattern, text_lower):
            result["escalate"] = True
            result["level"] = "high"
            result["reason"] = "High risk indicators detected"
            result["resources_to_provide"] = [
                "Call/text 988",
                "Text HOME to 741741",
                "SAMHSA: 1-800-662-4357",
            ]
            return result

    for pattern in ESCALATE_SUGGEST:
        if re.search(pattern, text_lower):
            result["escalate"] = True
            result["level"] = "suggest"
            result["reason"] = "Suggest professional help"
            result["resources_to_provide"] = [
                "Psychology Today therapist directory",
                "SAMHSA: 1-800-662-4357",
            ]
            return result

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Determine if escalation is needed",
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

    result = should_escalate(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["escalate"]:
            print(f"Escalation needed: {result['level'].upper()}")
            print(f"Reason: {result['reason']}")
            print("\nResources to provide:")
            for r in result["resources_to_provide"]:
                print(f"  - {r}")
        else:
            print("No escalation needed")

    sys.exit(0)


if __name__ == "__main__":
    main()
