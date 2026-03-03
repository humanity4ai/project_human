#!/usr/bin/env python3
"""
Media Check - Validates audio/video accessibility

Usage:
    python3 scripts/media_check.py --input <file.html> [options]

Examples:
    python3 scripts/media_check.py --input page.html
    python3 scripts/media_check.py --input page.html --format json
"""
import argparse
import logging
import sys
from pathlib import Path
from html.parser import HTMLParser
from typing import Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)


class MediaChecker(HTMLParser):
    """Validates audio/video accessibility."""

    def __init__(self):
        super().__init__()
        self.video_elements: list[dict] = []
        self.audio_elements: list[dict] = []
        self.track_elements: list[dict] = []
        self.issues: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]):
        attr_dict = {k: v for k, v in attrs}

        if tag == 'video':
            self.video_elements.append(attr_dict)
            if not attr_dict.get('captions') and not attr_dict.get('aria-describedby'):
                self.issues.append({
                    'element': '<video>',
                    'issue': 'missing_captions',
                    'message': 'Video should have captions via <track> or aria-describedby'
                })

        elif tag == 'audio':
            self.audio_elements.append(attr_dict)
            if not attr_dict.get('transcript') and not attr_dict.get('aria-describedby'):
                self.issues.append({
                    'element': '<audio>',
                    'issue': 'missing_transcript',
                    'message': 'Audio should have transcript or aria-describedby'
                })

        elif tag == 'track':
            self.track_elements.append(attr_dict)
            kind = attr_dict.get('kind', '')
            if kind == 'captions' and not attr_dict.get('src'):
                self.issues.append({
                    'element': '<track kind="captions">',
                    'issue': 'missing_track_source',
                    'message': 'Captions track missing src attribute'
                })


def check_media(content: str) -> dict:
    """Check media accessibility in HTML."""
    checker = MediaChecker()
    try:
        checker.feed(content)
    except Exception as e:
        logger.error(f"Failed to parse HTML: {e}")
        return {'success': False, 'errors': [str(e)]}

    return {
        'success': len(checker.issues) == 0,
        'video_count': len(checker.video_elements),
        'audio_count': len(checker.audio_elements),
        'track_count': len(checker.track_elements),
        'issues': checker.issues,
        'summary': {
            'total_media': len(checker.video_elements) + len(checker.audio_elements),
            'total_issues': len(checker.issues)
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate audio/video accessibility",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--input", "-i", required=True, help="Input HTML file")
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

    result = check_media(content)

    if args.format == "json":
        import json
        print(json.dumps(result, indent=2))
    else:
        print("Media Accessibility Check Results")
        print("=" * 40)
        print(f"Video elements: {result['video_count']}")
        print(f"Audio elements: {result['audio_count']}")
        print(f"Caption tracks: {result['track_count']}")
        print(f"Issues: {result['summary']['total_issues']}")

        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  [{issue['issue']}] {issue['message']}")

    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()
