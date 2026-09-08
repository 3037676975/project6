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
check('new visual system wired',html.includes('./chapter1-redesign.css')&&html.includes('./chapter1-redesign.js'));
check('old patch layers removed',!html.includes('continuous-motion.css')&&!html.includes('galaxy-layer.css')&&!html.includes('continuous-motion.js'));
check('no emoji in formal chapter',!/🧠|⚙️|💥|✅|📚|🔧|🧭|🛟|🧑‍💻|🏗️|🔎|📝|✨/.test(html+css+js));
check('Honeys brand cover installed',js.includes('installHoneysCover')&&js.includes('Honeys')&&js.includes('CHAPTER 01 · HARNESS ENGINEERING')&&js.includes('让 Agent 真正把事做完的'));
check('cover explains same-model different-outcome',js.includes('SAME MODEL')&&js.includes('UNSTABLE')&&js.includes('STABLE')&&js.includes('cover-answer'));
check('cloud hierarchy primitives',css.includes('.surface')&&css.includes('.dark-surface')&&css.includes('.status')&&css.includes('.iconbox'));
check('six distinct visual compositions',['hero-grid','lane bad','workspace','compare-wrap','case-layout','summary'].every(x=>html.includes(x)));
check('status semantics',css.includes('--mint:')&&css.includes('--coral:')&&html.includes('UNSTABLE')&&html.includes('STABLE'));
check('readable typography',css.includes('font-size:66px')&&css.includes('font-size:26px')&&css.includes('font-size:15px'));
check('local GSAP runtime',html.includes('../../vendor/upstream/gsap/dist/gsap.min.js')&&html.includes('MotionPathPlugin.min.js')&&html.includes('DrawSVGPlugin.min.js'));
check('GSAP scene timelines',[0,1,2,3,4,5].every(i=>js.includes(`if(i===${i})`)));
check('sentence cue synchronization',js.includes('cueData()')&&js.includes('narration.ontimeupdate')&&js.includes('cues[i].start'));
check('v10 current-sentence target logic',js.includes('const nextLabel=`cue${idx+1}`')&&js.includes('tl.labels[nextLabel]')&&js.includes('target=tl.labels[nextLabel]!==undefined?nextLabel:tl.duration()'));
check('old one-cue-late tween removed',!js.includes('const label=`cue${idx}`')&&!js.includes('tweenTo(label,{duration:.48'));
check('cue sync duration bounded',js.includes('Math.max(.5,Math.min(1.35')&&js.includes('cues[i].start-.08'));
check('no beat percentage logic',!js.includes('data-beat')&&!js.includes('currentTime / duration')&&!js.includes('beatThreshold'));
check('timeline never navigates step',!js.includes('onComplete:()=>showScene')&&!js.includes('onComplete: () => showScene'));
check('auto navigation narration-ended only',js.includes('narration.onended=')&&js.includes("mode==='auto'"));
check('manual controls',html.includes('id="modeManual"')&&html.includes('id="prevBtn"')&&html.includes('id="nextBtn"')&&html.includes('播放当前旁白'));
check('toolbar outside stage',html.indexOf('</main></div><div class="toolbar"')>0);
check('ambient motion is semantic',js.includes('startAmbient')&&js.includes('runtime-card .mini i')&&js.includes("row:not(.head) .bar i"));
check('reduced motion',css.includes('prefers-reduced-motion:reduce')&&js.includes('prefers-reduced-motion: reduce'));
check('no transition all',!css.includes('transition:all')&&!css.includes('transition: all'));
check('no scale zero',!css.includes('scale(0)')&&!js.includes('scale:0'));
check('edge-tts Yunxi ready',audio.provider==='edge-tts'&&audio.voice==='zh-CN-YunxiNeural'&&audio.rate==='+0%'&&Object.keys(audio.segments||{}).length===6&&audio.status==='ready');
check('SentenceBoundary ready',timings.boundary==='SentenceBoundary'&&Object.keys(timings.segments||{}).length===6&&Object.values(timings.segments||{}).every(v=>Array.isArray(v.cues)&&v.cues.length));
check('BGM choices + upload',html.includes('轻松科技')&&html.includes('轻松氛围')&&html.includes('轻快神秘')&&html.includes('id="musicUpload"')&&js.includes('URL.createObjectURL'));
check('local browser recording',js.includes('getDisplayMedia')&&js.includes('MediaRecorder')&&js.includes("a.download='project6-harness-chapter1.webm'"));
check('secure context guard',js.includes('window.isSecureContext'));
check('acceptance v10',acceptance.includes('第一章验收标准 v10')&&acceptance.includes('Honeys 章节封面')&&acceptance.includes('当前句同步'));

const pass=checks.every(c=>c.ok);
console.log('\nHarness Chapter 1 Gate v10 — Honeys Cover + Current-Sentence Sync + Cloud hierarchy\n');
for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nCODE GATE: ${pass?'PASS':'FAIL'}`);console.log('USER VISUAL/AUDIO REVIEW: REQUIRED');
if(!pass)process.exitCode=1;