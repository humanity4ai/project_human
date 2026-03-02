#!/usr/bin/env python3
"""Test Understanding - Suggest comprehension tests"""
import sys

SUGGESTIONS = [
    "Ask user to summarize key points",
    "Have user list next steps",
    "Check if user can explain in own words",
]

def test_understanding() -> dict:
    return {'success': True, 'suggestions': SUGGESTIONS}

def main():
    result = test_understanding()
    for s in result['suggestions']:
        print(f"- {s}")
    sys.exit(0)

if __name__ == "__main__":
    main()
