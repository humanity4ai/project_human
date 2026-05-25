#!/usr/bin/env python3
"""
Check Medical Claims

Checks for inappropriate medical claims.

Usage:
    python3 scripts/check_medical.py --input <file.txt> [options]
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

MEDICAL_CLAIMS = [
    (r'\bcure\b', 'Makes cure claim'),
    (r'\bguaranteed to.*treat\b', 'Treatment guarantee'),
    (r'\bmedical advice\b', 'Medical advice'),
    (r'\bdiagnos(e|ed|ing)\b', 'Diagnosis'),
    (r'\bprescri(be|ption|bed)\b', 'Prescription'),
    (r'\bmedication.*without.*doctor\b', 'Medication without doctor'),
    (r'\b替代.*医学\b', 'Alternatives to medicine'),  # Chinese
    (r'\bhome remedy.*depression\b', 'Home remedy claim'),
]

APPROPRIATE_TERMS = [
    'support',
    'help',
    'resources',
    'coping strategies',
    'wellness',
    'self-care',
]


def check_medical_claims(content: str) -> dict:
    """Check for medical claims."""
    issues = []
    
    for pattern, description in MEDICAL_CLAIMS:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append({
                'type': 'medical_claim',
                'description': description,
                'suggestion': 'Remove or rephrase to avoid medical claims'
            })
    
    appropriate_count = sum(1 for term in APPROPRIATE_TERMS if term in content.lower())
    
    return {
        'success': len(issues) == 0,
        'issues': issues,
        'appropriate_term_count': appropriate_count,
        'recommendation': 'Clinical review needed' if issues else 'Appropriate language'
    }


def main():
    parser = argparse.ArgumentParser(
        description="Check for medical claims",
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

    result = check_medical_claims(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Medical Claims Check")
        print("=" * 40)
        print(f"Issues: {len(result['issues'])}")
        print(f"Recommendation: {result['recommendation']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
