#!/usr/bin/env python3
"""Chunk Content - Suggest chunking"""
import argparse
import sys
from pathlib import Path

def chunk_content(text: str) -> dict:
    paragraphs = text.split('\n\n')
    chunks = []
    for i, p in enumerate(paragraphs):
        if len(p.split()) > 50:
            chunks.append(f"Chunk {i+1}: Consider breaking into smaller paragraphs")
    return {'success': len(chunks) == 0, 'chunks': chunks}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = chunk_content(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Chunk suggestions: {len(result['chunks'])}")
    sys.exit(0 if result['success'] else 1)

if __name__ == "__main__":
    main()
