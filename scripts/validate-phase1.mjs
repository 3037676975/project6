import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chapters, totalSteps } from '../presentations/rag-intro/src/chapters/chapters.js';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const presentationRoot = path.join(repoRoot, 'presentations/rag-intro');
const allowAudioPending = process.argv.includes('--allow-audio-pending');

const checks = [];
const pass = (name, evidence = '') => checks.push({ ok: true, name, evidence });
const fail = (name, evidence = '') => checks.push({ ok: false, name, evidence });

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(repoRoot, relativePath), 'utf8'));
}

async function readText(relativePath) {
  return fs.readFile(path.join(repoRoot, relativePath), 'utf8');
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

async function main() {
  const manifest = await readJson('presentations/rag-intro/manifest.json');
  const audioMap = await readJson('presentations/rag-intro/audio-map.json');
  const script = await readText('presentations/rag-intro/script.md');
  const outline = await readText('presentations/rag-intro/outline.md');
  const page = await readText('presentations/rag-intro/index.html');

  manifest.theme === 'blueprint' ? pass('Theme = blueprint') : fail('Theme = blueprint', manifest.theme);
  manifest.voice === 'zh-TW-YunJheNeural' ? pass('ETG1 voice ID 正确') : fail('ETG1 voice ID 正确', manifest.voice);
  manifest.engine === 'edge' ? pass('TTS engine = edge') : fail('TTS engine = edge', manifest.engine);
  manifest.chapters === chapters.length ? pass('manifest chapter 数匹配', String(chapters.length)) : fail('manifest chapter 数匹配', `${manifest.chapters} != ${chapters.length}`);
  manifest.steps === totalSteps ? pass('manifest step 数匹配', String(totalSteps)) : fail('manifest step 数匹配', `${manifest.steps} != ${totalSteps}`);

  const beats = script.split(/\n\s*---\s*\n/g).map((item) => item.trim()).filter(Boolean);
  beats.length === totalSteps ? pass('script 节拍数 = narration step 数', String(beats.length)) : fail('script 节拍数 = narration step 数', `${beats.length} != ${totalSteps}`);

  const narrationTexts = chapters.flatMap((chapter) => chapter.narrations);
  const sameText = beats.every((beat, index) => beat.replace(/\s+/g, '') === narrationTexts[index].replace(/\s+/g, ''));
  sameText ? pass('script 与 narrations 语义源一致') : fail('script 与 narrations 语义源一致', '存在文本漂移');

  for (const chapter of chapters) {
    if (chapter.narrations.length < 3 || chapter.narrations.length > 8) {
      fail(`${chapter.id} step 数在 3~8 范围`, String(chapter.narrations.length));
    } else {
      pass(`${chapter.id} step 数在 3~8 范围`, String(chapter.narrations.length));
    }
    for (let i = 0; i < chapter.narrations.length; i += 1) {
      const html = chapter.render(i);
      html.includes('class="scene ') ? pass(`${chapter.id}/${i + 1} 可渲染`) : fail(`${chapter.id}/${i + 1} 可渲染`, '缺少 scene 根节点');
      chapter.narrations[i].trim() ? pass(`${chapter.id}/${i + 1} narration 非空`) : fail(`${chapter.id}/${i + 1} narration 非空`);
    }
  }

  /1920/.test(page) || /stage-frame/.test(page) ? pass('16:9 固定舞台入口存在') : fail('16:9 固定舞台入口存在');
  outline.includes('2 章 / 10 步') ? pass('outline 章 / Step 记录已同步') : fail('outline 章 / Step 记录已同步');

  const expectedKeys = chapters.flatMap((chapter) => chapter.narrations.map((_, index) => `${chapter.id}/${index + 1}`));
  const readyKeys = Object.keys(audioMap.segments || {}).filter((key) => audioMap.segments[key]);
  if (audioMap.status === 'ready' && expectedKeys.every((key) => audioMap.segments?.[key])) {
    pass('Project5 ETG1 音频 10/10 ready', `${readyKeys.length}/${expectedKeys.length}`);
  } else if (allowAudioPending) {
    pass('Project5 ETG1 音频允许 pending（视觉阶段）', `${readyKeys.length}/${expectedKeys.length}`);
  } else {
    fail('Project5 ETG1 音频 10/10 ready', `${readyKeys.length}/${expectedKeys.length}, status=${audioMap.status}`);
  }

  const files = await walk(repoRoot);
  let leaked = [];
  for (const file of files) {
    if (!/\.(?:js|mjs|json|md|html|css|sh|env|txt)$/i.test(file)) continue;
    const text = await fs.readFile(file, 'utf8').catch(() => '');
    if (/sk-kokoro-[A-Za-z0-9_-]{8,}/.test(text)) leaked.push(path.relative(repoRoot, file));
  }
  leaked.length === 0 ? pass('公开仓库未发现 Project5 明文 API Key') : fail('公开仓库未发现 Project5 明文 API Key', leaked.join(', '));

  console.log('\nProject6 · Phase 1 validation\n');
  for (const item of checks) {
    console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${item.evidence ? ` · ${item.evidence}` : ''}`);
  }

  const failures = checks.filter((item) => !item.ok);
  console.log(`\nResult: ${failures.length ? 'FAIL' : 'PASS'} · ${checks.length - failures.length}/${checks.length} checks passed`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Phase 1 validator crashed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
