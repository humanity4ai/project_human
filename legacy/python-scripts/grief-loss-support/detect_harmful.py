#!/usr/bin/env python3
"""
Detect Harmful Phrases

Detects harmful or minimizing phrases in grief content.

Usage:
    python3 scripts/detect_harmful.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

HARMFUL_PATTERNS = [
    (r"they're in a better place", "cliche"),
    (r"time heals all wounds", "cliche"),
    (r"i know how you feel", "invalidating"),
    (r"at least", "minimizing"),
    (r"should be over it", "rushing"),
    (r"be strong", "suppress"),
    (r"move on", "rushing"),
    (r"it could be worse", "comparing"),
]

def detect_harmful(content: str) -> dict:
    issues = []
    for pattern, issue_type in HARMFUL_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append({'type': issue_type, 'phrase': pattern})
    return {'success': len(issues) == 0, 'issues': issues, 'count': len(issues)}

def main():
    parser = argparse.ArgumentParser(description="Detect harmful phrases")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = detect_harmful(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Issues found: {result['count']}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
