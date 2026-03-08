#!/usr/bin/env python3
"""
WCAG 2.2 AAA Color Contrast Checker

Validates foreground/background color pairs against WCAG 2.2 contrast requirements.

Usage:
    python3 check_contrast.py <foreground_hex> <background_hex>
    python3 check_contrast.py --file <colors_json>
    python3 check_contrast.py --tokens <tokens_css_file>
    python3 check_contrast.py --file <colors_json> --json

Examples:
    python3 check_contrast.py "#1a365d" "#ffffff"
    python3 check_contrast.py --file colors.json
    python3 check_contrast.py --tokens templates/tokens.css
    python3 check_contrast.py --file colors.json --json > report.json

colors.json format:
    {
      "pairs": [
        {"name": "Primary on White", "fg": "#1a365d", "bg": "#ffffff"},
        {"name": "Body Text", "fg": "#1a1a1a", "bg": "#f5f5f5"}
      ]
    }

Exit codes:
    0 = all pairs pass AAA
    1 = one or more pairs fail AAA
    2 = invalid input
"""

import sys
import json
import re


# Maximum file size for input files (1 MB)
MAX_FILE_SIZE = 1_048_576


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color string to RGB tuple.

    Accepts 3-digit or 6-digit hex strings with or without a leading '#'.
    Validates that the input contains only valid hexadecimal characters.
    """
    hex_color = hex_color.strip().lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    if len(hex_color) != 6 or not re.fullmatch(r"[0-9a-fA-F]{6}", hex_color):
        raise ValueError(f"Invalid hex color: #{hex_color}")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
    )


def rgb_to_hex(r: int, g: int, b: int) -> str:
    """Convert RGB tuple to hex color string."""
    return f"#{r:02x}{g:02x}{b:02x}"


def relative_luminance(r: int, g: int, b: int) -> float:
    """Calculate relative luminance per WCAG 2.2 definition."""
    def linearize(channel: int) -> float:
        srgb = channel / 255.0
        if srgb <= 0.04045:
            return srgb / 12.92
        return ((srgb + 0.055) / 1.055) ** 2.4

    r_lin = linearize(r)
    g_lin = linearize(g)
    b_lin = linearize(b)
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin


def contrast_ratio(fg_hex: str, bg_hex: str) -> float:
    """Calculate contrast ratio between two hex colors."""
    fg_rgb = hex_to_rgb(fg_hex)
    bg_rgb = hex_to_rgb(bg_hex)
    lum_fg = relative_luminance(*fg_rgb)
    lum_bg = relative_luminance(*bg_rgb)
    lighter = max(lum_fg, lum_bg)
    darker = min(lum_fg, lum_bg)
    return (lighter + 0.05) / (darker + 0.05)


def suggest_aaa_color(fg_hex: str, bg_hex: str) -> str:
    """Suggest the closest AAA-compliant foreground color by darkening or lightening."""
    bg_rgb = hex_to_rgb(bg_hex)
    bg_lum = relative_luminance(*bg_rgb)

    # Try darkening the foreground (reducing each channel)
    best = None
    for step in range(256):
        r, g, b = hex_to_rgb(fg_hex)
        # Darken proportionally
        factor = max(0, 1.0 - step * 0.005)
        nr, ng, nb = int(r * factor), int(g * factor), int(b * factor)
        nr, ng, nb = max(0, nr), max(0, ng), max(0, nb)
        candidate = rgb_to_hex(nr, ng, nb)
        ratio = contrast_ratio(candidate, bg_hex)
        if ratio >= 7.0:
            best = candidate
            break

    if best is None:
        # Try lightening instead (for dark backgrounds)
        for step in range(256):
            r, g, b = hex_to_rgb(fg_hex)
            factor = min(2.0, 1.0 + step * 0.005)
            nr = min(255, int(r * factor))
            ng = min(255, int(g * factor))
            nb = min(255, int(b * factor))
            candidate = rgb_to_hex(nr, ng, nb)
            ratio = contrast_ratio(candidate, bg_hex)
            if ratio >= 7.0:
                best = candidate
                break

    return best or "#000000"


def evaluate_pair(name: str, fg: str, bg: str) -> dict:
    """Evaluate a color pair against all WCAG contrast levels."""
    ratio = contrast_ratio(fg, bg)
    result = {
        "name": name,
        "fg": fg,
        "bg": bg,
        "ratio": round(ratio, 2),
        "aa_normal": ratio >= 4.5,
        "aa_large": ratio >= 3.0,
        "aaa_normal": ratio >= 7.0,
        "aaa_large": ratio >= 4.5,
        "ui_component": ratio >= 3.0,
    }
    if not result["aaa_normal"]:
        result["suggestion"] = suggest_aaa_color(fg, bg)
    return result


def print_result(result: dict) -> None:
    """Print formatted result for a single color pair."""
    status_aaa_normal = "PASS" if result["aaa_normal"] else "FAIL"
    status_aaa_large = "PASS" if result["aaa_large"] else "FAIL"
    status_aa_normal = "PASS" if result["aa_normal"] else "FAIL"
    status_ui = "PASS" if result["ui_component"] else "FAIL"

    print(f"\n  {result['name']}")
    print(f"  Foreground: {result['fg']}  Background: {result['bg']}")
    print(f"  Contrast Ratio: {result['ratio']}:1")
    print(f"  -----------------------------------------------")
    print(f"  AAA Normal Text (>=7:1)    : {status_aaa_normal}")
    print(f"  AAA Large Text  (>=4.5:1)  : {status_aaa_large}")
    print(f"  AA Normal Text  (>=4.5:1)  : {status_aa_normal}")
    print(f"  UI Components   (>=3:1)    : {status_ui}")

    if "suggestion" in result:
        suggested_ratio = contrast_ratio(result["suggestion"], result["bg"])
        print(f"  Suggested Fix: {result['suggestion']} ({round(suggested_ratio, 2)}:1)")


def extract_tokens_from_css(filepath: str) -> list[dict]:
    """Extract color token pairs from a CSS custom properties file."""
    with open(filepath, "r") as f:
        content = f.read()

    # Extract all --color-* custom properties
    pattern = r"--(color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})"
    tokens = dict(re.findall(pattern, content))

    if not tokens:
        return []

    # Determine background colors
    bg_colors = {}
    for name, value in tokens.items():
        if "bg" in name and "bg-" not in name:
            bg_colors["default"] = value
        elif name == "color-bg":
            bg_colors["default"] = value
        elif name == "color-bg-alt":
            bg_colors["alt"] = value
        elif name == "color-bg-dark":
            bg_colors["dark"] = value

    if "default" not in bg_colors:
        bg_colors["default"] = "#ffffff"

    # Build pairs: every non-bg color against default bg
    pairs = []
    for name, value in tokens.items():
        if "bg" in name:
            continue
        pairs.append({
            "name": f"--{name} on default bg",
            "fg": value,
            "bg": bg_colors["default"],
        })
        # Also test against alt bg if available
        if "alt" in bg_colors:
            pairs.append({
                "name": f"--{name} on alt bg",
                "fg": value,
                "bg": bg_colors["alt"],
            })

    return pairs


def main():
    args = sys.argv[1:]
    json_output = "--json" in args
    if json_output:
        args.remove("--json")

    if len(args) < 2:
        print("Usage:")
        print("  python3 check_contrast.py <foreground_hex> <background_hex>")
        print('  python3 check_contrast.py --file <colors_json> [--json]')
        print('  python3 check_contrast.py --tokens <tokens_css_file> [--json]')
        sys.exit(2)

    pairs_to_check = []

    if args[0] == "--file":
        filepath = args[1]
        try:
            import os
            if os.path.getsize(filepath) > MAX_FILE_SIZE:
                print(f"Error: File exceeds maximum size of {MAX_FILE_SIZE} bytes.", file=sys.stderr)
                sys.exit(2)
            with open(filepath, "r") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, OSError) as e:
            print(f"Error reading file: {e}", file=sys.stderr)
            sys.exit(2)

        pairs_to_check = data.get("pairs", [])
        if not pairs_to_check:
            print("No color pairs found in file.", file=sys.stderr)
            sys.exit(2)

    elif args[0] == "--tokens":
        filepath = args[1]
        try:
            pairs_to_check = extract_tokens_from_css(filepath)
        except FileNotFoundError:
            print(f"Error: File not found: {filepath}", file=sys.stderr)
            sys.exit(2)

        if not pairs_to_check:
            print("No color tokens found in CSS file.", file=sys.stderr)
            sys.exit(2)

    else:
        fg = args[0]
        bg = args[1]
        pairs_to_check = [{"name": f"{fg} on {bg}", "fg": fg, "bg": bg}]

    # Evaluate all pairs
    results = []
    all_pass = True
    for pair in pairs_to_check:
        try:
            result = evaluate_pair(
                pair.get("name", f"{pair['fg']} on {pair['bg']}"),
                pair["fg"],
                pair["bg"],
            )
            results.append(result)
            if not result["aaa_normal"]:
                all_pass = False
        except ValueError as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(2)

    # Output
    if json_output:
        output = {
            "standard": "WCAG 2.2 AAA",
            "pass": all_pass,
            "total": len(results),
            "failures": sum(1 for r in results if not r["aaa_normal"]),
            "results": results,
        }
        print(json.dumps(output, indent=2))
    else:
        print("=" * 50)
        print("  WCAG 2.2 AAA Contrast Audit")
        print("=" * 50)

        for result in results:
            print_result(result)

        print(f"\n{'=' * 50}")
        total = len(results)
        failures = sum(1 for r in results if not r["aaa_normal"])
        if all_pass:
            print(f"  RESULT: PASS - All {total} pairs meet WCAG AAA.")
        else:
            print(f"  RESULT: FAIL - {failures}/{total} pairs fail WCAG AAA.")
        print(f"{'=' * 50}")

    sys.exit(0 if all_pass else 1)


if __name__ == "__main__":
    main()
