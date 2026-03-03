#!/usr/bin/env python3
"""
Check Minimizing Language

Checks for minimizing language in grief content.

Usage:
    python3 scripts/check_minimizing.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

MINIMIZING_PATTERNS = [
    (r"at least", "comparing"),
    (r"could be worse", "comparing"),
    (r"should be over it", "rushing"),
    (r"time heals", "rushing"),
    (r"they lived a long life", "age_dismiss"),
]

def check_minimizing(content: str) -> dict:
    issues = []
    for pattern, issue_type in MINIMIZING_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append({'type': issue_type, 'pattern': pattern})
    return {'success': len(issues) == 0, 'issues': issues, 'count': len(issues)}

def main():
    parser = argparse.ArgumentParser(description="Check minimizing language")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = check_minimizing(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Minimizing phrases: {result['count']}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
