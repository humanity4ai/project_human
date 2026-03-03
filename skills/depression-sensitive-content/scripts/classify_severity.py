#!/usr/bin/env python3
"""
Classify Severity

Classifies issues by severity level.

Usage:
    python3 scripts/classify_severity.py --input <file.json> [options]
"""
import argparse
import json
import logging
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

SEVERITY_MAP = {
    'suicidal_ideation': 'critical',
    'self_harm': 'critical',
    'crisis': 'critical',
    'stigmatizing_term': 'high',
    'stigmatizing_verb': 'high',
    'identity_first': 'high',
    'minimizing': 'medium',
    'long_sentence': 'low',
    'complex_structure': 'low',
    'jargon': 'low'
}


def classify_severity(issues: list) -> dict:
    """Classify issues by severity."""
    classified = []
    severity_counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0}

    for issue in issues:
        issue_type = issue.get('type', 'unknown')
        severity = SEVERITY_MAP.get(issue_type, 'low')
        
        classified.append({
            **issue,
            'severity': severity
        })
        severity_counts[severity] += 1

    return {
        'success': severity_counts['critical'] == 0,
        'issues': classified,
        'severity_counts': severity_counts,
        'requires_immediate_action': severity_counts['critical'] > 0
    }


def main():
    parser = argparse.ArgumentParser(
        description="Classify issues by severity",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input JSON file with issues")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)

    try:
        with open(input_path) as f:
            issues = json.load(f)
            if isinstance(issues, dict):
                issues = issues.get('issues', [])
    except Exception as e:
        logger.error(f"Failed to read file: {e}")
        sys.exit(1)

    result = classify_severity(issues)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print("Severity Classification")
        print("=" * 40)
        print(f"Critical: {result['severity_counts']['critical']}")
        print(f"High: {result['severity_counts']['high']}")
        print(f"Medium: {result['severity_counts']['medium']}")
        print(f"Low: {result['severity_counts']['low']}")

        if result['requires_immediate_action']:
            print("\n⚠️ IMMEDIATE ACTION REQUIRED")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
