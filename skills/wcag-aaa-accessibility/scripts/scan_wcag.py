#!/usr/bin/env python3
"""
WCAG Scanner - Scans HTML for WCAG violations

Usage:
    python3 scripts/scan_wcag.py --input <file.html> [options]

Examples:
    python3 scripts/scan_wcag.py --input page.html
    python3 scripts/scan_wcag.py --input page.html --level AAA --format json
"""
import argparse
import logging
import re
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


class WCAGScanner(HTMLParser):
    """Scans HTML for WCAG violations."""

    def __init__(self, level: str = "AA"):
        super().__init__()
        self.level = level.upper()
        self.violations: list[dict] = []
        self.warnings: list[dict] = []
        self.headings: list[tuple[str, int]] = []
        self.images: list[dict] = []
        self.links: list[dict] = []
        self.forms: list[dict] = []
        self.landmarks: set = set()
        self.tag_stack: list[str] = []
        self.has_skip_link = False
        self.has_main_landmark = False
        self.has_lang = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}
        self.tag_stack.append(tag)

        if tag == 'body':
            pass

        elif tag == 'a':
            href = attr_dict.get('href', '')
            text = attr_dict.get('')
            self.links.append({'href': href, 'has_text': bool(text), 'attrs': attr_dict})

        elif tag == 'img':
            src = attr_dict.get('src', '')
            alt = attr_dict.get('alt')
            if alt is None:
                self.violations.append({
                    'criterion': '1.1.1',
                    'message': 'Image missing alt attribute',
                    'element': f'<img src="{src}">',
                    'level': 'A'
                })
            elif alt == '' and attr_dict.get('role') != 'presentation':
                self.warnings.append({
                    'criterion': '1.1.1',
                    'message': 'Decorative image should have role="presentation"',
                    'element': f'<img src="{src}">'
                })
            self.images.append({'src': src, 'alt': alt})

        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            level = int(tag[1])
            self.headings.append((tag, level))

        elif tag in ('input', 'select', 'textarea'):
            input_type = attr_dict.get('type', 'text')
            if input_type not in ('hidden', 'submit', 'button', 'image'):
                has_label = bool(attr_dict.get('label') or attr_dict.get('aria-label') or attr_dict.get('aria-labelledby'))
                if not has_label and not attr_dict.get('aria-hidden'):
                    self.violations.append({
                        'criterion': '1.3.1',
                        'message': f'Form input missing label',
                        'element': f'<{tag} type="{input_type}">',
                        'level': 'A'
                    })
                self.forms.append({'tag': tag, 'type': input_type, 'has_label': has_label})

        elif tag == 'nav':
            self.landmarks.add('navigation')

        elif tag == 'main':
            self.has_main_landmark = True

        elif tag == 'header':
            self.landmarks.add('banner')

        elif tag == 'footer':
            self.landmarks.add('contentinfo')

        elif tag == 'html':
            if attr_dict.get('lang'):
                self.has_lang = True

    def handle_endtag(self, tag: str):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()

    def check_heading_hierarchy(self):
        """Check for skipped heading levels."""
        expected_level = 1
        for tag, level in self.headings:
            if level > expected_level + 1:
                self.violations.append({
                    'criterion': '1.3.1',
                    'message': f'Skipped heading level: h{expected_level} to h{level}',
                    'element': f'<{tag}>',
                    'level': 'A'
                })
            expected_level = level

    def check_landmarks(self):
        """Check for missing landmarks."""
        if not self.has_main_landmark:
            self.warnings.append({
                'criterion': '1.3.1',
                'message': 'Page missing <main> landmark',
                'element': '<main>'
            })

    def check_links(self):
        """Check for empty or vague links."""
        for i, link in enumerate(self.links):
            if not link['has_text'] and link['href'] not in ('#', ''):
                self.violations.append({
                    'criterion': '2.4.4',
                    'message': 'Link has no text',
                    'element': f'<a href="{link["href"]}">',
                    'level': 'A'
                })


def scan_html(content: str, level: str = "AA") -> dict:
    """Scan HTML content for WCAG violations."""
    scanner = WCAGScanner(level)
    try:
        scanner.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'violations': [], 'errors': [str(e)]}

    scanner.check_heading_hierarchy()
    scanner.check_landmarks()
    scanner.check_links()

    return {
        'success': True,
        'level': level,
        'violations': scanner.violations,
        'warnings': scanner.warnings,
        'summary': {
            'total_violations': len(scanner.violations),
            'total_warnings': len(scanner.warnings),
            'images': len(scanner.images),
            'links': len(scanner.links),
            'forms': len(scanner.forms),
            'headings': len(scanner.headings)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Scan HTML for WCAG violations",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
    parser.add_argument("--level", "-l", choices=["A", "AA", "AAA"], default="AA",
                        help="WCAG compliance level")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text",
                        help="Output format")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)

    try:
        content = input_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.error(f"Failed to read file: {e}")
        sys.exit(1)

    result = scan_html(content, args.level)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"WCAG Level {result['level']} Scan Results")
        print("=" * 40)
        print(f"Violations: {result['summary']['total_violations']}")
        print(f"Warnings: {result['summary']['total_warnings']}")
        print()

        if result['violations']:
            print("VIOLATIONS:")
            for v in result['violations']:
                print(f"  [{v['criterion']}] {v['message']}")
                print(f"    Element: {v['element']}")

        if result['warnings'] and args.verbose:
            print("WARNINGS:")
            for w in result['warnings']:
                print(f"  [{w['criterion']}] {w['message']}")

    sys.exit(0 if result['summary']['total_violations'] == 0 else 1)


if __name__ == "__main__":
    main()
