#!/usr/bin/env python3
"""Generate Harness Engineering chapter 1 narration with edge-tts.

Source of truth: presentations/harness-engineering/narrations.json
Voice: zh-TW-YunJheNeural (YunJhe, Taiwanese Mandarin male)
Rate: +0% (1.0x)

No Project5 and no API key are used.
"""
from __future__ import annotations

import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
PRESENTATION = ROOT / "presentations" / "harness-engineering"
NARRATIONS = PRESENTATION / "narrations.json"
AUDIO_DIR = PRESENTATION / "public" / "audio" / "01-harness-engineering"
AUDIO_MAP = PRESENTATION / "audio-map.json"
VOICE = "zh-TW-YunJheNeural"
RATE = "+0%"
VOLUME = "+0%"
PITCH = "+0Hz"


async def synthesize_one(text: str, output: Path) -> None:
    communicator = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        volume=VOLUME,
        pitch=PITCH,
    )
    await communicator.save(str(output))


async def main() -> None:
    payload = json.loads(NARRATIONS.read_text(encoding="utf-8"))
    steps = payload.get("steps", [])
    if not steps:
        raise SystemExit("narrations.json has no steps")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    segments: dict[str, str] = {}

    for index, text in enumerate(steps, start=1):
        output = AUDIO_DIR / f"{index}.mp3"
        print(f"[{index}/{len(steps)}] {VOICE} {RATE} -> {output.relative_to(ROOT)}")
        await synthesize_one(text, output)
        segments[f"01-harness-engineering/{index}"] = f"./public/audio/01-harness-engineering/{index}.mp3"

    result = {
        "provider": "edge-tts",
        "client": "rany2/edge-tts",
        "voice": VOICE,
        "locale": "zh-TW",
        "rate": RATE,
        "speed": 1.0,
        "status": "ready",
        "segments": segments,
    }
    AUDIO_MAP.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("audio-map.json ready")


if __name__ == "__main__":
    asyncio.run(main())
