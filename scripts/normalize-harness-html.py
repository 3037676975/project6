#!/usr/bin/env python3
"""Normalize static Harness HTML after large authored updates.

This small guard prevents JavaScript template expressions from accidentally being
left as literal HTML in the committed static presentation. It is intentionally
narrow and idempotent.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "presentations" / "harness-engineering" / "index.html"
text = HTML.read_text(encoding="utf-8")

company_markup = "".join(
    f'<div class="company"><span>{i:02d}</span></div>' for i in range(1, 11)
)
pattern = re.compile(
    r"\$\{Array\.from\(\{length:10\}.*?\.join\(''\)\}",
    re.DOTALL,
)
text, count = pattern.subn(company_markup, text)

if "${Array.from" in text or "${String(i+1)" in text:
    raise SystemExit("template literal artifact still present")

HTML.write_text(text, encoding="utf-8")
print(f"Harness HTML normalized; replacements={count}")
