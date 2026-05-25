#!/usr/bin/env python3
"""Progressive Disclosure - Check progressive disclosure"""
import argparse
import sys
from pathlib import Path

def progressive_disclosure(text: str) -> dict:
    issues = []
    if len(text.split()) > 500:
        issues.append("Consider showing less content initially")
    return {'success': len(issues) == 0, 'issues': issues}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = progressive_disclosure(content)
    print(f"Progressive disclosure: {'OK' if result['success'] else 'Needs work'}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
