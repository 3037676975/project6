#!/usr/bin/env python3
"""Normalize authored static HTML after large generated edits.

This guard prevents JavaScript template expressions from accidentally being left
as literal HTML in committed static pages and keeps required local runtime assets
wired into the Harness presentation. It is intentionally narrow and idempotent.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def normalize_harness() -> int:
    path = ROOT / "presentations" / "harness-engineering" / "index.html"
    text = path.read_text(encoding="utf-8")
    company_markup = "".join(
        f'<div class="company"><span>{i:02d}</span></div>' for i in range(1, 11)
    )
    pattern = re.compile(
        r"\$\{Array\.from\(\{length:10\}.*?\.join\(''\)\}",
        re.DOTALL,
    )
    text, count = pattern.subn(company_markup, text)
    if "${Array.from" in text or "${String(i+1)" in text:
        raise SystemExit("Harness template literal artifact still present")

    css_tags = [
        '<link rel="stylesheet" href="./continuous-motion.css">',
        '<link rel="stylesheet" href="./galaxy-layer.css">',
    ]
    js_tag = '<script src="./continuous-motion.js"></script>'
    for tag in css_tags:
        if tag not in text:
            text = text.replace('</head>', f'{tag}\n</head>', 1)
            count += 1
    if js_tag not in text:
        text = text.replace('</body>', f'{js_tag}\n</body>', 1)
        count += 1

    path.write_text(text, encoding="utf-8")
    return count


def normalize_motion_library() -> int:
    path = ROOT / "motions.html"
    text = path.read_text(encoding="utf-8")
    state_markup = "".join(
        f'<div class="state-cell"><span>{i:02d}</span></div>' for i in range(1, 11)
    )
    pattern = re.compile(
        r"\$\{\[1,2,3,4,5,6,7,8,9,10\]\.map\(n=>`<div class=\"state-cell\"><span>\$\{String\(n\)\.padStart\(2,'0'\)\}</span></div>`\)\.join\(''\)\}",
        re.DOTALL,
    )
    text, count = pattern.subn(state_markup, text)
    if "${[1,2,3,4,5,6,7,8,9,10]" in text or "${String(n)" in text:
        raise SystemExit("Motion library template literal artifact still present")
    path.write_text(text, encoding="utf-8")
    return count


harness_count = normalize_harness()
motion_count = normalize_motion_library()
print(f"Static HTML normalized; harness={harness_count}, motions={motion_count}")
