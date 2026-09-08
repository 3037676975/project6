import fs from 'node:fs/promises';

const root=new URL('../presentations/harness-engineering/',import.meta.url);
const read=p=>fs.readFile(new URL(p,root),'utf8');
const [html,css,js,audioRaw,timingsRaw,acceptance]=await Promise.all([
  read('index.html'),read('chapter1-redesign.css'),read('chapter1-redesign.js'),read('audio-map.json'),read('timings.json'),read('ACCEPTANCE.md')
]);
const audio=JSON.parse(audioRaw),timings=JSON.parse(timingsRaw);
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok,detail});

check('1920x1080 stage',css.includes('width:1920px;height:1080px'));
check('six Garden scenes',(html.match(/data-step="\d+"/g)||[]).length===6);
check('Harness cover title',html.includes('CHAPTER 01 · HARNESS ENGINEERING')&&html.includes('class="cover-main">HARNESS</span>')&&html.includes('class="cover-sub">ENGINEERING</span>'));
check('no Honeys typo in rendered HTML',!(/Honeys/i.test(html)));
check('Harness runtime map',html.includes('Harness Runtime Map')&&html.includes('Context')&&html.includes('Tools')&&html.includes('State')&&html.includes('Recovery'));
check('cool neutral palette v11',css.includes('Chapter1 v11 · Harness cover + cool neutral palette')&&css.includes('--navy:#0d2f2a')&&css.includes('--navy2:#143d36'));
check('dark surfaces are teal green',css.includes('linear-gradient(150deg,#0d2f2a')&&css.includes('.console{background:linear-gradient(150deg,#0c2c27'));
check('center connector refined',css.includes('.arrow-stage:before')&&css.includes('#9bd8cd')&&css.includes('.prompt-orb{background:linear-gradient(145deg,#20b8a6,#0d8f80)'));
check('no emoji in formal chapter',!/🧠|⚙️|💥|✅|📚|🔧|🧭|🛟|🧑‍💻|🏗️|🔎|📝|✨/.test(html+css+js));
check('six distinct visual compositions',['hero-grid','lane bad','workspace','compare-wrap','case-layout','summary'].every(x=>html.includes(x)));
check('local GSAP runtime',html.includes('../../vendor/upstream/gsap/dist/gsap.min.js')&&html.includes('MotionPathPlugin.min.js')&&html.includes('DrawSVGPlugin.min.js'));
check('sentence cue synchronization',js.includes('cueData()')&&js.includes('narration.ontimeupdate')&&js.includes('cues[i].start'));
check('v10+ current-sentence target logic',js.includes('const nextLabel=`cue${idx+1}`')&&js.includes('tl.labels[nextLabel]')&&js.includes('target=tl.labels[nextLabel]!==undefined?nextLabel:tl.duration()'));
check('old one-cue-late tween removed',!js.includes('const label=`cue${idx}`')&&!js.includes('tweenTo(label,{duration:.48'));
check('no beat percentage logic',!js.includes('data-beat')&&!js.includes('currentTime / duration')&&!js.includes('beatThreshold'));
check('auto navigation narration-ended only',js.includes('narration.onended=')&&js.includes("mode==='auto'"));
check('manual controls',html.includes('id="modeManual"')&&html.includes('id="prevBtn"')&&html.includes('id="nextBtn"')&&html.includes('播放当前旁白'));
check('toolbar outside stage',html.indexOf('</main></div><div class="toolbar"')>0);
check('reduced motion',css.includes('prefers-reduced-motion:reduce')&&js.includes('prefers-reduced-motion: reduce'));
check('no transition all',!css.includes('transition:all')&&!css.includes('transition: all'));
check('no scale zero',!css.includes('scale(0)')&&!js.includes('scale:0'));
check('edge-tts Yunxi ready',audio.provider==='edge-tts'&&audio.voice==='zh-CN-YunxiNeural'&&audio.rate==='+0%'&&Object.keys(audio.segments||{}).length===6&&audio.status==='ready');
check('SentenceBoundary ready',timings.boundary==='SentenceBoundary'&&Object.keys(timings.segments||{}).length===6&&Object.values(timings.segments||{}).every(v=>Array.isArray(v.cues)&&v.cues.length));
check('BGM choices + upload',html.includes('轻松科技')&&html.includes('轻松氛围')&&html.includes('轻快神秘')&&html.includes('id="musicUpload"')&&js.includes('URL.createObjectURL'));
check('local browser recording',js.includes('getDisplayMedia')&&js.includes('MediaRecorder')&&js.includes("a.download='project6-harness-chapter1.webm'"));
check('secure context guard',js.includes('window.isSecureContext'));
check('acceptance v11',acceptance.includes('第一章验收标准 v11')&&acceptance.includes('Harness 章节封面')&&acceptance.includes('配色硬规则'));

const pass=checks.every(c=>c.ok);
console.log('\nHarness Chapter 1 Gate v11 — Harness Cover + Cool Palette + Current-Sentence Sync\n');
for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nCODE GATE: ${pass?'PASS':'FAIL'}`);console.log('USER VISUAL/AUDIO REVIEW: REQUIRED');
if(!pass)process.exitCode=1;