#!/usr/bin/env python3
"""
Generate a supportive response based on emotional cues.

Usage:
    python3 scripts/generate_response.py --input message.txt [--format json|text]
    python3 scripts/generate_response.py --text "I'm so stressed about work" --format json
"""
import argparse
import json
import re
import sys


EMOTION_RESPONSES = {
    "fear_anxiety": [
        "That sounds really stressful. It's completely normal to feel anxious when things feel out of control. I'm here with you.",
        "I can hear how worried you are. Take a deep breath—you've gotten through hard times before, and you'll get through this too.",
    ],
    "sadness_grief": [
        "I'm so sorry you're going through this. It makes sense that you're feeling this way. I'm here with you.",
        "That sounds really difficult. Thank you for sharing this with me. Your feelings are valid.",
    ],
    "anger_frustration": [
        "It makes sense that you're feeling frustrated. What you're going through sounds challenging. Do you want to talk about it?",
        "I hear you—being treated unfairly or dealing with something frustrating is hard. I'm here to listen.",
    ],
    "loneliness_isolation": [
        "I'm so sorry you feel alone. That loneliness is real and hard to carry. I'm here with you.",
        "Feeling isolated can be so painful. I want you to know that you matter and you're not alone.",
    ],
    "shame_guilt": [
        "What you're feeling is understandable, but please know—your worth isn't defined by this. I'm here for you.",
        "It sounds like you're being really hard on yourself. We all make mistakes. Would you like to talk about it?",
    ],
}


CRISIS_RESPONSE = """
I'm so glad you reached out to me. I want you to know that you matter, and I want to make sure you're safe right now.

Please reach out:
- Call or text 988 (US Suicide & Crisis Lifeline)
- Text HOME to 741741 (Crisis Text Line)

Would you be willing to talk to someone who can help right now?
"""


def generate_response(text: str, crisis_detected: bool = False) -> dict:
    """Generate a supportive response based on text."""
    text_lower = text.lower()
    result = {
        "response": "",
        "type": "standard",
    }

    if crisis_detected or any(
        re.search(p, text_lower)
        for p in [
            r"(suicide|suicidal|kill myself|end my life)",
            r"(better off|better if).*without me",
            r"(want|need).*(pain|it).*stop",
        ]
    ):
        result["response"] = CRISIS_RESPONSE.strip()
        result["type"] = "crisis"
        return result

    detected_emotion = None
    for emotion in EMOTION_RESPONSES:
        if re.search(emotion.replace("_", "|"), text_lower):
            detected_emotion = emotion
            break

    if detected_emotion and EMOTION_RESPONSES.get(detected_emotion):
        result["response"] = EMOTION_RESPONSES[detected_emotion][0]
        result["type"] = "emotional"
    else:
        result["response"] = "Thank you for sharing this with me. I'm here with you. Would you like to talk about what's happening?"
        result["type"] = "general"

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Generate supportive response",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", help="Input file to respond to")
    parser.add_argument("--text", "-t", help="Text to respond to")
    parser.add_argument("--crisis", action="store_true", help="Force crisis response")
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

    result = generate_response(text, args.crisis)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(result["response"])
        print(f"\n[Response type: {result['type']}]")

    sys.exit(0)


if __name__ == "__main__":
    main()
