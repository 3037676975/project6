import fs from 'node:fs/promises';

const root=new URL('../presentations/harness-engineering/',import.meta.url);
const read=p=>fs.readFile(new URL(p,root),'utf8');
const [html,css,polish,js,audioRaw,timingsRaw,acceptance]=await Promise.all([
  read('index.html'),read('chapter1-redesign.css'),read('chapter1-v14-polish.css'),read('chapter1-redesign.js'),read('audio-map.json'),read('timings.json'),read('ACCEPTANCE.md')
]);
const audio=JSON.parse(audioRaw),timings=JSON.parse(timingsRaw);
const checks=[];const check=(name,ok)=>checks.push({name,ok});

check('1920x1080 stage',css.includes('width:1920px;height:1080px'));
check('six Garden scenes',(html.match(/data-step="\d+"/g)||[]).length===6);
check('Harness cover title',html.includes('CHAPTER 01 · HARNESS ENGINEERING')&&html.includes('class="cover-main">HARNESS</span>'));
check('no Honeys typo',!(/Honeys/i.test(html+js)));
check('v14 asset cache bust',html.includes('chapter1-redesign.css?v=14')&&html.includes('chapter1-v14-polish.css?v=14')&&html.includes('chapter1-redesign.js?v=14'));
check('blue stage restored',polish.includes('linear-gradient(180deg,#cfe2ff')&&polish.includes('linear-gradient(145deg,#edf6ff'));
check('visible grid restored',polish.includes('background-size:48px 48px,48px 48px,12px 12px,12px 12px'));
check('light mint + blue palette',polish.includes('--v14-blue-4:#4dabf7')&&polish.includes('--v14-blue-6:#228be6')&&polish.includes('--v14-mint-3:#63e6be')&&polish.includes('--v14-mint-6:#12b886'));
check('font family unified',polish.includes('--font:"Noto Sans SC","PingFang SC","Microsoft YaHei"'));
check('cover runtime map redesigned',polish.includes('Scene 1 — more designed Harness network')&&polish.includes('.model-core:before')&&polish.includes('.flow-particle'));
check('continuous cover path particles',js.includes('function addFlowParticles')&&js.includes("motionPath:{path,align:path,alignOrigin:[.5,.5]}")&&js.includes("a.push(...addFlowParticles(s))"));
check('scene2 semantic sub-cues',js.includes("fireSemantic(1,'tool'")&&js.includes("fireSemantic(1,'state'")&&js.includes("fireSemantic(1,'stuck'"));
check('scene2 stable delayed to cue3',js.includes(".addLabel('cue3').to(s.querySelector('.lane.good')"));
check('scene3 semantic concept order',js.includes("fireSemantic(2,'context'")&&js.includes("fireSemantic(2,'tools'")&&js.includes("fireSemantic(2,'state'")&&js.includes("fireSemantic(2,'recovery'"));
check('scene3 light console',polish.includes('.console.dark-surface')&&polish.includes('linear-gradient(145deg,rgba(231,245,255,.94),rgba(230,252,245,.92))'));
check('scene6 blue green preserved',polish.includes('Scene 6 — preserve the richer blue/green closing palette')&&polish.includes('.summary .headline span')&&polish.includes('.merge-line'));
check('glass toolbar restored',polish.includes('Toolbar — restore designed glass control dock')&&polish.includes('backdrop-filter:blur(22px)'));
check('controller layers separated',js.includes('function buildTimeline')&&js.includes('function semanticSync')&&js.includes('function startAmbient'));
check('local GSAP runtime',html.includes('../../vendor/upstream/gsap/dist/gsap.min.js')&&html.includes('MotionPathPlugin.min.js')&&html.includes('DrawSVGPlugin.min.js'));
check('sentence cue synchronization',js.includes('narration.ontimeupdate')&&js.includes('cues[i].start')&&js.includes('semanticSync()'));
check('current sentence target logic',js.includes('const nextLabel=`cue${idx+1}`')&&js.includes('tl.labels[nextLabel]'));
check('auto navigation narration-ended only',js.includes('narration.onended=')&&js.includes("mode==='auto'"));
check('manual controls',html.includes('id="modeManual"')&&html.includes('id="prevBtn"')&&html.includes('id="nextBtn"'));
check('toolbar outside stage',html.indexOf('</main></div><div class="toolbar"')>0);
check('reduced motion',polish.includes('prefers-reduced-motion:reduce')&&js.includes('prefers-reduced-motion: reduce'));
check('no transition all',!css.includes('transition:all')&&!css.includes('transition: all')&&!polish.includes('transition:all')&&!polish.includes('transition: all'));
check('no scale zero',!css.includes('scale(0)')&&!js.includes('scale:0'));
check('edge-tts Yunxi ready',audio.provider==='edge-tts'&&audio.voice==='zh-CN-YunxiNeural'&&audio.status==='ready');
check('SentenceBoundary ready',timings.boundary==='SentenceBoundary'&&Object.keys(timings.segments||{}).length===6);
check('BGM + local upload',html.includes('id="musicUpload"')&&js.includes('URL.createObjectURL'));
check('local browser recording',js.includes('getDisplayMedia')&&js.includes('MediaRecorder')&&js.includes("a.download='project6-harness-chapter1.webm'"));
check('acceptance v14',acceptance.includes('第一章验收标准 v14')&&acceptance.includes('蓝色舞台 + 清晰网格')&&acceptance.includes('语义子 cue'));

const pass=checks.every(c=>c.ok);
console.log('\nHarness Chapter 1 Gate v14 — Restored Blue Grid + Semantic Sync + Refined Runtime Map\n');
for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}`);
console.log(`\nCODE GATE: ${pass?'PASS':'FAIL'}`);
console.log('USER VISUAL/AUDIO REVIEW: REQUIRED');
if(!pass)process.exitCode=1;
