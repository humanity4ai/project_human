#!/usr/bin/env python3
"""
Generate Rewrite Rationale

Generates rationale for suggested rewrites.

Usage:
    python3 scripts/generate_rationale.py --original <file.txt> --suggested <file.txt> [options]
"""
import argparse
import logging
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

RATIONALE_TEMPLATES = {
    'person_first': 'Using person-first language respects dignity and avoids defining someone by their condition.',
    'stigmatizing': 'This term has negative connotations that can increase shame and stigma.',
    'crisis_language': 'This phrase uses language that minimizes the seriousness of suicide.',
    'cognitive': 'Shorter sentences reduce cognitive load and are easier to process.',
    'minimizing': 'This phrase dismisses the person\'s experience rather than validating it.',
    'judgmental': 'This language implies judgment rather than support.',
    'gentle': 'Gentler language is more supportive and reduces negative framing.',
    'hopeful': 'Hope-oriented language supports recovery and empowerment.',
}


def generate_rationale(original: str, suggested: str, issues: list) -> dict:
    """Generate rationale for rewrites."""
    rationales = []
    
    for issue in issues:
        issue_type = issue.get('type', 'unknown')
        template = RATIONALE_TEMPLATES.get(issue_type, 'This change improves clarity and sensitivity.')
        
        rationales.append({
            'issue_type': issue_type,
            'original': issue.get('original', original[:50]),
            'suggested': issue.get('suggestion', suggested[:50]),
            'rationale': template
        })
    
    return {
        'success': True,
        'rationales': rationales,
        'count': len(rationales),
        'summary': f'Generated {len(rationales)} rationale(s) for review'
    }


def main():
    parser = argparse.ArgumentParser(
        description="Generate rewrite rationale",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--original", "-o", required=True, help="Original text file")
    parser.add_argument("--suggested", "-s", required=True, help="Suggested text file")
    parser.add_argument("--issues", "-i", help="Optional JSON file with issues")
    parser.add_argument("--format", "-f", choices=["json", "text"], default="text")

    args = parser.parse_args()

    orig_path = Path(args.original)
    sugg_path = Path(args.suggested)

    if not orig_path.exists():
        logger.error(f"Original file not found: {args.original}")
        sys.exit(1)
    if not sugg_path.exists():
        logger.error(f"Suggested file not found: {args.suggested}")
        sys.exit(1)

    try:
        original = orig_path.read_text(encoding='utf-8')
        suggested = sugg_path.read_text(encoding='utf-8')
        
        issues = []
        if args.issues:
            import json
            with open(args.issues) as f:
                issues = json.load(f).get('suggestions', [])
    except Exception as e:
        logger.error(f"Failed to read files: {e}")
        sys.exit(1)

    result = generate_rationale(original, suggested, issues)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Rewrite Rationale")
        print("=" * 40)
        print(f"Total rationales: {result['count']}")
        
        if result['rationales']:
            print("\nRationales:")
            for r in result['rationales']:
                print(f"\n{r['issue_type'].upper()}:")
                print(f"  Original: {r['original']}")
                print(f"  Suggested: {r['suggested']}")
                print(f"  Why: {r['rationale']}")

    sys.exit(0)


if __name__ == "__main__":
    main()
