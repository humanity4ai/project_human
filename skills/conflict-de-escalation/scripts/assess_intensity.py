#!/usr/bin/env python3
"""
Assess conflict intensity level.

Usage:
    python3 scripts/assess_intensity.py --input message.txt [--format json|text]
    python3 scripts/assess_intensity.py --text "I'm really angry!" --format json
"""
import argparse
import json
import re
import sys


INTENSITY_PATTERNS = {
    "critical": [
        r"(kill|harm|weapon|knife|gun|bomb)",
        r"(suicide|kill myself|end it)",
        r"(going to|about to).*(hurt|hit|attack)",
    ],
    "high": [
        r"(lose it|losing it|about to)",
        r"(fuck|shit|damn).*(you|off)",
        r"(can'?t|won'?t).*control",
        r"(sue|police|manager).*(now|immediately)",
    ],
    "moderate": [
        r"(angry|mad|frustrated|upset).*(really|very|so)",
        r"(ridiculous|unacceptable|worst)",
        r"(waited|waiting).*(hour|long|forever)",
    ],
    "low": [
        r"(concerned|unhappy|disappointed)",
        r"(frustrated|annoyed).*(a bit|little|slightly)",
        r"(prefer|better|would appreciate)",
    ],
}


def assess_intensity(text: str) -> dict:
    """Assess conflict intensity."""
    text_lower = text.lower()
    result = {"intensity": "low", "level": 1, "indicators": []}

    for intensity, patterns in INTENSITY_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                result["indicators"].append(intensity)
                if intensity == "critical":
                    result["intensity"] = "critical"
                    result["level"] = 4
                elif intensity == "high" and result["level"] < 3:
                    result["intensity"] = "high"
                    result["level"] = 3
                elif intensity == "moderate" and result["level"] < 2:
                    result["intensity"] = "moderate"
                    result["level"] = 2

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Assess conflict intensity",
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
    result = assess_intensity(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"Intensity: {result['intensity'].upper()} ({result['level']}/4)")

    sys.exit(0)


if __name__ == "__main__":
    main()
