import fs from 'node:fs/promises';

const htmlPath='presentations/harness-engineering/index.html';
const cssPath='presentations/harness-engineering/chapter1-redesign.css';

let html=await fs.readFile(htmlPath,'utf8');
let css=await fs.readFile(cssPath,'utf8');

const cover=`<section class="scene s1 active" data-step="0"><div class="topline"><div class="chapter"><i></i>CHAPTER 01 · HARNESS ENGINEERING</div><div class="progress-dots"><span></span><span></span><span></span><span></span><span></span><span></span></div></div><div class="hero-grid"><div class="copy"><div class="question-pill">为什么同一个模型，执行结果差这么多？</div><div class="eyebrow">THE OPERATING LAYER AROUND AI AGENTS</div><h1><span class="cover-main">HARNESS</span><span class="cover-sub">ENGINEERING</span></h1><p>Prompt 决定你怎么交代任务；<strong>Harness 决定 Agent 能不能把任务稳定做完。</strong> 这一章，我们只讲清楚模型外面这套真正决定执行质量的运行系统。</p><div class="cover-proof"><span>Context</span><i></i><span>Tools</span><i></i><span>State</span><i></i><span>Recovery</span></div></div><div class="surface system-card harness-map"><div class="system-head"><div class="system-title"><b>Harness Runtime Map</b><small>一个模型 · 四层执行保障</small></div><span class="status">SYSTEM</span></div><svg class="orbit-svg" viewBox="0 0 640 500" aria-hidden="true"><path class="orbit-line" d="M110 128 C220 70 330 110 320 250"/><path class="orbit-line" d="M530 122 C430 65 335 105 320 250"/><path class="orbit-line" d="M95 385 C205 430 320 370 320 250"/><path class="orbit-line" d="M535 390 C430 440 335 382 320 250"/><circle class="signal-dot" r="7" cx="0" cy="0"/></svg><div class="dark-surface model-core"><span class="chip">AGENT CORE</span><strong>LLM</strong><small>模型负责推理，Harness 负责把推理变成稳定执行。</small></div><div class="sat a"><b>Context</b><small>给模型正确的任务、资料与约束</small></div><div class="sat b"><b>Tools</b><small>把搜索、数据库和 API 接起来</small></div><div class="sat c"><b>State</b><small>让多步任务持续记住执行进度</small></div><div class="sat d"><b>Recovery</b><small>失败后检查、重试并继续执行</small></div></div></div></section>`;

html=html.replace(/<section class="scene s1 active" data-step="0">[\s\S]*?<\/section>/,cover);
html=html.replace(/HONEYS/gi,'HARNESS');
await fs.writeFile(htmlPath,html);

const marker='/* === Project6 Chapter1 v11 · Harness cover + cool neutral palette === */';
const override=`\n${marker}\n:root{--canvas:#f0eee8;--paper:#fcfbf8;--paper2:#f5f7f5;--ink:#142f2a;--ink2:#3f5650;--muted:#74837e;--line:#dde5e1;--line2:#ccd8d2;--mint:#20b8a6;--mint2:#0d8f80;--mintSoft:#e8f7f3;--coral:#e76f73;--coralSoft:#fff1f0;--navy:#0d2f2a;--navy2:#143d36;--shadow:0 22px 70px rgba(20,47,42,.09);--shadowSm:0 10px 30px rgba(20,47,42,.06)}
.stage{background:linear-gradient(180deg,#fdfcf9 0%,#fbfaf7 100%)}
.stage:after{background:radial-gradient(circle,rgba(32,184,166,.10),transparent 68%)}
.dark-surface{background:linear-gradient(150deg,#0d2f2a 0%,#123a34 58%,#18483f 100%);box-shadow:0 26px 74px rgba(13,47,42,.18)}
.s1 .hero-grid{grid-template-columns:1.02fr .98fr;gap:74px;margin-top:66px}
.s1 .copy{padding-left:10px}.s1 .copy .eyebrow{margin-top:24px;color:#0d8f80}.s1 .copy h1{margin:14px 0 0;line-height:.84}.s1 .copy h1 .cover-main{display:block;font-size:116px;letter-spacing:-.075em;font-weight:960;color:#142f2a}.s1 .copy h1 .cover-sub{display:block;margin-top:12px;font:900 29px/1 var(--mono);letter-spacing:.22em;color:#20b8a6}.s1 .copy p{max-width:700px;font-size:27px;line-height:1.62}.s1 .copy p strong{font-weight:900;color:#142f2a}.question-pill{background:#eef7f4;border-color:#d9e9e3;color:#315b52}.cover-proof{margin-top:30px;display:flex;align-items:center;gap:12px;color:#5d706a;font:800 15px var(--mono);letter-spacing:.03em}.cover-proof i{display:block;width:18px;height:1px;background:#b9c8c2}
.system-card.harness-map{min-height:650px;border-color:rgba(20,47,42,.07);background:linear-gradient(160deg,rgba(255,255,255,.97),rgba(239,248,245,.82));box-shadow:0 28px 82px rgba(20,47,42,.10)}
.system-card.harness-map:before{background:radial-gradient(circle at 50% 48%,rgba(32,184,166,.12),transparent 33%),linear-gradient(135deg,rgba(255,255,255,.88),rgba(239,248,245,.58))}.system-card .model-core{background:linear-gradient(145deg,#0d2f2a,#17483f);border:1px solid rgba(255,255,255,.08)}.model-core .chip{color:#83d8ca}.model-core small{color:#c8ded8}.sat{border-color:#dce7e2;background:rgba(255,255,255,.96)}.orbit-line{stroke:rgba(32,184,166,.32)}.orbit-line.bad{stroke:rgba(32,184,166,.32)}
.vs-badge{background:#163c35;box-shadow:0 14px 34px rgba(13,47,42,.16)}
.console{background:linear-gradient(150deg,#0c2c27,#113b34 62%,#16473e)}.runtime{background:rgba(2,20,17,.44)}.runtime-card{background:rgba(255,255,255,.065);border-color:rgba(255,255,255,.10)}.runtime-card small{color:#bfd8d1}.lights i{background:#4f756b}.control-bottom{background:linear-gradient(135deg,#10362f,#174a40)}
.arrow-stage:before{content:"";position:absolute;left:50%;top:86px;bottom:86px;width:1px;background:linear-gradient(to bottom,transparent,#9bd8cd 20%,#9bd8cd 80%,transparent);transform:translateX(-50%);opacity:.65}.prompt-orb{background:linear-gradient(145deg,#20b8a6,#0d8f80);box-shadow:0 14px 34px rgba(13,143,128,.22)}
.toolbar{border-color:rgba(20,47,42,.09);box-shadow:0 12px 36px rgba(20,47,42,.09)}
`;
css=css.replace(/\/\* === Project6 Chapter1 v11 · Harness cover \+ cool neutral palette === \*\/[\s\S]*$/,'').trimEnd()+override;
await fs.writeFile(cssPath,css);
console.log('Applied Chapter1 v11 Harness cover and palette.');
