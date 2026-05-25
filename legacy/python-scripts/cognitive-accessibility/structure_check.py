#!/usr/bin/env python3
"""Structure Check - Check content structure"""
import argparse
import sys
from pathlib import Path

def structure_check(text: str) -> dict:
    has_headings = bool(text.split('\n'))
    issues = []
    if not any(line.startswith('#') for line in text.split('\n')):
        issues.append("No headings found")
    return {'success': len(issues) == 0, 'issues': issues}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = structure_check(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Structure issues: {len(result['issues'])}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
