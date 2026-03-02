#!/usr/bin/env python3
"""
Suggest Supportive Alternatives

Suggests alternatives to harmful grief phrases.

Usage:
    python3 scripts/suggest_supportive.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

ALTERNATIVES = {
    "they're in a better place": "I'm so sorry for your loss.",
    "time heals all wounds": "This is so hard right now.",
    "i know how you feel": "I wish I had words.",
    "at least": "Your loss is real and valid.",
    "should be over it": "Take all the time you need.",
    "be strong": "Your feelings are valid.",
    "move on": "I'm here when you're ready.",
    "it could be worse": "This loss matters.",
}

def suggest_supportive(content: str) -> dict:
    suggestions = []
    for harmful, better in ALTERNATIVES.items():
        if re.search(harmful, content, re.IGNORECASE):
            suggestions.append({'harmful': harmful, 'suggestion': better})
    return {'success': len(suggestions) == 0, 'suggestions': suggestions, 'count': len(suggestions)}

def main():
    parser = argparse.ArgumentParser(description="Suggest supportive alternatives")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = suggest_supportive(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Suggestions: {result['count']}")
        for s in result['suggestions']:
            print(f"  '{s['harmful']}' -> '{s['suggestion']}'")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
