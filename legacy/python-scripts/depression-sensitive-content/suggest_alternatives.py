#!/usr/bin/env python3
"""
Suggest Alternatives

Suggests alternative phrasing for problematic content.

Usage:
    python3 scripts/suggest_alternatives.py --input <file.txt> [options]
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

ALTERNATIVES = {
    'suffering from': 'living with',
    'afflicted with': 'coping with',
    'victim of': 'person who has experienced',
    'depressed person': 'person living with depression',
    'depressive person': 'person with depression',
    'mentally ill': 'person with mental illness',
    'mentally ill person': 'person with mental illness',
    'crazy': 'use specific term',
    'insane': 'use specific term',
    'psycho': 'avoid',
    'committed suicide': 'died by suicide',
    'kill themselves': 'take their own life',
    'just get over it': 'that sounds really difficult',
    'snap out of it': 'i\'m here for you',
    'it\'s all in your head': 'your feelings are valid',
    'poor compliance': 'find it challenging to follow',
    'non-compliant': 'finding it difficult',
    'disease': 'condition',
    'patient': 'person',
}

SENTENCE_BREAK_THRESHOLD = 25


def suggest_alternatives(content: str) -> dict:
    """Suggest alternative phrasing."""
    suggestions = []
    
    for original, alternative in ALTERNATIVES.items():
        pattern = re.compile(re.escape(original), re.IGNORECASE)
        matches = list(pattern.finditer(content))
        
        if matches:
            for match in matches:
                suggestions.append({
                    'original': match.group(),
                    'suggestion': alternative,
                    'position': match.start(),
                    'reason': get_reason(original)
                })
    
    sentences = re.split(r'[.!?]+', content)
    long_sentences = []
    for i, sentence in enumerate(sentences, 1):
        word_count = len(sentence.split())
        if word_count > SENTENCE_BREAK_THRESHOLD:
            long_sentences.append({
                'sentence': sentence.strip()[:50] + '...',
                'word_count': word_count,
                'suggestion': 'Break into shorter sentences'
            })
    
    return {
        'success': len(suggestions) == 0 and len(long_sentences) == 0,
        'suggestions': suggestions,
        'long_sentences': long_sentences,
        'total_suggestions': len(suggestions) + len(long_sentences)
    }


def get_reason(original: str) -> str:
    """Get reason for suggestion."""
    reasons = {
        'suffering from': 'Person-first language is more respectful',
        'depressed person': 'Use person-first: person living with depression',
        'committed suicide': 'Died by suicide is more accurate and less stigmatizing',
        'just get over it': 'Validates feelings rather than minimizing',
    }
    return reasons.get(original, 'More respectful language')


def main():
    parser = argparse.ArgumentParser(
        description="Suggest alternative phrasing",
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

    result = suggest_alternatives(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Suggested Alternatives")
        print("=" * 40)
        print(f"Total suggestions: {result['total_suggestions']}")
        
        if result['suggestions']:
            print("\nTerm replacements:")
            for s in result['suggestions']:
                print(f"  '{s['original']}' -> '{s['suggestion']}'")
        
        if result['long_sentences']:
            print("\nSentence simplification:")
            for s in result['long_sentences']:
                print(f"  {s['word_count']} words: {s['suggestion']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
