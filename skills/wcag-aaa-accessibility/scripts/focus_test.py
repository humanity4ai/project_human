#!/usr/bin/env python3
"""
Focus Test - Tests keyboard focus management

Usage:
    python3 scripts/focus_test.py --input <file.html> [options]

Examples:
    python3 scripts/focus_test.py --input page.html
    python3 scripts/focus_test.py --input page.html --format json
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

FOCUSABLE_TAGS = {'a', 'button', 'input', 'select', 'textarea', 'area', 'object', 'embed'}


class FocusTester(HTMLParser):
    """Tests keyboard focus management."""

    def __init__(self):
        super().__init__()
        self.focusable_elements: list[dict] = []
        self.tabindex_issues: list[dict] = []
        self.autofocus_issues: list[dict] = []
        self.focus_style_warnings: list[dict] = []
        self.interactive_elements: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}

        if tag in FOCUSABLE_TAGS:
            element = {'tag': tag, 'attrs': attr_dict}

            if tag == 'a' and attr_dict.get('href'):
                self.focusable_elements.append(element)
            elif tag in ('button', 'input', 'select', 'textarea'):
                input_type = attr_dict.get('type', 'text')
                if input_type not in ('hidden', 'submit', 'button', 'image'):
                    self.focusable_elements.append(element)

            self.interactive_elements.append(element)

        tabindex = attr_dict.get('tabindex')
        if tabindex is not None:
            try:
                ti = int(tabindex)
                if ti < 0 and tag not in ('iframe',):
                    self.tabindex_issues.append({
                        'element': f'<{tag}>',
                        'message': f'tabindex={ti} removes element from focus order'
                    })
                elif ti > 0:
                    self.tabindex_issues.append({
                        'element': f'<{tag}>',
                        'message': f'Positive tabindex creates focus order issues'
                    })
            except ValueError:
                self.tabindex_issues.append({
                    'element': f'<{tag}>',
                    'message': f'Invalid tabindex: {tabindex}'
                })

        if attr_dict.get('autofocus') and tag not in ('input', 'select', 'textarea', 'button'):
            self.autofocus_issues.append({
                'element': f'<{tag}>',
                'message': 'autofocus only valid on form elements'
            })


def test_focus(content: str) -> dict:
    """Test keyboard focus in HTML content."""
    tester = FocusTester()
    try:
        tester.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    return {
        'success': len(tester.tabindex_issues) == 0,
        'focusable_elements': len(tester.focusable_elements),
        'tabindex_issues': tester.tabindex_issues,
        'autofocus_issues': tester.autofocus_issues,
        'interactive_elements': len(tester.interactive_elements),
        'summary': {
            'total_focusable': len(tester.focusable_elements),
            'total_issues': len(tester.tabindex_issues) + len(tester.autofocus_issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Test keyboard focus management",
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

    result = test_focus(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Focus Management Test Results")
        print("=" * 40)
        print(f"Focusable elements: {result['summary']['total_focusable']}")
        print(f"Issues found: {result['summary']['total_issues']}")

        if result['tabindex_issues']:
            print("\nTabindex Issues:")
            for issue in result['tabindex_issues']:
                print(f"  {issue['element']}: {issue['message']}")

        if result['autofocus_issues']:
            print("\nAutofocus Issues:")
            for issue in result['autofocus_issues']:
                print(f"  {issue['element']}: {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
