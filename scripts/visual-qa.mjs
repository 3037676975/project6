import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.P6_QA_URL || 'http://127.0.0.1:4173/presentations/harness-engineering/full-video.html?v=42';
const outDir = path.resolve('qa/screenshots');
const responsiveDir = path.resolve('qa/responsive');
await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(responsiveDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on('pageerror', e => consoleErrors.push(String(e)));
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#stage');
await page.waitForSelector('#sceneRoot .scene');

const report = { url: BASE, generated_at: new Date().toISOString(), scenes: [], responsive: [], console_errors: consoleErrors };

async function gotoScene(index){
  await page.evaluate(index => {
    const scrub = document.getElementById('scrub');
    scrub.value = String(index);
    scrub.dispatchEvent(new Event('input', { bubbles: true }));
  }, index);
}

async function auditScene(){
  return page.evaluate(() => {
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
      const logicalSize = parseFloat(cs.fontSize || '0');
      if (!intentional && logicalSize && logicalSize < 17) tinyText.push({ text, size: Math.round(logicalSize * 10) / 10, cls: el.className || el.tagName });
      const pad = 3;
      if (r.left < sr.left - pad || r.top < sr.top - pad || r.right > sr.right + pad || r.bottom > sr.bottom + pad) {
        if (!el.closest('svg') && !el.matches('.orbit-copy')) badOverflow.push({ text, rect: [Math.round(r.left-sr.left),Math.round(r.top-sr.top),Math.round(r.width),Math.round(r.height)], cls: el.className || el.tagName });
      }
    }
    const scene = stage.querySelector('#sceneRoot .scene');
    return { sceneClass: scene?.className || '', tinyText, overflow: badOverflow, visibleTextChars: (scene?.innerText || '').trim().length };
  });
}

for (let i = 0; i < 42; i++) {
  await gotoScene(i);
  await page.waitForTimeout(2300);
  const id = String(i + 1).padStart(3, '0');
  const shot = path.join(outDir, `scene-${id}.png`);
  await page.locator('#stage').screenshot({ path: shot });
  report.scenes.push({ id, screenshot: `qa/screenshots/scene-${id}.png`, ...(await auditScene()) });
}

/* Responsive/zoom QA: this is where the previous transform-only bug was visible.
 * Check several real window sizes and representative dense scenes. The stage's painted
 * box must stay 16:9, stay inside viewer, and the layout footprint must match it.
 */
const responsiveViewports = [
  { name:'1366x768', width:1366, height:768 },
  { name:'1440x900', width:1440, height:900 },
  { name:'1280x720', width:1280, height:720 }
];
const representativeScenes = [0, 8, 24, 35, 41]; // 001,009,025,036,042

for (const vp of responsiveViewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(120);
  for (const index of representativeScenes) {
    await gotoScene(index);
    await page.waitForTimeout(450);
    const id = String(index + 1).padStart(3, '0');
    const metrics = await page.evaluate(() => {
      const stage = document.getElementById('stage');
      const frame = document.querySelector('.stage-frame');
      const viewer = document.querySelector('.viewer');
      const sr = stage.getBoundingClientRect();
      const fr = frame?.getBoundingClientRect();
      const vr = viewer?.getBoundingClientRect();
      const ratio = sr.width / sr.height;
      const ratioError = Math.abs(ratio - (16/9));
      const frameMatches = !!fr && Math.abs(fr.width - sr.width) < 1.5 && Math.abs(fr.height - sr.height) < 1.5;
      const insideViewer = !!vr && sr.left >= vr.left - 1 && sr.top >= vr.top - 1 && sr.right <= vr.right + 1 && sr.bottom <= vr.bottom + 1;
      return {
        stage:[Math.round(sr.width*10)/10,Math.round(sr.height*10)/10],
        frame:fr ? [Math.round(fr.width*10)/10,Math.round(fr.height*10)/10] : null,
        ratio:Math.round(ratio*10000)/10000,
        ratioError,
        frameMatches,
        insideViewer,
        scale:stage.dataset.scale || ''
      };
    });
    const screenshot = `qa/responsive/${vp.name}-scene-${id}.png`;
    await page.locator('.viewer').screenshot({ path:path.resolve(screenshot) });
    report.responsive.push({ viewport:vp.name, id, screenshot, ...metrics });
  }
}

await browser.close();
await fs.mkdir('qa', { recursive: true });
await fs.writeFile('qa/visual-report.json', JSON.stringify(report, null, 2));

const tinyCount = report.scenes.reduce((n,s)=>n+s.tinyText.length,0);
const overflowCount = report.scenes.reduce((n,s)=>n+s.overflow.length,0);
const responsiveFails = report.responsive.filter(x => x.ratioError > .002 || !x.frameMatches || !x.insideViewer);
console.log(`Project6 Visual QA: 42/42 screenshots generated. tiny=${tinyCount}, overflow=${overflowCount}, responsiveFails=${responsiveFails.length}, consoleErrors=${consoleErrors.length}`);
if (consoleErrors.length || responsiveFails.length) process.exitCode = 1;
