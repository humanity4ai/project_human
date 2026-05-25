#!/usr/bin/env python3
"""
Detect escalation triggers in text.

Usage:
    python3 scripts/detect_triggers.py --input message.txt [--format json|text]
    python3 scripts/detect_triggers.py --text "I'm about to lose it!" --format json
"""
import argparse
import json
import re
import sys


ESCALATION_TRIGGERS = {
    "aggression": [
        r"(lose it|losing it)",
        r"(about to|going to).*(hit|kill|hurt|fight)",
        r"(shut up|shut your)",
        r"(expletive|damn|shit|fuck|ass)",
    ],
    "threats": [
        r"(i'?ll|going to).*(sue|fire|report)",
        r"(going to|about to).*(call|get).*(police|manager|supervisor)",
        r"(you'?re|you are).*(dead|toast|fired)",
    ],
    "frustration": [
        r"(ridiculous|unacceptable|worst|terrible).*(service|experience|ever)",
        r"(waited|waiting).*(hour|30 minutes|forever|long)",
        r"(third|fourth|fifth).*time",
        r"(passed around|transferred).*(multiple|several|many)",
    ],
    "dismissive_response": [
        r"(calm down|calm yourself)",
        r"(you'?re overreacting|overreacting)",
        r"(not a big deal|not that big)",
    ],
}


def detect_triggers(text: str) -> dict:
    """Detect escalation triggers in text."""
    text_lower = text.lower()
    result = {
        "triggers_detected": False,
        "level": "none",
        "triggers": [],
    }

    for category, patterns in ESCALATION_TRIGGERS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                result["triggers"].append(category)
                result["triggers_detected"] = True

    if result["triggers_detected"]:
        if "aggression" in result["triggers"] or "threats" in result["triggers"]:
            result["level"] = "high"
        else:
            result["level"] = "moderate"

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Detect escalation triggers",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", help="Input file")
    parser.add_argument("--text", "-t", help="Text to analyze")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()

    if not args.input and not args.text:
        print("Error: Either --input or --text required", file=sys.stderr)
        sys.exit(2)

    text = args.text if args.text else open(args.input).read() if args.input else ""
    result = detect_triggers(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["triggers_detected"]:
            print(f"Triggers detected: {result['level'].upper()}")
            print(f"Categories: {', '.join(set(result['triggers']))}")
        else:
            print("No triggers detected")

    sys.exit(0 if not result["triggers_detected"] else 1)


if __name__ == "__main__":
    main()
