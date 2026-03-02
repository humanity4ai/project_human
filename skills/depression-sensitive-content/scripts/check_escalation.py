#!/usr/bin/env python3
"""
Check Escalation Needs

Checks if content requires escalation to human moderator.

Usage:
    python3 scripts/check_escalation.py --input <file.txt> [options]
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

ESCALATION_TRIGGERS = [
    (r'\b(want to die|end my life|take my life)\b', 'critical', 'Suicidal ideation'),
    (r'\b(kill myself|end it all)\b', 'critical', 'Suicidal ideation'),
    (r'\bself.?harm\b', 'critical', 'Self-harm'),
    (r'\bno point.*living\b', 'high', 'Hopelessness'),
    (r'\bbetter off dead\b', 'critical', 'Crisis'),
    (r'\bhow to.*kill\b', 'critical', 'Dangerous content'),
    (r'\bmedical advice\b', 'medium', 'Medical claim'),
    (r'\btreatment.*recommend\b', 'medium', 'Treatment recommendation'),
]


def check_escalation(content: str) -> dict:
    """Check if escalation is needed."""
    escalations = []
    
    for pattern, severity, description in ESCALATION_TRIGGERS:
        if re.search(pattern, content, re.IGNORECASE):
            escalations.append({
                'severity': severity,
                'description': description,
                'action': get_action(severity)
            })
    
    needs_escalation = any(e['severity'] == 'critical' for e in escalations)
    
    return {
        'success': not needs_escalation,
        'needs_escalation': needs_escalation,
        'escalations': escalations,
        'severity': 'critical' if needs_escalation else 'none',
        'action': 'ESCALATE IMMEDIATELY' if needs_escalation else 'Proceed with standard review'
    }


def get_action(severity: str) -> str:
    """Get recommended action based on severity."""
    actions = {
        'critical': 'Escalate to human moderator immediately',
        'high': 'Flag for review',
        'medium': 'Note for review'
    }
    return actions.get(severity, 'No action needed')


def main():
    parser = argparse.ArgumentParser(
        description="Check escalation needs",
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

    result = check_escalation(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Escalation Check")
        print("=" * 40)
        print(f"Needs escalation: {result['needs_escalation']}")
        print(f"Action: {result['action']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
