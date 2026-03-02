#!/usr/bin/env python3
"""
Detect Harmful Language

Detects harmful or dangerous language in content.

Usage:
    python3 scripts/detect_harmful.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

HARMFUL_PATTERNS = [
    (r'\b(want to die|want to end it|end my life|take my life)\b', 'suicidal_ideation'),
    (r'\b(better off dead|everyone would be better)\b', 'suicidal_ideation'),
    (r'\b(self.?harm|cut myself|hurt myself)\b', 'self_harm'),
    (r'\b(kill myself|end it all|make it stop)\b', 'crisis'),
    (r'\b(no point|life isn.?t worth|can.?t go on)\b', 'hopelessness'),
]

CRISIS_RESPONSE = """
If you're in crisis, please reach out:

- Call or text 988 (US)
- Text HOME to 741741
- Visit 988lifeline.org

You don't have to go through this alone.
"""


def detect_harmful(content: str) -> dict:
    """Detect harmful language."""
    issues = []
    for pattern, issue_type in HARMFUL_PATTERNS:
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            issues.append({
                'type': issue_type,
                'phrase': match.group(),
                'position': match.start(),
                'requires_response': True
            })

    return {
        'success': len(issues) == 0,
        'harmful_count': len(issues),
        'issues': issues,
        'requires_crisis_response': len(issues) > 0,
        'crisis_resources': CRISIS_RESPONSE if len(issues) > 0 else None
    }


def main():
    parser = argparse.ArgumentParser(
        description="Detect harmful language",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input text file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)

    try:
        content = input_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.error(f"Failed to read file: {e}")
        sys.exit(1)

    result = detect_harmful(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Harmful Language Detection")
        print("=" * 40)
        print(f"Issues found: {result['harmful_count']}")
        
        if result['requires_crisis_response']:
            print("\n⚠️ CRISIS RESPONSE NEEDED")
            print(result['crisis_resources'])

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
