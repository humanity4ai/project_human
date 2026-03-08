#!/usr/bin/env python3
"""
Categorize Issues

Categorizes issues by type.

Usage:
    python3 scripts/categorize_issues.py --input <file.json> [options]
"""
import argparse
import json
import logging
import sys
from pathlib import Path
from collections import defaultdict

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

CATEGORIES = {
    'stigmatizing_language': ['stigmatizing_verb', 'stigmatizing_term', 'identity_first'],
    'crisis_language': ['suicidal_ideation', 'self_harm', 'crisis'],
    'cognitive_friction': ['long_sentence', 'complex_structure', 'jargon', 'passive_voice'],
    'minimizing': ['minimizing'],
    'judgmental': ['judgmental'],
}


def categorize_issues(issues: list) -> dict:
    """Categorize issues by type."""
    categorized = defaultdict(list)
    
    for issue in issues:
        issue_type = issue.get('type', 'unknown')
        found_category = 'other'
        
        for category, types in CATEGORIES.items():
            if issue_type in types:
                found_category = category
                break
        
        categorized[found_category].append(issue)
    
    return {
        'success': True,
        'categories': dict(categorized),
        'category_counts': {k: len(v) for k, v in categorized.items()},
        'total_issues': len(issues)
    }


def main():
    parser = argparse.ArgumentParser(
        description="Categorize issues by type",
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

    result = categorize_issues(issues)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print("Issue Categories")
        print("=" * 40)
        for category, count in result['category_counts'].items():
            print(f"  {category}: {count}")
        print(f"\nTotal: {result['total_issues']}")

    sys.exit(0)


if __name__ == "__main__":
    main()
