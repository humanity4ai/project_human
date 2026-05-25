#!/usr/bin/env python3
"""
WCAG Accessibility Analyzer

Analyzes HTML content for common WCAG accessibility issues.

Usage:
    python3 scripts/analyze.py --input <file.html> [options]

Examples:
    python3 scripts/analyze.py --input page.html
    python3 scripts/analyze.py --input page.html --format json --verbose
"""
import argparse
import logging
import re
import sys
from pathlib import Path
from html.parser import HTMLParser
from typing import Optional

# Configure logging to stderr
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)


class AccessibilityAnalyzer(HTMLParser):
    """HTML parser that analyzes for accessibility issues."""
    
    def __init__(self):
        super().__init__()
        self.issues: list[dict] = []
        self.headings: list[dict] = []
        self.images_without_alt: list[str] = []
        self.inputs_without_label: list[str] = []
        self.links: list[dict] = []
        self.has_lang = False
        self.has_skip_link = False
        self.tag_stack: list[str] = []
        
    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}
        
        if tag == 'html':
            lang = attr_dict.get('lang') or attr_dict.get('xml:lang')
            if lang:
                self.has_lang = True
                
        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            level = int(tag[1])
            self.headings.append({'tag': tag, 'level': level, 'position': self.getpos()})
            
        elif tag == 'img':
            if not attr_dict.get('alt'):
                src = attr_dict.get('src', 'unknown')
                self.images_without_alt.append(src)
                
        elif tag in ('input', 'select', 'textarea'):
            input_type = attr_dict.get('type', 'text')
            if input_type not in ('hidden', 'submit', 'button', 'image'):
                has_label = False
                has_aria = bool(attr_dict.get('aria-label') or attr_dict.get('aria-labelledby'))
                input_id = attr_dict.get('id')
                if has_aria or input_id:
                    has_label = True
                if not has_label:
                    self.inputs_without_label.append(attr_dict.get('name', 'unnamed'))
                    
        elif tag == 'a':
            href = attr_dict.get('href', '')
            text = attr_dict.get('')  # This won't work, need to track text
            self.links.append({'href': href, 'position': self.getpos()})
            
        elif tag == 'area':
            href = attr_dict.get('href', '')
            self.links.append({'href': href, 'position': self.getpos(), 'area': True})
            
        elif tag == 'skip-link' or (tag == 'a' and attr_dict.get('href', '').startswith('#')):
            self.has_skip_link = True
            
        if tag not in ('br', 'hr', 'img', 'input', 'meta', 'link'):
            self.tag_stack.append(tag)
            
    def handle_endtag(self, tag: str):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()


def analyze_html(content: str) -> dict:
    """Analyze HTML content for accessibility issues."""
    analyzer = AccessibilityAnalyzer()
    
    try:
        analyzer.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {"success": False, "error": str(e)}
    
    issues = []
    
    # Check for language declaration
    if not analyzer.has_lang:
        issues.append({
            "severity": "critical",
            "wcag": "3.1.1",
            "description": "Missing language declaration on <html> element",
            "recommendation": "Add lang attribute to <html> element, e.g., <html lang=\"en\">"
        })
        
    # Check for skip link
    if not analyzer.has_skip_link:
        issues.append({
            "severity": "minor",
            "wcag": "2.4.1",
            "description": "No skip link found",
            "recommendation": "Add a skip link to bypass navigation: <a href='#main'>Skip to main content</a>"
        })
        
    # Check for images without alt
    for src in analyzer.images_without_alt:
        issues.append({
            "severity": "critical",
            "wcag": "1.1.1",
            "description": f"Image missing alt attribute: {src}",
            "recommendation": "Add alt attribute to image. Use alt=\"\" for decorative images."
        })
        
    # Check for inputs without labels
    for name in analyzer.inputs_without_label:
        issues.append({
            "severity": "critical",
            "wcag": "1.3.1",
            "description": f"Form input '{name}' missing label",
            "recommendation": "Add <label> element or aria-label/aria-labelledby to form input"
        })
        
    # Check heading hierarchy
    if analyzer.headings:
        prev_level = 0
        for h in analyzer.headings:
            if h['level'] > prev_level + 1:
                issues.append({
                    "severity": "minor",
                    "wcag": "1.3.1",
                    "description": f"Heading level skipped: <{h['tag']}> after h{prev_level}",
                    "recommendation": "Use sequential heading levels without skipping"
                })
            prev_level = h['level']
            
    return {
        "success": True,
        "issues": issues,
        "summary": {
            "total_issues": len(issues),
            "critical": len([i for i in issues if i['severity'] == 'critical']),
            "major": len([i for i in issues if i['severity'] == 'major']),
            "minor": len([i for i in issues if i['severity'] == 'minor'])
        }
    }


def validate_input(path: str) -> Path:
    """Validate input file exists and is readable."""
    p = Path(path)
    if not p.exists():
        logger.error(f"File not found: {path}")
        sys.exit(1)
    if not p.is_file():
        logger.error(f"Not a file: {path}")
        sys.exit(1)
    return p


def main():
    parser = argparse.ArgumentParser(
        description="Analyze HTML for WCAG accessibility issues",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text",
                        help="Output format")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--wcag-level", choices=["A", "AA", "AAA"], default="AA",
                        help="WCAG conformance level to check")
    
    args = parser.parse_args()
    
    # Set logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        logger.debug("Debug logging enabled")
    
    # Validate input
    input_path = validate_input(args.input)
    
    # Read content
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except PermissionError:
        logger.error(f"Permission denied: {input_path}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to read file: {e}")
        sys.exit(1)
    
    # Analyze
    logger.info(f"Analyzing {input_path} for WCAG {args.wcag_level} issues...")
    result = analyze_html(content)
    
    # Output results
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        if result["success"]:
            summary = result["summary"]
            print(f"\n=== Accessibility Analysis Results ===")
            print(f"Total issues: {summary['total_issues']}")
            print(f"  Critical: {summary['critical']}")
            print(f"  Major: {summary['major']}")
            print(f"  Minor: {summary['minor']}")
            
            if result["issues"]:
                print(f"\n=== Issues Found ===")
                for issue in result["issues"]:
                    print(f"\n[{issue['severity'].upper()}] {issue['wcag']}: {issue['description']}")
                    print(f"  Recommendation: {issue['recommendation']}")
            else:
                print("\nNo issues found!")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
    
    # Exit with appropriate code
    if result.get("success"):
        # Exit 0 if no critical issues, 1 if issues found
        has_critical = result.get("summary", {}).get("critical", 0) > 0
        sys.exit(1 if has_critical else 0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
