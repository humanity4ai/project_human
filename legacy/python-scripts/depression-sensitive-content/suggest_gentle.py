#!/usr/bin/env python3
"""
Suggest Gentle Language

Suggests gentler alternatives to harsh language.

Usage:
    python3 scripts/suggest_gentle.py --input <file.txt> [options]
"""
import argparse
import logging
import re
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

GENTLE_ALTERNATIVES = {
    r'\bfail(ed|ure)?\b': 'find challenging',
    r'\bcan\'t\b': 'find it difficult to',
    r'\bwon\'t\b': 'find it hard to',
    r'\bpoor\b': 'challenging',
    r'\bterrible\b': 'very difficult',
    r'\bawful\b': 'really hard',
    r'\bhorrible\b': 'overwhelming',
    r'\bbad\b': 'difficult',
    r'\bwrong\b': 'different',
    r'\bproblem\b': 'challenge',
    r'\bissues\b': 'difficulties',
    r'\bwrong with\b': 'different for',
    r'\bget over\b': 'work through',
    r'\bdeal with\b': 'coping with',
    r'\bsuffering\b': 'experiencing',
}


def suggest_gentle(content: str) -> dict:
    """Suggest gentler language."""
    suggestions = []
    
    for pattern, alternative in GENTLE_ALTERNATIVES.items():
        regex = re.compile(pattern, re.IGNORECASE)
        matches = list(regex.finditer(content))
        
        if matches:
            for match in matches:
                suggestions.append({
                    'original': match.group(),
                    'suggestion': alternative,
                    'reason': 'Gentler, more supportive language'
                })
    
    return {
        'success': len(suggestions) == 0,
        'suggestions': suggestions,
        'count': len(suggestions),
        'recommendation': 'Apply gentle language alternatives' if suggestions else 'Already gentle'
    }


def main():
    parser = argparse.ArgumentParser(
        description="Suggest gentle language",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input text file")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"File not found: {args.input}")
        sys.exit(1)

    try:
        content = input_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.error(f"Failed to read file: {e}")
        sys.exit(1)

    result = suggest_gentle(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Gentle Language Suggestions")
        print("=" * 40)
        print(f"Suggestions: {result['count']}")
        
        if result['suggestions']:
            print("\nAlternatives:")
            for s in result['suggestions']:
                print(f"  '{s['original']}' -> '{s['suggestion']}'")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
