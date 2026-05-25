#!/usr/bin/env python3
"""Measure Readability - Flesch-Kincaid score"""
import argparse
import sys
from pathlib import Path

def count_syllables(word):
    word = word.lower()
    if len(word) <= 3: return 1
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith('e'): count -= 1
    return max(1, count)

def measure_readability(text: str) -> dict:
    words = text.split()
    sentences = len([s for s in text.split('.') if s.strip()])
    syllables = sum(count_syllables(w) for w in words)
    if not words or not sentences:
        return {'score': 0, 'level': 'N/A'}
    score = 206.835 - 1.015 * (len(words)/sentences) - 84.6 * (syllables/len(words))
    return {'score': round(score, 1), 'level': 'Easy' if score > 60 else 'Medium' if score > 30 else 'Hard'}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", required=True)
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")
    args = parser.parse_args()
    content = Path(args.input).read_text()
    result = measure_readability(content)
    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f"Readability: {result['score']} ({result['level']})")
    sys.exit(0)

if __name__ == "__main__":
    main()
