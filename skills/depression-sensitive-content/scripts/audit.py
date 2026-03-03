#!/usr/bin/env python3
"""
Depression-Sensitive Content Audit

Scans content for stigmatizing phrases and issues.

Usage:
    python3 scripts/audit.py --input <file.txt> [options]

Examples:
    python3 scripts/audit.py --input content.txt
    python3 scripts/audit.py --input content.txt --format json
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

STIGMATIZING_PATTERNS = [
    (r'\b(suffering from|afflicted with)\b', 'stigmatizing_verb'),
    (r'\b(victim of|depressive person)\b', 'identity_first'),
    (r'\b(mentally? ill|crazy|insane|psycho|nut|loony)\b', 'stigmatizing_term'),
    (r'\bcommitted suicide\b', 'crisis_language'),
    (r'\bjust get over it\b', 'minimizing'),
    (r'\bsnap out of it\b', 'minimizing'),
    (r"\bit's all in your head\b", 'minimizing'),
    (r'\bpoor compliance\b', 'judgmental'),
    (r'\bnon-compliant\b', 'judgmental'),
]


def audit_content(content: str) -> dict:
    """Audit content for stigmatizing language."""
    issues = []
    for pattern, issue_type in STIGMATIZING_PATTERNS:
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            issues.append({
                'type': issue_type,
                'phrase': match.group(),
                'position': match.start(),
                'suggestion': get_suggestion(issue_type, match.group())
            })

    return {
        'success': len(issues) == 0,
        'issue_count': len(issues),
        'issues': issues,
        'summary': {
            'total_issues': len(issues),
            'stigmatizing': len([i for i in issues if i['type'] in ('stigmatizing_verb', 'stigmatizing_term')]),
            'crisis': len([i for i in issues if i['type'] == 'crisis_language']),
            'minimizing': len([i for i in issues if i['type'] == 'minimizing'])
        }
    }


def get_suggestion(issue_type: str, phrase: str) -> str:
    """Get suggestion for fixing the issue."""
    suggestions = {
        'stigmatizing_verb': 'Use "living with" or "experiencing"',
        'identity_first': 'Use person-first language',
        'stigmatizing_term': 'Use neutral, respectful language',
        'crisis_language': 'Use "died by suicide"',
        'minimizing': 'Validate feelings instead',
        'judgmental': 'Use neutral, non-judgmental language'
    }
    return suggestions.get(issue_type, 'Review and revise')


def main():
    parser = argparse.ArgumentParser(
        description="Audit content for stigmatizing language",
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

    result = audit_content(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Depression-Sensitive Content Audit")
        print("=" * 40)
        print(f"Total issues: {result['summary']['total_issues']}")
        print(f"  Stigmatizing: {result['summary']['stigmatizing']}")
        print(f"  Crisis language: {result['summary']['crisis']}")
        print(f"  Minimizing: {result['summary']['minimizing']}")

        if result['issues']:
            print("\nIssues found:")
            for issue in result['issues']:
                print(f"  [{issue['type']}] '{issue['phrase']}' -> {issue['suggestion']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
