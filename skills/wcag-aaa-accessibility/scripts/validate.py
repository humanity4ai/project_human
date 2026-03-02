#!/usr/bin/env python3
"""
WCAG Accessibility Fix Validator

Validates that accessibility fixes have been correctly applied.

Usage:
    python3 scripts/validate.py --input <file.html> [options]

Examples:
    python3 scripts/validate.py --input fixed.html --check-lang --check-alt
"""
import argparse
import json
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


class HTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang_found = False
        self.alt_count = 0
        self.empty_alt_count = 0
        self.labeled_inputs = 0
        self.total_inputs = 0
        self.skip_link = False
        self.headings = []
        
    def handle_starttag(self, tag, attrs):
        attr_dict = {k: v for k, v in attrs}
        
        if tag == 'html':
            if attr_dict.get('lang'):
                self.lang_found = True
                
        elif tag == 'img':
            self.alt_count += 1
            if attr_dict.get('alt') == '':
                self.empty_alt_count += 1
                
        elif tag in ('input', 'select', 'textarea'):
            input_type = attr_dict.get('type', 'text')
            if input_type not in ('hidden', 'submit', 'button', 'image'):
                self.total_inputs += 1
                if (attr_dict.get('aria-label') or 
                    attr_dict.get('aria-labelledby') or 
                    attr_dict.get('id')):
                    self.labeled_inputs += 1
                    
        elif tag == 'a':
            href = attr_dict.get('href', '')
            if href and href.startswith('#'):
                self.skip_link = True
                
        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.headings.append(int(tag[1]))


def validate_html(content, checks):
    validator = HTMLValidator()
    
    try:
        validator.feed(content)
    except Exception as e:
        return {"success": False, "error": str(e)}
    
    results = []
    all_passed = True
    
    if checks.get("lang"):
        passed = validator.lang_found
        results.append({"check": "language", "passed": passed, 
                       "message": "Language declaration found" if passed else "Missing lang"})
        if not passed:
            all_passed = False
            
    if checks.get("alt"):
        has_descriptive = validator.alt_count > validator.empty_alt_count
        passed = has_descriptive or validator.alt_count == 0
        results.append({"check": "alt-text", "passed": passed,
                       "message": f"Images have alt text" if passed else "Images missing alt"})
        if not passed:
            all_passed = False
            
    if checks.get("labels"):
        if validator.total_inputs > 0:
            passed = validator.labeled_inputs == validator.total_inputs
            results.append({"check": "form-labels", "passed": passed,
                           "message": f"{validator.labeled_inputs}/{validator.total_inputs} inputs labeled"})
            if not passed:
                all_passed = False
                
    if checks.get("skip_link"):
        passed = validator.skip_link
        results.append({"check": "skip-link", "passed": passed,
                       "message": "Skip link found" if passed else "No skip link"})
        if not passed:
            all_passed = False
            
    return {"success": True, "all_passed": all_passed, "results": results}


def main():
    parser = argparse.ArgumentParser(description="Validate WCAG fixes")
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
    parser.add_argument("--check-lang", action="store_true", help="Check language")
    parser.add_argument("--check-alt", action="store_true", help="Check alt text")
    parser.add_argument("--check-labels", action="store_true", help="Check labels")
    parser.add_argument("--check-skip-link", action="store_true", help="Check skip link")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    parser.add_argument("--verbose", "-v", action="store_true")
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)
    
    checks = {
        "lang": args.check_lang,
        "alt": args.check_alt,
        "labels": args.check_labels,
        "skip_link": args.check_skip_link
    }
    checks = {k: v for k, v in checks.items() if v}
    
    if not checks:
        logger.error("No checks specified")
        sys.exit(2)
    
    try:
        content = input_path.read_text(encoding="utf-8")
    except Exception as e:
        logger.error(f"Read error: {e}")
        sys.exit(1)
    
    result = validate_html(content, checks)
    
    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if result["success"]:
            all_passed = True
            for r in result["results"]:
                status = "PASS" if r["passed"] else "FAIL"
                print(f"[{status}] {r['check']}: {r['message']}")
                if not r["passed"]:
                    all_passed = False
            print(f"\n{'All checks passed!' if all_passed else 'Some checks failed.'}")
        else:
            print(f"Error: {result.get('error')}")
    
    sys.exit(0 if result.get("all_passed") else 1)


if __name__ == "__main__":
    main()
