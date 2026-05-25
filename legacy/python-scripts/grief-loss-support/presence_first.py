#!/usr/bin/env python3
"""
Presence First

Generates presence-first language for grief support.

Usage:
    python3 scripts/presence_first.py [options]
"""
import argparse
import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s", stream=sys.stderr)
logger = logging.getLogger(__name__)

PHRASES = [
    "I'm here with you.",
    "You're not alone.",
    "Take all the time you need.",
    "I'm thinking of you.",
    "Your grief is valid.",
    "There are no words, but I'm here.",
]

def generate_presence() -> dict:
    return {'success': True, 'phrases': PHRASES}

def main():
    parser = argparse.ArgumentParser(description="Generate presence-first phrases")
    args = parser.parse_args()
    result = generate_presence()
    for p in result['phrases']:
        print(p)
    sys.exit(0)

if __name__ == "__main__":
    main()
