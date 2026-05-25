#!/usr/bin/env python3
"""
Link Audit - Audits link accessibility

Usage:
    python3 scripts/link_audit.py --input <file.html> [options]

Examples:
    python3 scripts/link_audit.py --input page.html
    python3 scripts/link_audit.py --input page.html --format json
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


class LinkAuditor(HTMLParser):
    """Audits link accessibility."""

    def __init__(self):
        super().__init__()
        self.links: list[dict] = []
        self.issues: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        if tag not in ('a', 'area'):
            return

        attr_dict = {k: v for k, v in attrs}
        href = attr_dict.get('href', '')
        text = attr_dict.get('') or ''
        title = attr_dict.get('title', '')

        element = {'tag': tag, 'href': href, 'text': text, 'title': title}
        self.links.append(element)

        if not text and not title:
            self.issues.append({
                'element': f'<{tag}>',
                'issue': 'empty_link',
                'message': 'Link has no text or title'
            })
        elif text.strip().lower() in ('click here', 'here', 'link', 'read more', 'more'):
            self.issues.append({
                'element': f'<{tag}>',
                'issue': 'vague_link_text',
                'message': f'Link text "{text}" is not descriptive'
            })
        elif href and text and len(text) < 3 and not title:
            self.issues.append({
                'element': f'<{tag}>',
                'issue': 'short_link_text',
                'message': 'Link text is very short, may lack context'
            })


def audit_links(content: str) -> dict:
    """Audit link accessibility."""
    auditor = LinkAuditor()
    try:
        auditor.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    return {
        'success': len(auditor.issues) == 0,
        'link_count': len(auditor.links),
        'issues': auditor.issues,
        'summary': {
            'total_links': len(auditor.links),
            'total_issues': len(auditor.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Audit link accessibility",
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

    result = audit_links(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Link Accessibility Audit Results")
        print("=" * 40)
        print(f"Total links: {result['link_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
