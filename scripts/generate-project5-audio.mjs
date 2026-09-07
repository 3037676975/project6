import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chapters } from '../presentations/rag-intro/src/chapters/chapters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'presentations/rag-intro/audio-map.json');

const BASE_URL = (process.env.PROJECT5_BASE_URL || 'http://186.244.245.177:28442').replace(/\/$/, '');
const API_KEY = process.env.PROJECT5_API_KEY;
const ENGINE = process.env.PROJECT5_ENGINE || 'edge';
const VOICE = process.env.PROJECT5_VOICE || 'zh-TW-YunJheNeural';
const SPEED = Number(process.env.PROJECT5_SPEED || '1.10');
const POLL_MS = Number(process.env.PROJECT5_POLL_MS || '1000');
const TIMEOUT_MS = Number(process.env.PROJECT5_TIMEOUT_MS || '180000');
const DRY_RUN = process.argv.includes('--dry-run');

const segments = chapters.flatMap((chapter) =>
  chapter.narrations.map((text, index) => ({
    key: `${chapter.id}/${index + 1}`,
    chapter: chapter.id,
    step: index + 1,
    text
  }))
);

function requireConfig() {
  if (DRY_RUN) return;
  if (!API_KEY) {
    throw new Error('缺少 PROJECT5_API_KEY。请只通过服务端环境变量提供，不要写入 GitHub 或浏览器前端。');
  }
  if (!Number.isFinite(SPEED) || SPEED <= 0) {
    throw new Error('PROJECT5_SPEED 必须是大于 0 的数字。');
  }
}

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${API_KEY}`
      }
    });
    const text = await response.text();
    let body = {};
    if (text) {
      try { body = JSON.parse(text); } catch { body = { raw: text }; }
    }
    if (!response.ok) {
      throw new Error(`Project5 HTTP ${response.status}: ${body.detail || body.error || text || 'unknown error'}`);
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

async function submitSegment(segment) {
  return requestJson(`${BASE_URL}/v1/audio/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: segment.text,
      engine: ENGINE,
      voice: VOICE,
      speed: SPEED
    })
  });
}

async function pollTask(taskId) {
  const started = Date.now();
  while (Date.now() - started < TIMEOUT_MS) {
    const task = await requestJson(`${BASE_URL}/v1/tasks/${encodeURIComponent(taskId)}`);
    if (task.status === 'completed') {
      if (!task.audio_url) throw new Error(`任务 ${taskId} completed 但没有 audio_url`);
      return task;
    }
    if (task.status === 'failed') {
      throw new Error(`任务 ${taskId} failed: ${task.error || 'unknown error'}`);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  throw new Error(`任务 ${taskId} 超过 ${TIMEOUT_MS}ms 仍未完成`);
}

async function writeMap({ status, urls, errors = [] }) {
  const payload = {
    provider: 'project5',
    baseUrl: BASE_URL,
    engine: ENGINE,
    voice: VOICE,
    speed: SPEED,
    status,
    generatedAt: status === 'ready' ? new Date().toISOString() : null,
    segments: urls,
    ...(errors.length ? { errors } : {})
  };
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  requireConfig();

  if (DRY_RUN) {
    console.log(`[Project6] dry-run: ${segments.length} narration segments`);
    for (const item of segments) console.log(`- ${item.key}: ${item.text.length} chars`);
    return;
  }

  const urls = {};
  const errors = [];

  console.log(`[Project6] Project5 audio generation: ${segments.length} segments`);
  console.log(`[Project6] engine=${ENGINE} voice=${VOICE} speed=${SPEED}`);

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    process.stdout.write(`[${index + 1}/${segments.length}] ${segment.key} ... `);
    try {
      const accepted = await submitSegment(segment);
      const taskId = accepted.id || accepted.task_id;
      if (!taskId) throw new Error('Project5 未返回任务 id');
      const completed = await pollTask(taskId);
      urls[segment.key] = completed.audio_url;
      console.log('OK');
    } catch (error) {
      errors.push({ key: segment.key, error: error.message });
      console.log(`FAIL: ${error.message}`);
      await writeMap({ status: 'partial', urls, errors });
      throw error;
    }
  }

  await writeMap({ status: 'ready', urls });
  console.log(`[Project6] audio-map.json 已更新，共 ${Object.keys(urls).length} 段。`);
}

main().catch((error) => {
  console.error(`[Project6] TTS generation failed: ${error.message}`);
  process.exitCode = 1;
});
