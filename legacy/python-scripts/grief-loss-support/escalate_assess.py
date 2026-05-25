#!/usr/bin/env python3
"""
Escalate Assess

Assesses whether grief support needs escalation.

Usage:
    python3 scripts/escalate_assess.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

ESCALATION_TRIGGERS = [
    (r'\b(want to die|end it all)\b', 'critical'),
    (r'\b(self.?harm|cut)\b', 'critical'),
    (r'\b(better off dead|no point)\b', 'high'),
    (r'\b(can\'t cope|overwhelmed)\b', 'medium'),
]

def assess_escalation(content: str) -> dict:
    escalations = []
    for pattern, severity in ESCALATION_TRIGGERS:
        if re.search(pattern, content, re.IGNORECASE):
            escalations.append({'severity': severity, 'action': 'Escalate' if severity in ('critical', 'high') else 'Monitor'})
    return {'needs_escalation': any(e['severity'] in ('critical', 'high') for e in escalations), 'escalations': escalations}

def main():
    parser = argparse.ArgumentParser(description="Assess escalation needs")
    parser.add_argument("--input", "-i", required=True, help="Input file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    content = path.read_text()
    result = assess_escalation(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Needs escalation: {result['needs_escalation']}")
    sys.exit(1 if result['needs_escalation'] else 0)

if __name__ == "__main__":
    main()
