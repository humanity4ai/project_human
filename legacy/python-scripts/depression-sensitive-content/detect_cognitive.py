#!/usr/bin/env python3
"""
Detect Cognitive Friction

Detects complex language that may be difficult for people with depression.

Usage:
    python3 scripts/detect_cognitive.py --input <file.txt> [options]
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


def count_words(text: str) -> int:
    """Count words in text."""
    return len(re.findall(r'\b\w+\b', text))


def detect_cognitive_friction(content: str) -> dict:
    """Detect cognitive friction in content."""
    issues = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines, 1):
        word_count = count_words(line)
        
        if word_count > 25:
            issues.append({
                'line': i,
                'type': 'long_sentence',
                'word_count': word_count,
                'message': f'Sentence has {word_count} words (recommended: under 20)'
            })
        
        if re.search(r',[^,]*,[^,]*,', line):
            issues.append({
                'line': i,
                'type': 'complex_structure',
                'message': 'Multiple commas suggest complex sentence'
            })
        
        passive_patterns = r'\b(was|were|been|being)\s+\w+ed\b'
        if re.search(passive_patterns, line):
            issues.append({
                'line': i,
                'type': 'passive_voice',
                'message': 'Passive voice may be harder to process'
            })

    jargon_words = re.findall(r'\b\w{15,}\b', content)
    if jargon_words:
        issues.append({
            'type': 'jargon',
            'words': list(set(jargon_words)),
            'message': f'Found {len(set(jargon_words))} long words that may be confusing'
        })

    return {
        'success': len(issues) == 0,
        'issue_count': len(issues),
        'issues': issues,
        'summary': {
            'long_sentences': len([i for i in issues if i.get('type') == 'long_sentence']),
            'complex_structure': len([i for i in issues if i.get('type') == 'complex_structure']),
            'jargon': len([i for i in issues if i.get('type') == 'jargon'])
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Detect cognitive friction",
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

    result = detect_cognitive_friction(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Cognitive Friction Detection")
        print("=" * 40)
        print(f"Total issues: {result['summary']['long_sentences']}")
        
        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                if 'line' in issue:
                    print(f"  Line {issue['line']}: {issue['message']}")
                else:
                    print(f"  {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
