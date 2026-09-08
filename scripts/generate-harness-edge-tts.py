#!/usr/bin/env python3
"""Generate Harness chapter narration directly with rany2/edge-tts.

Source of truth: presentations/harness-engineering/narrations.json
The selected voice/rate are read from that file so future voice selection does not
require changing the generator itself. No Project5 and no API key are used.
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


async def main() -> None:
    payload = json.loads(NARRATIONS.read_text(encoding="utf-8"))
    voice_cfg = payload.get("voice", {})
    voice = voice_cfg.get("voice", "zh-CN-YunxiNeural")
    locale = voice_cfg.get("locale", "zh-CN")
    rate = voice_cfg.get("rate", "+0%")
    speed = voice_cfg.get("speed", 1.0)
    volume = voice_cfg.get("volume", "+0%")
    pitch = voice_cfg.get("pitch", "+0Hz")
    steps = payload.get("steps", [])
    if not steps:
        raise SystemExit("narrations.json has no steps")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    segments: dict[str, str] = {}
    for index, text in enumerate(steps, start=1):
        output = AUDIO_DIR / f"{index}.mp3"
        print(f"[{index}/{len(steps)}] {voice} {rate} -> {output.relative_to(ROOT)}")
        communicator = edge_tts.Communicate(
            text=text,
            voice=voice,
            rate=rate,
            volume=volume,
            pitch=pitch,
        )
        await communicator.save(str(output))
        segments[f"01-harness-engineering/{index}"] = f"./public/audio/01-harness-engineering/{index}.mp3"

    result = {
        "provider": "edge-tts",
        "client": "rany2/edge-tts",
        "voice": voice,
        "locale": locale,
        "rate": rate,
        "speed": speed,
        "status": "ready",
        "segments": segments,
    }
    AUDIO_MAP.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("audio-map.json ready")


if __name__ == "__main__":
    asyncio.run(main())
