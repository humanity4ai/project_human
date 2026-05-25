#!/usr/bin/env python3
"""
Acknowledge Loss

Generates acknowledgment phrases for grief.

Usage:
    python3 scripts/acknowledge_loss.py --name <name> [options]
"""
import argparse
import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

TEMPLATES = [
    "I'm so sorry for your loss.",
    "I'm sorry to hear about {name}.",
    "Losing {name} must be incredibly hard.",
    "I'm here with you.",
    "This is so hard.",
]

def generate_acknowledgments(name: str = "them") -> dict:
    acknowledgments = [t.format(name=name) for t in TEMPLATES]
    return {'success': True, 'acknowledgments': acknowledgments}

def main():
    parser = argparse.ArgumentParser(description="Generate acknowledgment phrases")
    parser.add_argument("--name", "-n", default="them", help="Name of deceased")
    args = parser.parse_args()
    result = generate_acknowledgments(args.name)
    for a in result['acknowledgments']:
        print(a)
    sys.exit(0)

if __name__ == "__main__":
    main()
