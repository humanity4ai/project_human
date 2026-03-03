#!/usr/bin/env python3
"""
WCAG Keyboard Navigation Tester

Tests keyboard accessibility of HTML content.

Usage:
    python3 scripts/keyboard_test.py --input <file.html>
"""
import argparse
import sys
import re
from pathlib import Path

def analyze_keyboard_accessibility(content):
    """Analyze HTML for keyboard accessibility issues."""
    issues = []
    
    # Check for tabindex
    tabindex_negative = re.findall(r'tabindex="-1"', content)
    if tabindex_negative:
        issues.append({
            "severity": "major",
            "wcag": "2.4.3",
            "description": f"Found {len(tabindex_negative)} elements with tabindex='-1' that skip focus"
        })
    
    # Check for tabindex=0
    tabindex_zero = re.findall(r'tabindex="0"', content)
    
    # Check for interactive elements without focus
    buttons = re.findall(r'<button[^>]*>', content, re.IGNORECASE)
    links = re.findall(r'<a[^>]*href[^>]*>', content, re.IGNORECASE)
    inputs = re.findall(r'<input[^>]*>', content, re.IGNORECASE)
    
    # Check for onclick without keyboard support
    onclick_no_key = re.findall(r'onclick="([^"]*)"(?!.*onkeydown)(?!.*onkeyup)', content)
    if onclick_no_key:
        issues.append({
            "severity": "critical",
            "wcag": "2.1.1",
            "description": f"Found {len(onclick_no_key)} elements with onclick but no keyboard handler"
        })
    
    # Check for role=button without keyboard
    role_button = re.findall(r'role="button"(?!.*tabindex)', content)
    if role_button:
        issues.append({
            "severity": "major",
            "wcag": "2.4.3",
            "description": f"Found {len(role_button)} elements with role='button' but no tabindex"
        })
    
    # Check skip link
    if 'skip' not in content.lower() or 'href="#main"' not in content:
        issues.append({
            "severity": "minor",
            "wcag": "2.4.1",
            "description": "No skip link found"
        })
    
    return {
        "success": True,
        "issues": issues,
        "summary": {
            "total": len(issues),
            "critical": len([i for i in issues if i["severity"] == "critical"]),
            "major": len([i for i in issues if i["severity"] == "major"]),
            "minor": len([i for i in issues if i["severity"] == "minor"])
        }
    }


def main():
    parser = argparse.ArgumentParser(description="Test keyboard accessibility")
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    
    path = Path(args.input)
    if not path.exists():
        print(f"Error: File not found: {args.input}", file=sys.stderr)
        sys.exit(1)
    
    content = path.read_text(encoding="utf-8")
    result = analyze_keyboard_accessibility(content)
    
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Keyboard Accessibility Analysis")
        print(f"Total issues: {result['summary']['total']}")
        for issue in result["issues"]:
            print(f"  [{issue['severity'].upper()}] {issue['wcag']}: {issue['description']}")
    
    sys.exit(1 if result["summary"]["critical"] > 0 else 0)


if __name__ == "__main__":
    main()
