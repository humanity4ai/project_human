#!/usr/bin/env python3
"""
Validate WCAG Fixes - Verifies accessibility fixes have been applied correctly

Usage:
    python3 scripts/validate_fixes.py --original <before.html> --fixed <after.html> [options]

Examples:
    python3 scripts/validate_fixes.py --original before.html --fixed after.html
    python3 scripts/validate_fixes.py --original before.html --fixed after.html --format json
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


class FixValidator(HTMLParser):
    """Validates that accessibility fixes were applied."""

    def __init__(self):
        super().__init__()
        self.fixes_applied: list[dict] = []
        self.remaining_issues: list[dict] = []
        self.images_without_alt: list[str] = []
        self.inputs_without_label: list[str] = []
        self.empty_links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}

        if tag == 'img':
            alt = attr_dict.get('alt')
            src = attr_dict.get('src', 'unknown')
            if alt is not None:
                if alt:
                    self.fixes_applied.append({'type': 'alt_text', 'element': f'<img src="{src}">'})
                else:
                    self.fixes_applied.append({'type': 'decorative_image', 'element': f'<img src="{src}">'})
            else:
                self.remaining_issues.append({'type': 'missing_alt', 'element': f'<img src="{src}">'})

        elif tag in ('input', 'select', 'textarea'):
            input_type = attr_dict.get('type', 'text')
            if input_type not in ('hidden', 'submit', 'button', 'image'):
                has_label = bool(attr_dict.get('aria-label') or attr_dict.get('aria-labelledby'))
                if has_label:
                    self.fixes_applied.append({'type': 'form_label', 'element': f'<{tag}>'})
                else:
                    self.remaining_issues.append({'type': 'missing_label', 'element': f'<{tag}>'})

        elif tag == 'a':
            href = attr_dict.get('href', '')
            text = attr_dict.get('')
            if text:
                self.fixes_applied.append({'type': 'link_text', 'element': f'<a href="{href}">'})


def validate_fixes(original: str, fixed: str) -> dict:
    """Compare original and fixed HTML to validate fixes."""
    original_validator = FixValidator()
    fixed_validator = FixValidator()

    try:
        original_validator.feed(original)
        fixed_validator.feed(fixed)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    original_issues = {
        'missing_alt': len(original_validator.images_without_alt),
        'missing_label': len(original_validator.inputs_without_label),
        'empty_links': len(original_validator.empty_links)
    }

    fixed_issues = {
        'missing_alt': len(fixed_validator.images_without_alt),
        'missing_label': len(fixed_validator.inputs_without_label),
        'empty_links': len(fixed_validator.empty_links)
    }

    fixes_verified = []
    for issue_type in original_issues:
        if original_issues[issue_type] > 0 and fixed_issues[issue_type] == 0:
            fixes_verified.append(issue_type)

    return {
        'success': len(fixed_validator.remaining_issues) == 0,
        'original_issues': original_issues,
        'fixed_issues': fixed_issues,
        'fixes_verified': fixes_verified,
        'remaining_issues': fixed_validator.remaining_issues,
        'fixes_applied': fixed_validator.fixes_applied
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate accessibility fixes applied to HTML",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--original", "-o", required=True, help="Original HTML file (before fixes)")
    parser.add_argument("--fixed", "-f", required=True, help="Fixed HTML file (after fixes)")
    parser.add_argument("--format", choices=["json", "text"], default="text", help="Output format")

    args = parser.parse_args()

    orig_path = Path(args.original)
    fixed_path = Path(args.fixed)

    if not orig_path.exists():
        logger.error(f"Original file not found: {args.original}")
        sys.exit(1)
    if not fixed_path.exists():
        logger.error(f"Fixed file not found: {args.fixed}")
        sys.exit(1)

    try:
        original = orig_path.read_text(encoding='utf-8')
        fixed = fixed_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.error(f"Failed to read files: {e}")
        sys.exit(1)

    result = validate_fixes(original, fixed)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Accessibility Fix Validation Results")
        print("=" * 40)
        print(f"Original issues: {result['original_issues']}")
        print(f"Fixed issues: {result['fixed_issues']}")
        print(f"Fixes verified: {result['fixes_verified']}")
        if result['remaining_issues']:
            print(f"Remaining issues: {len(result['remaining_issues'])}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
