#!/usr/bin/env python3
"""
Validate Supportive Response

Validates that a grief response is supportive.

Usage:
    python3 scripts/validate_supportive.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

GOOD_INDICATORS = ["sorry", "loss", "here", "valid", "hard", "grief"]
BAD_INDICATORS = ["better place", "move on", "should be", "i know how"]

def validate_supportive(content: str) -> dict:
    content_lower = content.lower()
    good = sum(1 for i in GOOD_INDICATORS if i in content_lower)
    bad = sum(1 for i in BAD_INDICATORS if i in content_lower)
    score = good - bad
    return {'success': score >= 0, 'score': score, 'good_count': good, 'bad_count': bad, 'is_supportive': score >= 0}

def main():
    parser = argparse.ArgumentParser(description="Validate supportive response")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = validate_supportive(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Supportive: {result['is_supportive']} (score: {result['score']})")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
