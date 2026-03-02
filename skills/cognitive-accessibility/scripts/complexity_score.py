#!/usr/bin/env python3
"""Complexity Score - Calculate overall complexity"""
import argparse
import sys
from pathlib import Path

def complexity_score(text: str) -> dict:
    words = text.split()
    sentences = max(1, len([s for s in text.split('.') if s.strip()]))
    score = (len(words)/sentences) / 20 * 100
    return {'success': score < 100, 'score': round(score, 1), 'level': 'Simple' if score < 50 else 'Moderate' if score < 100 else 'Complex'}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = complexity_score(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Complexity: {result['score']} ({result['level']})")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
