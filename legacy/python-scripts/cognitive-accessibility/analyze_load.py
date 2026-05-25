#!/usr/bin/env python3
"""
Analyze Cognitive Load

Analyzes content for cognitive load issues.
"""
import argparse
import re
import sys
from pathlib import Path

def analyze_load(content: str) -> dict:
    sentences = re.split(r'[.!?]+', content)
    long = sum(1 for s in sentences if len(s.split()) > 20)
    jargon = len(re.findall(r'\b\w{15,}\b', content))
    return {'success': long == 0, 'long_sentences': long, 'jargon_words': jargon}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = analyze_load(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Long sentences: {result['long_sentences']}, Jargon: {result['jargon_words']}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
