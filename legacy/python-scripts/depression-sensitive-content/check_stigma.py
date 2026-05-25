#!/usr/bin/env python3
"""
Check Stigma Patterns

Checks for stigma patterns in content.

Usage:
    python3 scripts/check_stigma.py --input <file.txt> [options]
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

STIGMA_PATTERNS = [
    (r'\b(suffering|afflicted|victim)\b', 'shame_verbs'),
    (r'\b(crazy|insane|psycho|nut|loony)\b', 'slur'),
    (r'\bweak(ness| minded)\b', 'weakness'),
    (r'\bcho(se|osing).*depression\b', 'choice'),
    (r'\bnot trying\b', 'blame'),
    (r'\bjust.*think positive\b', 'invalidating'),
    (r'\bmake.*up.*mind\b', 'willpower'),
]


def check_stigma(content: str) -> dict:
    """Check for stigma patterns."""
    issues = []
    
    for pattern, stigma_type in STIGMA_PATTERNS:
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            issues.append({
                'type': stigma_type,
                'phrase': match.group(),
                'position': match.start(),
                'explanation': get_explanation(stigma_type)
            })
    
    return {
        'success': len(issues) == 0,
        'issues': issues,
        'issue_count': len(issues),
        'recommendation': 'Revise to remove stigma' if issues else 'No stigma detected'
    }


def get_explanation(stigma_type: str) -> str:
    """Get explanation for stigma type."""
    explanations = {
        'shame_verbs': 'These verbs imply shame or blame',
        'slur': 'Derogatory terms that dehumanize',
        'weakness': 'Implies depression is a character flaw',
        'choice': 'Implies depression is a choice',
        'blame': 'Implies person is not trying hard enough',
        'invalidating': 'Minimizes the experience',
        'willpower': 'Implies recovery is just about trying'
    }
    return explanations.get(stigma_type, 'Potentially stigmatizing')


def main():
    parser = argparse.ArgumentParser(
        description="Check for stigma patterns",
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

    result = check_stigma(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Stigma Pattern Check")
        print("=" * 40)
        print(f"Issues: {result['issue_count']}")
        print(f"Recommendation: {result['recommendation']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
