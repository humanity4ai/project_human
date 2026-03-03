#!/usr/bin/env python3
"""
Heading Check - Validates heading hierarchy

Usage:
    python3 scripts/heading_check.py --input <file.html> [options]

Examples:
    python3 scripts/heading_check.py --input page.html
    python3 scripts/heading_check.py --input page.html --format json
"""
import argparse
import logging
import sys
from pathlib import Path
from html.parser import HTMLParser
from typing import Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)


class HeadingChecker(HTMLParser):
    """Validates heading hierarchy."""

    def __init__(self):
        super().__init__()
        self.headings: list[dict] = []
        self.issues: list[dict] = []
        self.last_level = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        if tag not in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            return

        level = int(tag[1])
        attr_dict = {k: v for k, v in attrs}

        self.headings.append({'level': level, 'tag': tag, 'attrs': attr_dict})

        if self.last_level > 0 and level > self.last_level + 1:
            self.issues.append({
                'element': f'<{tag}>',
                'issue': 'skipped_level',
                'message': f'Skipped heading level: h{self.last_level} to h{level}'
            })

        if level == 1:
            if self.last_level > 0:
                self.issues.append({
                    'element': f'<{tag}>',
                    'issue': 'multiple_h1',
                    'message': 'Multiple h1 elements found'
                })

        self.last_level = level


def check_headings(content: str) -> dict:
    """Check heading hierarchy."""
    checker = HeadingChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    if not checker.headings:
        checker.issues.append({
            'element': 'page',
            'issue': 'no_headings',
            'message': 'No headings found on page'
        })

    return {
        'success': len(checker.issues) == 0,
        'heading_count': len(checker.headings),
        'issues': checker.issues,
        'summary': {
            'total_headings': len(checker.headings),
            'total_issues': len(checker.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate heading hierarchy",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
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

    result = check_headings(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Heading Hierarchy Check Results")
        print("=" * 40)
        print(f"Total headings: {result['heading_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
