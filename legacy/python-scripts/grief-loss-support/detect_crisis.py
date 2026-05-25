#!/usr/bin/env python3
"""
Detect Crisis in Grief Context

Detects crisis language in grief-related content.

Usage:
    python3 scripts/detect_crisis.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

CRISIS_PATTERNS = [
    (r'\b(want to die|end it all|can\'t go on)\b', 'suicidal_ideation'),
    (r'\b(better off dead|no point living)\b', 'hopelessness'),
    (r'\b(self.?harm|cut myself)\b', 'self_harm'),
    (r'\b(overwhelming|can\'t cope|can\'t take)\b', 'overwhelm'),
]

def detect_crisis(content: str) -> dict:
    issues = []
    for pattern, issue_type in CRISIS_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append({'type': issue_type, 'requires_help': True})
    return {'success': len(issues) == 0, 'issues': issues, 'needs_crisis_resources': len(issues) > 0}

def main():
    parser = argparse.ArgumentParser(description="Detect crisis in grief content")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = detect_crisis(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Crisis Detection:", "NEEDS HELP" if result['needs_crisis_resources'] else "OK")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
