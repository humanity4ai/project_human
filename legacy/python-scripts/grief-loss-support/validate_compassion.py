#!/usr/bin/env python3
"""
Validate Compassionate Response

Validates that a grief response is compassionate.

Usage:
    python3 scripts/validate_compassion.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

COMPASSIONATE_MARKS = ["sorry", "loss", "here", "valid", "hard", "grief", "love", "care", "hold", "presence"]
NON_COMPASSIONATE = ["but", "should", "need to", "just"]

def validate_compassion(content: str) -> dict:
    content_lower = content.lower()
    score = sum(1 for m in COMPASSIONATE_MARKS if m in content_lower) - sum(1 for m in NON_COMPASSIONATE if m in content_lower)
    return {'success': score > 0, 'score': score, 'is_compassionate': score > 0}

def main():
    parser = argparse.ArgumentParser(description="Validate compassionate response")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = validate_compassion(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Compassionate: {result['is_compassionate']}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
