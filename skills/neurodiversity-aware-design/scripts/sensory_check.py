#!/usr/bin/env python3
"""
Check for sensory triggers in content/design.

Usage:
    python3 scripts/sensory_check.py --input content.txt [--format json|text]
"""
import argparse
import json
import re
import sys


SENSORY_TRIGGERS = {
    "motion": [
        (r"animation(?:\s+is|\s+plays|autoplay)", "Auto-playing animation"),
        (r"(?:blinking|flashing|strobing)", "Flashing content"),
        (r"@keyframes.*infinite", "Infinite animation loop"),
    ],
    "audio": [
        (r"autoplay\s*(?:video|audio)", "Auto-playing audio/video"),
        (r"(?:no\s+)?muted\s+by\s+default", "Unmuted by default"),
    ],
    "visual": [
        (r"background(?:\s*-image)?:\s*url\(", "Background images can overwhelm"),
        (r"gradient\(", "Gradients can cause visual stress"),
    ],
}


def check_sensory(text: str) -> dict:
    """Check for sensory triggers."""
    result = {"triggers_found": False, "issues": []}

    for category, patterns in SENSORY_TRIGGERS.items():
        for pattern, description in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                result["triggers_found"] = True
                result["issues"].append({"category": category, "issue": description})

    return result


def main():
    parser = argparse.ArgumentParser(description="Check sensory triggers", epilog=__doc__)
    parser.add_argument("--input", "-i", help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()
    if not args.input:
        print("Error: --input required", file=sys.stderr)
        sys.exit(2)

    with open(args.input) as f:
        text = f.read()

    result = check_sensory(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["triggers_found"]:
            print("Sensory triggers detected:")
            for issue in result["issues"]:
                print(f"  - {issue['category']}: {issue['issue']}")
        else:
            print("No sensory triggers detected")

    sys.exit(0 if not result["triggers_found"] else 1)


if __name__ == "__main__":
    main()
