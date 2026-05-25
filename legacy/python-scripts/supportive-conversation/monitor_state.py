#!/usr/bin/env python3
"""
Monitor conversation state for escalation indicators.

Usage:
    python3 scripts/monitor_state.py --input conversation.txt [--format json|text]
    python3 scripts/monitor_state.py --history "msg1\nmsg2\nmsg3" --format json
"""
import argparse
import json
import re
import sys


ESCALATION_PATTERNS = [
    r"(suicide|suicidal|kill myself|end my life)",
    r"(better off|better if).*without me",
    r"(hopeless|worthless|burden)",
    r"(can'?t do|don'?t want to).*anymore",
    r"(pain|suffering).*unbearable",
]


def monitor_state(messages: list) -> dict:
    """Monitor conversation for escalation indicators."""
    result = {
        "status": "stable",
        "escalation_count": 0,
        "risk_indicators": [],
        "recommendation": "Continue with standard support",
    }

    full_text = " ".join(messages).lower()

    for pattern in ESCALATION_PATTERNS:
        if re.search(pattern, full_text):
            result["risk_indicators"].append(pattern)
            result["escalation_count"] += 1

    if result["escalation_count"] >= 2:
        result["status"] = "critical"
        result["recommendation"] = "Immediate escalation required - provide crisis resources"
    elif result["escalation_count"] == 1:
        result["status"] = "elevated"
        result["recommendation"] = "Provide crisis resources, closely monitor"

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Monitor conversation state for risk",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", help="Input file with conversation (one message per line)")
    parser.add_argument("--history", "-h", help="Conversation history (newline separated)")
    parser.add_argument(
        "--format",
        "-f",
        choices=["json", "text"],
        default="text",
        help="Output format",
    )

    args = parser.parse_args()

    if not args.input and not args.history:
        print("Error: Either --input or --history must be provided", file=sys.stderr)
        sys.exit(2)

    if args.input:
        try:
            with open(args.input) as f:
                messages = [line.strip() for line in f if line.strip()]
        except FileNotFoundError:
            print(f"Error: File not found: {args.input}", file=sys.stderr)
            sys.exit(1)
    else:
        messages = [line.strip() for line in args.history.split("\\n") if line.strip()]

    result = monitor_state(messages)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"Status: {result['status'].upper()}")
        print(f"Risk count: {result['escalation_count']}")
        print(f"Recommendation: {result['recommendation']}")

    sys.exit(0)


if __name__ == "__main__":
    main()
