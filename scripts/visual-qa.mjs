import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.P6_QA_URL || 'http://127.0.0.1:4173/presentations/harness-engineering/full-video.html?v=41';
const outDir = path.resolve('qa/screenshots');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on('pageerror', e => consoleErrors.push(String(e)));
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#stage');
await page.waitForSelector('#sceneRoot .scene');

const report = { url: BASE, generated_at: new Date().toISOString(), scenes: [], console_errors: consoleErrors };

for (let i = 0; i < 42; i++) {
  await page.evaluate(index => {
    const scrub = document.getElementById('scrub');
    scrub.value = String(index);
    scrub.dispatchEvent(new Event('input', { bubbles: true }));
  }, i);

  // Capture a settled frame: enough time for the semantic construction animation to become readable.
  await page.waitForTimeout(2300);
  const id = String(i + 1).padStart(3, '0');
  const shot = path.join(outDir, `scene-${id}.png`);
  await page.locator('#stage').screenshot({ path: shot });

  const audit = await page.evaluate(() => {
    const stage = document.getElementById('stage');
    const sr = stage.getBoundingClientRect();
    const badOverflow = [];
    const tinyText = [];
    const selectors = ['h1','h2','h3','p','b','small','span','.node','.label','.spec','.example','.answer-ray','.tree-line','.log-step'];
    const els = [...new Set(selectors.flatMap(s => [...stage.querySelectorAll(s)]))];
    for (const el of els) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0 || !r.width || !r.height) continue;
      const text = (el.textContent || '').trim().replace(/\s+/g,' ').slice(0,120);
      if (!text) continue;
      const intentional = el.closest('.hud') || el.classList.contains('micro') || el.classList.contains('count') || el.classList.contains('chapter');
      const size = parseFloat(cs.fontSize || '0');
      if (!intentional && size && size < 17) tinyText.push({ text, size: Math.round(size * 10) / 10, cls: el.className || el.tagName });
      const pad = 3;
      if (r.left < sr.left - pad || r.top < sr.top - pad || r.right > sr.right + pad || r.bottom > sr.bottom + pad) {
        // Ignore SVG paths and intentionally clipped ambient decoration; report readable DOM only.
        if (!el.closest('svg') && !el.matches('.orbit-copy')) badOverflow.push({ text, rect: [Math.round(r.left-sr.left),Math.round(r.top-sr.top),Math.round(r.width),Math.round(r.height)], cls: el.className || el.tagName });
      }
    }
    const scene = stage.querySelector('#sceneRoot .scene');
    return { sceneClass: scene?.className || '', tinyText, overflow: badOverflow, visibleTextChars: (scene?.innerText || '').trim().length };
  });

  report.scenes.push({ id, screenshot: `qa/screenshots/scene-${id}.png`, ...audit });
}

await browser.close();
await fs.mkdir('qa', { recursive: true });
await fs.writeFile('qa/visual-report.json', JSON.stringify(report, null, 2));

const tinyCount = report.scenes.reduce((n,s)=>n+s.tinyText.length,0);
const overflowCount = report.scenes.reduce((n,s)=>n+s.overflow.length,0);
console.log(`Project6 Visual QA: 42/42 screenshots generated. tiny=${tinyCount}, overflow=${overflowCount}, consoleErrors=${consoleErrors.length}`);
if (consoleErrors.length) process.exitCode = 1;
