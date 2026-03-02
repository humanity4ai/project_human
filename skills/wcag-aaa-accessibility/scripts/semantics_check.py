#!/usr/bin/env python3
"""
Semantics Check - Validates semantic HTML usage

Usage:
    python3 scripts/semantics_check.py --input <file.html> [options]

Examples:
    python3 scripts/semantics_check.py --input page.html
    python3 scripts/semantics_check.py --input page.html --format json
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

SEMANTIC_TAGS = {
    'header', 'nav', 'main', 'article', 'section', 'aside', 'footer',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li',
    'blockquote', 'pre', 'code', 'figure', 'figcaption', 'table',
    'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'details', 'summary',
    'time', 'mark', 'abbr', 'dfn', 'em', 'strong', 'q', 'cite'
}

DIV_COUNT_WARNING = 5


class SemanticsChecker(HTMLParser):
    """Validates semantic HTML usage."""

    def __init__(self):
        super().__init__()
        self.div_count = 0
        self.span_count = 0
        self.semantic_elements: list[str] = []
        self.issues: list[dict] = []
        self.has_main = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        if tag == 'div':
            self.div_count += 1
            if self.div_count > DIV_COUNT_WARNING:
                if not any(i['issue'] == 'excessive_divs' for i in self.issues):
                    self.issues.append({
                        'element': '<div>',
                        'issue': 'excessive_divs',
                        'message': f'More than {DIV_COUNT_WARNING} div elements - consider semantic elements'
                    })

        elif tag == 'span':
            self.span_count += 1
            if self.span_count > DIV_COUNT_WARNING:
                if not any(i['issue'] == 'excessive_spans' for i in self.issues):
                    self.issues.append({
                        'element': '<span>',
                        'issue': 'excessive_spans',
                        'message': f'More than {DIV_COUNT_WARNING} span elements - consider semantic elements'
                    })

        if tag in SEMANTIC_TAGS:
            self.semantic_elements.append(tag)

        if tag == 'main':
            self.has_main = True


def check_semantics(content: str) -> dict:
    """Check semantic HTML usage."""
    checker = SemanticsChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    if not checker.has_main:
        checker.issues.append({
            'element': 'page',
            'issue': 'missing_main',
            'message': 'Page missing <main> landmark'
        })

    return {
        'success': len(checker.issues) == 0,
        'div_count': checker.div_count,
        'span_count': checker.span_count,
        'semantic_elements': len(checker.semantic_elements),
        'issues': checker.issues,
        'summary': {
            'div_count': checker.div_count,
            'semantic_elements': len(checker.semantic_elements),
            'total_issues': len(checker.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate semantic HTML usage",
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

    result = check_semantics(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Semantic HTML Check Results")
        print("=" * 40)
        print(f"Div elements: {result['div_count']}")
        print(f"Semantic elements: {result['semantic_elements']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
