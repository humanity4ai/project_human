#!/usr/bin/env python3
"""
Form Audit - Audits form accessibility

Usage:
    python3 scripts/form_audit.py --input <file.html> [options]

Examples:
    python3 scripts/form_audit.py --input page.html
    python3 scripts/form_audit.py --input page.html --format json
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


class FormAuditor(HTMLParser):
    """Audits form accessibility."""

    def __init__(self):
        super().__init__()
        self.forms: list[dict] = []
        self.inputs: list[dict] = []
        self.labels: list[dict] = []
        self.issues: list[dict] = []
        self.current_form: Optional[dict] = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}

        if tag == 'form':
            self.current_form = attr_dict
            self.forms.append(attr_dict)

        elif tag in ('input', 'select', 'textarea'):
            input_type = attr_dict.get('type', 'text')
            if input_type not in ('hidden', 'submit', 'button', 'image', 'reset'):
                element = {'tag': tag, 'type': input_type, 'attrs': attr_dict}
                self.inputs.append(element)

                has_label = bool(
                    attr_dict.get('aria-label') or
                    attr_dict.get('aria-labelledby') or
                    attr_dict.get('id')
                )
                if not has_label:
                    self.issues.append({
                        'element': f'<{tag} type="{input_type}">',
                        'issue': 'missing_label',
                        'message': f'{input_type} input missing label'
                    })

                if attr_dict.get('required') and not attr_dict.get('aria-required'):
                    self.issues.append({
                        'element': f'<{tag} type="{input_type}">',
                        'issue': 'missing_required_attribute',
                        'message': 'Required field should have aria-required="true"'
                    })

                if attr_dict.get('aria-invalid') and not attr_dict.get('aria-describedby'):
                    self.issues.append({
                        'element': f'<{tag} type="{input_type}">',
                        'issue': 'missing_error_association',
                        'message': 'Invalid field should have aria-describedby for error message'
                    })

        elif tag == 'label':
            self.labels.append(attr_dict)


def audit_forms(content: str) -> dict:
    """Audit form accessibility."""
    auditor = FormAuditor()
    try:
        auditor.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    return {
        'success': len(auditor.issues) == 0,
        'form_count': len(auditor.forms),
        'input_count': len(auditor.inputs),
        'label_count': len(auditor.labels),
        'issues': auditor.issues,
        'summary': {
            'total_inputs': len(auditor.inputs),
            'total_issues': len(auditor.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Audit form accessibility",
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

    result = audit_forms(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Form Accessibility Audit Results")
        print("=" * 40)
        print(f"Forms: {result['form_count']}")
        print(f"Form inputs: {result['input_count']}")
        print(f"Labels: {result['label_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['element']}: {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
