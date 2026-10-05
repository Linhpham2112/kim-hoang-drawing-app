#!/usr/bin/env python3
"""Clean rooster_colored.svg: red → black, pink → gone (paper).

Does not touch rooster_bw.svg.

    python3 scripts/recolor_rooster.py
"""

from __future__ import annotations

import colorsys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLORED = ROOT / "assets/references/rooster_colored.svg"

FILL_RE = re.compile(
    r"(fill:\s*)(#(?:[0-9a-fA-F]{3,8}))",
    flags=re.I,
)


def parse_rgb(hex_color: str) -> tuple[int, int, int] | None:
    s = hex_color.strip().lstrip("#")
    if len(s) == 3:
        s = "".join(c * 2 for c in s)
    if len(s) == 8:
        s = s[:6]
    if len(s) != 6:
        return None
    try:
        return int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16)
    except ValueError:
        return None


def classify(hex_color: str) -> str:
    """keep | black | drop"""
    rgb = parse_rgb(hex_color)
    if rgb is None:
        return "keep"
    r, g, b = (c / 255.0 for c in rgb)
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    hdeg = h * 360

    if v < 0.20:
        return "keep"
    if s < 0.12 and v > 0.82:
        return "keep"
    if 32 <= hdeg <= 82 and s > 0.12:
        return "keep"

    red_hue = hdeg <= 22 or hdeg >= 338
    pink_hue = 280 <= hdeg <= 350 or red_hue

    if 275 <= hdeg <= 345 and s > 0.12 and v > 0.40:
        return "drop"
    if pink_hue and v > 0.70 and s < 0.70:
        return "drop"
    if red_hue and s > 0.22:
        return "black"
    return "keep"


def rewrite_svg(svg: str) -> tuple[str, dict[str, int]]:
    parts = svg.split("<path")
    header = parts[0]
    kept: list[str] = [header]
    stats = {"keep": 0, "black": 0, "drop": 0, "paths": len(parts) - 1}

    def decide(chunk: str) -> str | None:
        m = FILL_RE.search(chunk)
        if not m:
            stats["keep"] += 1
            return "<path" + chunk
        action = classify(m.group(2))
        stats[action] += 1
        if action == "drop":
            return None
        if action == "black":
            chunk = FILL_RE.sub(r"\1#000000", chunk, count=1)
        return "<path" + chunk

    for chunk in parts[1:]:
        out = decide(chunk)
        if out is not None:
            kept.append(out)
    return "".join(kept), stats


def main() -> None:
    raw = COLORED.read_text()
    new, stats = rewrite_svg(raw)
    COLORED.write_text(new)
    print(
        "rooster_colored.svg",
        f"paths {stats['paths']} → {stats['paths'] - stats['drop']}",
        f"red→black {stats['black']}",
        f"pink drop {stats['drop']}",
        f"kept {stats['keep']}",
        f"bytes {len(raw)} → {len(new)}",
    )

    # roosterArt.ts / rooster_bw.svg stay untouched.


if __name__ == "__main__":
    main()
