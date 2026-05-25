#!/usr/bin/env python3
"""
Live Region Check - Validates ARIA live regions

Usage:
    python3 scripts/live_region_check.py --input <file.html> [options]

Examples:
    python3 scripts/live_region_check.py --input page.html
    python3 scripts/live_region_check.py --input page.html --format json
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


class LiveRegionChecker(HTMLParser):
    """Validates ARIA live regions."""

    def __init__(self):
        super().__init__()
        self.live_regions: list[dict] = []
        self.issues: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}

        aria_live = attr_dict.get('aria-live')
        role = attr_dict.get('role')

        if aria_live:
            self.live_regions.append({
                'tag': tag,
                'aria-live': aria_live,
                'role': role
            })

            if aria_live in ('assertive', 'off'):
                self.issues.append({
                    'element': f'<{tag}>',
                    'issue': 'aggressive_live',
                    'message': f'aria-live="{aria_live}" may be too disruptive'
                })

        if role in ('alert', 'log', 'marquee', 'status', 'timer'):
            if not aria_live:
                self.issues.append({
                    'element': f'<{tag} role="{role}">',
                    'issue': 'missing_live_attribute',
                    'message': f'Role "{role}" should have aria-live attribute'
                })


def check_live_regions(content: str) -> dict:
    """Check ARIA live regions."""
    checker = LiveRegionChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    return {
        'success': len(checker.issues) == 0,
        'live_region_count': len(checker.live_regions),
        'issues': checker.issues,
        'summary': {
            'total_live_regions': len(checker.live_regions),
            'total_issues': len(checker.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate ARIA live regions",
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

    result = check_live_regions(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Live Region Validation Results")
        print("=" * 40)
        print(f"Live regions: {result['live_region_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
