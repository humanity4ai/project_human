#!/usr/bin/env python3
"""
ARIA Checker - Validates ARIA attributes and roles

Usage:
    python3 scripts/aria_check.py --input <file.html> [options]

Examples:
    python3 scripts/aria_check.py --input page.html
    python3 scripts/aria_check.py --input page.html --format json
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

VALID_ROLES = {
    'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell',
    'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition',
    'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell',
    'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
    'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
    'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio',
    'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search',
    'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab',
    'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip',
    'tree', 'treegrid', 'treeitem'
}

VALID_STATES = {
    'aria-autocomplete', 'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex',
    'aria-colspan', 'aria-current', 'aria-disabled', 'aria-dropeffect', 'aria-expanded',
    'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-label',
    'aria-labelledby', 'aria-level', 'aria-live', 'aria-modal', 'aria-multiline',
    'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-placeholder',
    'aria-posinset', 'aria-pressed', 'aria-readonly', 'aria-relevant', 'aria-required',
    'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan',
    'aria-selected', 'aria-sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow',
    'aria-valuetext'
}

VALID_PROPERTIES = {
    'aria-activedescendant', 'aria-controls', 'aria-describedby', 'aria-details',
    'aria-errormessage', 'aria-flowto', 'aria-labelledby', 'aria-owns', 'aria-posinset',
    'aria-setsize'
}


class ARIAChecker(HTMLParser):
    """Validates ARIA attributes and roles."""

    def __init__(self):
        super().__init__()
        self.errors: list[dict] = []
        self.warnings: list[dict] = []
        self.valid_aria: list[dict] = []
        self.tag_stack: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}
        self.tag_stack.append(tag)

        role = attr_dict.get('role')
        if role and role not in VALID_ROLES:
            self.errors.append({
                'type': 'invalid_role',
                'element': f'<{tag}>',
                'message': f'Invalid ARIA role: {role}'
            })

        aria_attrs = [k for k in attr_dict if k.startswith('aria-')]
        for aria_attr in aria_attrs:
            if aria_attr not in VALID_STATES and aria_attr not in VALID_PROPERTIES:
                self.errors.append({
                    'type': 'invalid_attribute',
                    'element': f'<{tag}>',
                    'message': f'Invalid ARIA attribute: {aria_attr}'
                })
            else:
                self.valid_aria.append({
                    'element': f'<{tag}>',
                    'attribute': aria_attr,
                    'value': attr_dict[aria_attr]
                })

        if role in ('alert', 'alertdialog', 'log', 'marquee', 'status', 'timer') and 'aria-live' not in aria_attrs:
            self.warnings.append({
                'type': 'missing_live_region',
                'element': f'<{tag} role="{role}">',
                'message': f'Role {role} should have aria-live attribute'
            })

        if role in ('textbox', 'searchbox', 'combobox') and 'aria-label' not in aria_attrs and 'aria-labelledby' not in aria_attrs:
            self.warnings.append({
                'type': 'missing_label',
                'element': f'<{tag} role="{role}">',
                'message': f'Editable role should have aria-label or aria-labelledby'
            })

    def handle_endtag(self, tag: str):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()


def check_aria(content: str) -> dict:
    """Check ARIA usage in HTML content."""
    checker = ARIAChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [{'message': str(e)}]}

    return {
        'success': len(checker.errors) == 0,
        'errors': checker.errors,
        'warnings': checker.warnings,
        'valid_aria': checker.valid_aria,
        'summary': {
            'total_errors': len(checker.errors),
            'total_warnings': len(checker.warnings),
            'valid_attributes': len(checker.valid_aria)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate ARIA attributes and roles",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    parser.add_argument("--verbose", "-v", action="store_true")

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

    result = check_aria(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("ARIA Validation Results")
        print("=" * 40)
        print(f"Errors: {result['summary']['total_errors']}")
        print(f"Warnings: {result['summary']['total_warnings']}")
        print(f"Valid ARIA attributes: {result['summary']['valid_attributes']}")

        if result['errors']:
            print("\nERRORS:")
            for e in result['errors']:
                print(f"  [{e['type']}] {e['message']}")

        if result['warnings'] and args.verbose:
            print("\nWARNINGS:")
            for w in result['warnings']:
                print(f"  [{w['type']}] {w['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
