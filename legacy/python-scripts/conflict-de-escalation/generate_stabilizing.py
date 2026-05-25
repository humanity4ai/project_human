#!/usr/bin/env python3
"""
Generate stabilizing/de-escalating language.

Usage:
    python3 scripts/generate_stabilizing.py --input message.txt [--format json|text]
"""
import argparse
import json
import sys


STABILIZING_PHRASES = {
    "validation": [
        "I understand this is frustrating.",
        "I can see why you'd be upset.",
        "Your concerns are valid.",
        "I'm sorry you've had this experience.",
    ],
    "empathy": [
        "I would feel frustrated too.",
        "This sounds really difficult.",
        "I can imagine how frustrating this is.",
    ],
    "solution": [
        "Here's what I can do to help.",
        "Let's work together on this.",
        "What would help most right now?",
        "I want to find a solution for you.",
    ],
    "boundary": [
        "I need you to speak respectfully so we can solve this.",
        "Here's what I can offer.",
        "I can help with this, but that would need supervisor approval.",
    ],
}


def generate_stabilizing(intensity: str = "moderate") -> dict:
    """Generate stabilizing language based on intensity."""
    result = {
        "intensity": intensity,
        "phrases": [],
    }

    if intensity in ["critical", "high"]:
        result["phrases"].extend(STABILIZING_PHRASES["validation"][:2])
        result["phrases"].append("I want to help you. Let's take a breath together.")
        result["phrases"].extend(STABILIZING_PHRASES["boundary"][:1])
    else:
        result["phrases"].extend(STABILIZING_PHRASES["validation"])
        result["phrases"].extend(STABILIZING_PHRASES["empathy"][:1])
        result["phrases"].extend(STABILIZING_PHRASES["solution"])

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Generate stabilizing language",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--intensity",
        choices=["low", "moderate", "high", "critical"],
        default="moderate",
    )
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()
    result = generate_stabilizing(args.intensity)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"Stabilizing phrases for {args.intensity} intensity:\n")
        for phrase in result["phrases"]:
            print(f"- {phrase}")

    sys.exit(0)


if __name__ == "__main__":
    main()
