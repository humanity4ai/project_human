#!/usr/bin/env python3
"""
Suggest supportive language/phrases.

Usage:
    python3 scripts/suggest_support.py --emotion sadness [--format json|text]
    python3 scripts/suggest_support.py --emotion anxiety --format json
"""
import argparse
import json
import sys


SUPPORT_PHRASES = {
    "general": [
        "I'm here with you.",
        "Your feelings are valid.",
        "Thank you for sharing this with me.",
        "I'm listening.",
        "Take all the time you need.",
        "I'm sorry you're going through this.",
        "That sounds really difficult.",
        "You don't have to go through this alone.",
    ],
    "sadness": [
        "I'm so sorry you're feeling this way.",
        "It makes sense that you're feeling sad.",
        "Being sad is a valid response to what you're going through.",
        "I'm here with you through this.",
        "Your grief/loss is valid and important.",
    ],
    "anxiety": [
        "It's okay to feel anxious. That feeling is real.",
        "Take a deep breath—you've gotten through hard times before.",
        "One step at a time. You don't have to figure everything out now.",
        "I believe in your ability to get through this.",
        "It's normal to feel overwhelmed when things feel out of control.",
    ],
    "anger": [
        "It's completely valid to feel angry about this.",
        "I hear you—this sounds really frustrating.",
        "Your anger makes sense given what you're going through.",
        "Being upset is an appropriate response to this situation.",
    ],
    "fear": [
        "It's understandable to feel scared/afraid.",
        "I'm here with you—you're not alone in this.",
        "Fear is a natural response to uncertainty.",
        "Take your time. There's no rush to figure this out.",
    ],
    "loneliness": [
        "You're not alone. I'm here with you.",
        "Feeling lonely is hard, but you don't have to feel this way alone.",
        "I hear you, and you matter.",
        "Connection matters—you've reached out, and that takes courage.",
    ],
    "shame": [
        "What you're feeling is understandable.",
        "You are not defined by this mistake/setback.",
        "We all have hard times. This doesn't define your worth.",
        "I'm here for you—not for what you do, but for who you are.",
    ],
    "grief": [
        "I'm so sorry for your loss.",
        "There are no words that can make this better, but I'm here.",
        "Grief takes time. There's no right or wrong way to feel.",
        "Take all the time you need to process this.",
    ],
}


def suggest_support(emotion: str) -> dict:
    """Suggest supportive phrases based on emotion."""
    emotion_lower = emotion.lower()
    result = {
        "emotion": emotion,
        "phrases": [],
    }

    for key in SUPPORT_PHRASES:
        if key in emotion_lower:
            result["phrases"] = SUPPORT_PHRASES[key]
            return result

    result["phrases"] = SUPPORT_PHRASES["general"]
    result["note"] = "Using general phrases"

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Suggest supportive phrases",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--emotion",
        "-e",
        required=True,
        help="Emotion to get suggestions for (sadness, anxiety, anger, fear, loneliness, shame, grief)",
    )
    parser.add_argument(
        "--format",
        "-f",
        choices=["json", "text"],
        default="text",
        help="Output format",
    )

    args = parser.parse_args()

    result = suggest_support(args.emotion)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"Supportive phrases for {args.emotion}:")
        for i, phrase in enumerate(result["phrases"], 1):
            print(f"  {i}. {phrase}")

    sys.exit(0)


if __name__ == "__main__":
    main()
