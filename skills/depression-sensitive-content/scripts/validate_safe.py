#!/usr/bin/env python3
"""
Validate Safe Content

Validates that content meets safety criteria.

Usage:
    python3 scripts/validate_safe.py --input <file.txt> [options]
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

DANGEROUS_PATTERNS = [
    r'\b(want to die|end my life|take my life)\b',
    r'\b(kill myself|end it all)\b',
    r'\bself.?harm\b',
]

SAFE_INDICATORS = [
    'person living with',
    'person experiencing',
    'coping with',
    'living with depression',
    'support available',
    'help is available',
    'you are not alone',
]


def validate_safe(content: str) -> dict:
    """Validate content is safe."""
    issues = []
    
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append('Contains crisis language')
            break
    
    safe_count = sum(1 for indicator in SAFE_INDICATORS if indicator.lower() in content.lower())
    
    return {
        'success': len(issues) == 0,
        'is_safe': len(issues) == 0,
        'issues': issues,
        'safe_indicators_count': safe_count,
        'recommendation': 'Include crisis resources' if len(issues) > 0 else 'Content appears safe'
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate content safety",
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

    result = validate_safe(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Content Safety Validation")
        print("=" * 40)
        print(f"Safe: {result['is_safe']}")
        print(f"Recommendation: {result['recommendation']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
