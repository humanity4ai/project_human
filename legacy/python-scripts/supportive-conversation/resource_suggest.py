#!/usr/bin/env python3
"""
Suggest appropriate resources based on situation.

Usage:
    python3 scripts/resource_suggest.py --situation crisis [--format json|text]
    python3 scripts/resource_suggest.py --situation moderate --format json
"""
import argparse
import json
import sys


RESOURCES = {
    "crisis": {
        "us": [
            {"name": "988 Suicide & Crisis Lifeline", "contact": "Call or text 988"},
            {"name": "Crisis Text Line", "contact": "Text HOME to 741741"},
            {"name": "SAMHSA", "contact": "1-800-662-4357"},
            {"name": "Emergency", "contact": "Call 911"},
        ],
        "uk": [
            {"name": "Samaritans", "contact": "Call 116 123"},
            {"name": "Emergency", "contact": "Call 999"},
        ],
        "ca": [
            {"name": "Crisis Services Canada", "contact": "Call 1-833-456-4566"},
            {"name": "Emergency", "contact": "Call 911"},
        ],
    },
    "moderate": {
        "general": [
            {"name": "Psychology Today", "url": "https://www.psychologytoday.com/"},
            {"name": "SAMHSA", "url": "https://www.samhsa.gov/find-help/national-helpline"},
            {"name": "NAMI", "url": "https://www.nami.org/Home"},
        ],
    },
    "support": {
        "general": [
            {"name": "7 Cups", "url": "https://www.7cups.com/"},
            {"name": "BetterHelp", "url": "https://www.bethelp.com/"},
            {"name": "Talkspace", "url": "https://www.talkspace.com/"},
        ],
    },
}


def suggest_resources(situation: str, region: str = "us") -> dict:
    """Suggest appropriate resources based on situation."""
    result = {
        "situation": situation,
        "region": region,
        "resources": [],
    }

    if situation == "crisis":
        if region in RESOURCES["crisis"]:
            result["resources"] = RESOURCES["crisis"][region]
        else:
            result["resources"] = RESOURCES["crisis"]["us"]
            result["note"] = "Defaulting to US resources"
    elif situation == "moderate":
        result["resources"] = RESOURCES["moderate"]["general"]
    elif situation == "support":
        result["resources"] = RESOURCES["support"]["general"]
    else:
        result["resources"] = []
        result["note"] = "Unknown situation type"

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Suggest appropriate resources",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--situation",
        "-s",
        choices=["crisis", "moderate", "support"],
        required=True,
        help="Situation type",
    )
    parser.add_argument(
        "--region",
        "-r",
        choices=["us", "uk", "ca", "au"],
        default="us",
        help="Region for crisis resources",
    )
    parser.add_argument(
        "--format",
        "-f",
        choices=["json", "text"],
        default="text",
        help="Output format",
    )

    args = parser.parse_args()

    result = suggest_resources(args.situation, args.region)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"Resources for {args.situation} ({args.region}):")
        for r in result["resources"]:
            if "contact" in r:
                print(f"  - {r['name']}: {r['contact']}")
            else:
                print(f"  - {r['name']}: {r['url']}")

    sys.exit(0)


if __name__ == "__main__":
    main()
