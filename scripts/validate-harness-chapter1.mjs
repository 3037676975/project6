import fs from 'node:fs/promises';

const root=new URL('../presentations/harness-engineering/',import.meta.url);
const read=p=>fs.readFile(new URL(p,root),'utf8');
const [html,css,js,audioRaw,timingsRaw,acceptance]=await Promise.all([
  read('index.html'),read('chapter1-redesign.css'),read('chapter1-redesign.js'),read('audio-map.json'),read('timings.json'),read('ACCEPTANCE.md')
]);
const audio=JSON.parse(audioRaw),timings=JSON.parse(timingsRaw);
const checks=[];const check=(name,ok)=>checks.push({name,ok});

check('1920x1080 stage',css.includes('width:1920px;height:1080px'));
check('six Garden scenes',(html.match(/data-step="\d+"/g)||[]).length===6);
check('Harness cover title',html.includes('CHAPTER 01 · HARNESS ENGINEERING')&&html.includes('class="cover-main">HARNESS</span>'));
check('no Honeys typo',!(/Honeys/i.test(html+js)));
check('v13 cache bust',html.includes('chapter1-redesign.css?v=13')&&html.includes('chapter1-redesign.js?v=13'));
check('Open Color + Radix palette marker',css.includes('Chapter1 v13 · Open Color + Radix Mint/Sky'));
check('light blue + mint palette',css.includes('--sky:#4dabf7')&&css.includes('--sky2:#1c7ed6')&&css.includes('--mint:#38d9a9')&&css.includes('--mintSoft:#e6fcf5'));
check('neutral text palette',css.includes('--ink:#212529')&&css.includes('--ink2:#495057'));
check('no dark green console in v13 override',css.includes('.console{background:linear-gradient(145deg,#f1f9ff 0%,#eefcf8 100%)'));
check('light control plane footer',css.includes('.control-bottom{background:linear-gradient(100deg,#e7f5ff,#e6fcf5)'));
check('font family unified',css.includes('--font:"Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif'));
check('scene2 semantic bad items',js.includes("const badItems=[...s.querySelectorAll('.lane.bad .stack-item')]")&&js.includes('badItems[0]')&&js.includes('badItems[1]')&&js.includes('badItems[2]'));
check('scene2 stable delayed to cue3',js.includes(".addLabel('cue3')\n        .to(s.querySelector('.lane.good')"));
check('scene3 grouped semantic build',js.includes("const resources=[...s.querySelectorAll('.resource')]")&&js.includes('resources[0]')&&js.includes('resources[1]')&&js.includes('resources[2]')&&js.includes('resources[3]'));
check('scene3 Harness Core last',js.includes(".addLabel('cue2')\n        .to(s.querySelector('.core-ring')"));
check('local GSAP runtime',html.includes('../../vendor/upstream/gsap/dist/gsap.min.js'));
check('sentence cue synchronization',js.includes('narration.ontimeupdate')&&js.includes('cues[i].start'));
check('current sentence target logic',js.includes('const nextLabel=`cue${idx+1}`')&&js.includes('tl.labels[nextLabel]'));
check('auto navigation narration-ended only',js.includes('narration.onended=')&&js.includes("mode==='auto'"));
check('manual controls',html.includes('id="modeManual"')&&html.includes('id="prevBtn"')&&html.includes('id="nextBtn"'));
check('toolbar outside stage',html.indexOf('</main></div><div class="toolbar"')>0);
check('reduced motion',css.includes('prefers-reduced-motion:reduce')&&js.includes('prefers-reduced-motion: reduce'));
check('no transition all',!css.includes('transition:all')&&!css.includes('transition: all'));
check('no scale zero',!css.includes('scale(0)')&&!js.includes('scale:0'));
check('edge-tts Yunxi ready',audio.provider==='edge-tts'&&audio.voice==='zh-CN-YunxiNeural'&&audio.status==='ready');
check('SentenceBoundary ready',timings.boundary==='SentenceBoundary'&&Object.keys(timings.segments||{}).length===6);
check('BGM + local upload',html.includes('id="musicUpload"')&&js.includes('URL.createObjectURL'));
check('local browser recording',js.includes('getDisplayMedia')&&js.includes('MediaRecorder'));
check('acceptance v13',acceptance.includes('第一章验收标准 v13')&&acceptance.includes('Open Color')&&acceptance.includes('Radix'));

const pass=checks.every(c=>c.ok);
console.log('\nHarness Chapter 1 Gate v13 — Light Mint + Sky Blue + Semantic Motion\n');
for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}`);
console.log(`\nCODE GATE: ${pass?'PASS':'FAIL'}`);
console.log('USER VISUAL/AUDIO REVIEW: REQUIRED');
if(!pass)process.exitCode=1;
