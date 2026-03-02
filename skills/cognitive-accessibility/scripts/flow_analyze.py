#!/usr/bin/env python3
"""Flow Analyze - Analyze information flow"""
import argparse
import sys
from pathlib import Path

def flow_analyze(text: str) -> dict:
    paragraphs = text.split('\n\n')
    issues = []
    if len(paragraphs) > 5:
        issues.append("Consider breaking into more sections")
    return {'success': len(issues) == 0, 'issues': issues}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = flow_analyze(content)
    print(f"Flow issues: {len(result['issues'])}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
