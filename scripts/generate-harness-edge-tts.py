#!/usr/bin/env python3
"""Generate Harness chapter narration and timing metadata with rany2/edge-tts.

Source of truth: presentations/harness-engineering/narrations.json
The selected voice/rate are read from that file so future voice selection does not
require changing the generator itself. No Project5 and no API key are used.

Besides MP3, this generator stores sentence-boundary timing metadata and SRT files.
The SRT is NOT rendered as visible subtitles in the presentation; it is a hidden
animation timing source for GSAP so visual cues can start when the spoken sentence
actually begins.
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
TIMING_DIR = PRESENTATION / "public" / "timing" / "01-harness-engineering"
AUDIO_MAP = PRESENTATION / "audio-map.json"
TIMINGS = PRESENTATION / "timings.json"
TICKS_PER_SECOND = 10_000_000


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
    TIMING_DIR.mkdir(parents=True, exist_ok=True)
    segments: dict[str, str] = {}
    timing_segments: dict[str, dict] = {}

    for index, text in enumerate(steps, start=1):
        output = AUDIO_DIR / f"{index}.mp3"
        srt_output = TIMING_DIR / f"{index}.srt"
        print(f"[{index}/{len(steps)}] {voice} {rate} -> {output.relative_to(ROOT)}")

        communicator = edge_tts.Communicate(
            text=text,
            voice=voice,
            rate=rate,
            volume=volume,
            pitch=pitch,
            boundary="SentenceBoundary",
        )
        submaker = edge_tts.SubMaker()
        cues: list[dict] = []

        with output.open("wb") as audio_file:
            async for chunk in communicator.stream():
                if chunk["type"] == "audio":
                    audio_file.write(chunk["data"])
                elif chunk["type"] == "SentenceBoundary":
                    submaker.feed(chunk)
                    cues.append(
                        {
                            "start": round(float(chunk["offset"]) / TICKS_PER_SECOND, 4),
                            "duration": round(float(chunk["duration"]) / TICKS_PER_SECOND, 4),
                            "end": round(
                                (float(chunk["offset"]) + float(chunk["duration"]))
                                / TICKS_PER_SECOND,
                                4,
                            ),
                            "text": chunk.get("text", ""),
                        }
                    )

        srt_output.write_text(submaker.get_srt(), encoding="utf-8")
        key = f"01-harness-engineering/{index}"
        segments[key] = f"./public/audio/01-harness-engineering/{index}.mp3"
        timing_segments[key] = {
            "srt": f"./public/timing/01-harness-engineering/{index}.srt",
            "cues": cues,
        }

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

    timing_result = {
        "provider": "edge-tts",
        "boundary": "SentenceBoundary",
        "voice": voice,
        "rate": rate,
        "segments": timing_segments,
    }
    TIMINGS.write_text(
        json.dumps(timing_result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print("audio-map.json + timings.json ready")


if __name__ == "__main__":
    asyncio.run(main())
