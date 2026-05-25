#!/usr/bin/env python3
"""
Detect emotional cues in text.

Usage:
    python3 scripts/detect_cues.py --input message.txt [--format json|text]
    python3 scripts/detect_cues.py --text "I'm feeling really anxious about this" --format json
"""
import argparse
import json
import re
import sys


EMOTIONAL_CUES = {
    "fear_anxiety": [
        r"(anxious|anxiety|nervous|scared|afraid|fear|worried|worry)",
        r"(panic|stress|stressed|overwhelmed)",
        r"(can'?t stop| Racing| intrusive)",
    ],
    "sadness_grief": [
        r"(sad|sadness|depressed|depression|grief|grieving)",
        r"(lost|loss|passed away|died)",
        r"(crying|cry|tears|heartbroken|sorrow)",
        r"(hopeless|helpless|empty|numb)",
    ],
    "anger_frustration": [
        r"(angry|anger|frustrated|frustration|mad|irritated)",
        r"(annoyed|aggravated|infuriated|furious)",
        r"(fed up|had enough|can'?t take)",
    ],
    "loneliness_isolation": [
        r"(lonely|loneliness|alone|isolated|abandoned)",
        r"(no one| nobody| everyone| friendless)",
        r"(disconnected|unheard|unseen|understood)",
    ],
    "shame_guilt": [
        r"(ashamed|guilty|shame|embarrassed|humiliated)",
        r"(failure|failed|worthless|not good enough)",
        r"(burden|let down|disappointed)",
    ],
    "love_connection": [
        r"(love|care|miss|appreciate|grateful)",
        r"(happy|joy|excited|wonderful|amazing)",
        r"(connected|understood|seen|heard)",
    ],
}


def detect_cues(text: str) -> dict:
    """Detect emotional cues in text."""
    text_lower = text.lower()
    result = {
        "emotions_detected": [],
        "primary_emotion": None,
        "intensity": "unknown",
    }

    for emotion, patterns in EMOTIONAL_CUES.items():
        matches = []
        for pattern in patterns:
            if re.search(pattern, text_lower):
                matches.append(pattern)
        if matches:
            result["emotions_detected"].append({
                "emotion": emotion,
                "matches": matches,
            })

    if result["emotions_detected"]:
        result["primary_emotion"] = result["emotions_detected"][0]["emotion"]

        primary_text = text_lower
        intensity_patterns = {
            "high": r"(so |very|really|extremely|overwhelmingly|intensely)",
            "moderate": r"(pretty|somewhat|fairly|moderately)",
            "low": r"(little bit|slightly|a (little|bit))",
        }

        for intensity, pattern in intensity_patterns.items():
            if re.search(pattern, primary_text):
                result["intensity"] = intensity
                break

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Detect emotional cues in text",
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

    result = detect_cues(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["emotions_detected"]:
            print(f"Primary emotion: {result['primary_emotion']}")
            print(f"Intensity: {result['intensity']}")
            print("\nEmotions detected:")
            for e in result["emotions_detected"]:
                print(f"  - {e['emotion']}")
        else:
            print("No specific emotional cues detected")

    sys.exit(0)


if __name__ == "__main__":
    main()
