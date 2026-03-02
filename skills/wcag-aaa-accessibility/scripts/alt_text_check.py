#!/usr/bin/env python3
"""
Alt Text Check - Validates alternative text for images

Usage:
    python3 scripts/alt_text_check.py --input <file.html> [options]

Examples:
    python3 scripts/alt_text_check.py --input page.html
    python3 scripts/alt_text_check.py --input page.html --format json
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


class AltTextChecker(HTMLParser):
    """Validates alternative text for images."""

    def __init__(self):
        super().__init__()
        self.images: list[dict] = []
        self.issues: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        if tag != 'img':
            return

        attr_dict = {k: v for k, v in attrs}
        src = attr_dict.get('src', 'unknown')
        alt = attr_dict.get('alt')
        role = attr_dict.get('role', '')

        self.images.append({'src': src, 'alt': alt, 'role': role})

        if alt is None:
            self.issues.append({
                'element': f'<img src="{src}">',
                'issue': 'missing_alt',
                'message': 'Image missing alt attribute'
            })
        elif alt == '' and role != 'presentation':
            self.issues.append({
                'element': f'<img src="{src}">',
                'issue': 'empty_alt_presentation',
                'message': 'Empty alt should have role="presentation"'
            })
        elif alt and len(alt) < 5 and 'image' not in alt.lower():
            self.issues.append({
                'element': f'<img src="{src}">',
                'issue': 'short_alt',
                'message': f'Alt text "{alt}" is too short to be descriptive'
            })


def check_alt_text(content: str) -> dict:
    """Check alternative text for images."""
    checker = AltTextChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    return {
        'success': len(checker.issues) == 0,
        'image_count': len(checker.images),
        'issues': checker.issues,
        'summary': {
            'total_images': len(checker.images),
            'total_issues': len(checker.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate alternative text for images",
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

    result = check_alt_text(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Alt Text Validation Results")
        print("=" * 40)
        print(f"Total images: {result['image_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
