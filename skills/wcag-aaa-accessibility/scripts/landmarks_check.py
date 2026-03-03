#!/usr/bin/env python3
"""
Landmarks Check - Validates ARIA landmarks

Usage:
    python3 scripts/landmarks_check.py --input <file.html> [options]

Examples:
    python3 scripts/landmarks_check.py --input page.html
    python3 scripts/landmarks_check.py --input page.html --format json
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

LANDMARK_TAGS = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form',
    'search': 'search'
}


class LandmarksChecker(HTMLParser):
    """Validates ARIA landmarks."""

    def __init__(self):
        super().__init__()
        self.landmarks: list[dict] = []
        self.issues: list[dict] = []
        self.has_main = False
        self.has_search = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}

        role = attr_dict.get('role')
        if role:
            self.landmarks.append({'tag': tag, 'role': role, 'implicit': False})
            if role == 'main':
                self.has_main = True
            if role == 'search':
                self.has_search = True
        elif tag in LANDMARK_TAGS:
            self.landmarks.append({'tag': tag, 'role': LANDMARK_TAGS[tag], 'implicit': True})
            if tag == 'main':
                self.has_main = True
            if tag == 'nav':
                pass
            if tag == 'search':
                self.has_search = True


def check_landmarks(content: str) -> dict:
    """Check ARIA landmarks."""
    checker = LandmarksChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    if not checker.has_main:
        checker.issues.append({
            'element': 'page',
            'issue': 'missing_main',
            'message': 'Page missing <main> landmark or role="main"'
        })

    if not checker.has_search:
        checker.issues.append({
            'element': 'page',
            'issue': 'missing_search',
            'message': 'Consider adding role="search" for search functionality'
        })

    return {
        'success': len(checker.issues) == 0,
        'landmark_count': len(checker.landmarks),
        'issues': checker.issues,
        'summary': {
            'total_landmarks': len(checker.landmarks),
            'total_issues': len(checker.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate ARIA landmarks",
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

    result = check_landmarks(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Landmarks Validation Results")
        print("=" * 40)
        print(f"Total landmarks: {result['landmark_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
