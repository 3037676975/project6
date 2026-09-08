import fs from 'node:fs/promises';

const root=new URL('../presentations/harness-engineering/',import.meta.url);
const repoRoot=new URL('../',import.meta.url);
const htmlPath=new URL('index.html',root),audioPath=new URL('audio-map.json',root),timingsPath=new URL('timings.json',root),acceptancePath=new URL('ACCEPTANCE.md',root),projectsPath=new URL('../data/projects.json',import.meta.url),motionsPath=new URL('../data/motions.json',import.meta.url),ambientJsPath=new URL('continuous-motion.js',root),ambientCssPath=new URL('continuous-motion.css',root),galaxyCssPath=new URL('galaxy-layer.css',root),galaxyIndexPath=new URL('../data/galaxy-components.json',import.meta.url),galaxyCuratedPath=new URL('../data/galaxy-curated.json',import.meta.url),componentsPagePath=new URL('../components.html',import.meta.url);
const bgmFiles=['public/audio/bgm/short-plingy-loop.ogg','public/audio/bgm/calm-loop.mp3','public/audio/bgm/other-center.ogg'];
const vendorFiles=[
  new URL('vendor/upstream/gsap/dist/gsap.min.js',repoRoot),
  new URL('vendor/upstream/gsap/dist/MotionPathPlugin.min.js',repoRoot),
  new URL('vendor/upstream/gsap/dist/DrawSVGPlugin.min.js',repoRoot),
  new URL('vendor/upstream/emil-skills/skills/animate/SKILL.md',repoRoot),
  new URL('vendor/upstream/emil-skills/skills/find-animation-opportunities/SKILL.md',repoRoot),
  new URL('vendor/upstream/emil-skills/skills/review-animations/STANDARDS.md',repoRoot),
  new URL('vendor/upstream/emil-skills/skills/improve-animations/SKILL.md',repoRoot),
  new URL('vendor/upstream/uiverse-galaxy/README.md',repoRoot),
  new URL('vendor/upstream/uiverse-galaxy/LICENSE',repoRoot)
];
const [html,audioRaw,timingsRaw,acceptance,projectsRaw,motionsRaw,ambientJs,ambientCss,galaxyCss,galaxyIndexRaw,galaxyCuratedRaw,componentsPage,...stats]=await Promise.all([
  fs.readFile(htmlPath,'utf8'),fs.readFile(audioPath,'utf8'),fs.readFile(timingsPath,'utf8'),fs.readFile(acceptancePath,'utf8'),fs.readFile(projectsPath,'utf8'),fs.readFile(motionsPath,'utf8'),fs.readFile(ambientJsPath,'utf8'),fs.readFile(ambientCssPath,'utf8'),fs.readFile(galaxyCssPath,'utf8'),fs.readFile(galaxyIndexPath,'utf8'),fs.readFile(galaxyCuratedPath,'utf8'),fs.readFile(componentsPagePath,'utf8'),
  ...bgmFiles.map(p=>fs.stat(new URL(p,root))),...vendorFiles.map(p=>fs.stat(p))
]);
const audio=JSON.parse(audioRaw),timings=JSON.parse(timingsRaw),projects=JSON.parse(projectsRaw),motions=JSON.parse(motionsRaw),galaxyIndex=JSON.parse(galaxyIndexRaw),galaxyCurated=JSON.parse(galaxyCuratedRaw),p=projects.find(x=>x.id==='P0026');
const bgmStats=stats.slice(0,bgmFiles.length),vendorStats=stats.slice(bgmFiles.length);
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok,detail});
check('1920x1080 fixed stage',/width:1920px;height:1080px/.test(html));
check('six Garden steps',(html.match(/data-step="\d+"/g)||[]).length===6);
check('warm-keynote metadata',p?.gardenTheme==='warm-keynote');
check('direct edge-tts provider',audio?.provider==='edge-tts'&&audio?.client==='rany2/edge-tts');
check('Yunxi voice',audio?.voice==='zh-CN-YunxiNeural'&&audio?.locale==='zh-CN');
check('1.0x rate',audio?.rate==='+0%'&&Number(audio?.speed)===1);
check('six real narration files',Object.keys(audio?.segments||{}).length===6);
check('SentenceBoundary timing metadata',timings?.provider==='edge-tts'&&timings?.boundary==='SentenceBoundary'&&Object.keys(timings?.segments||{}).length===6);
check('all timing segments have cues',Object.values(timings?.segments||{}).every(x=>Array.isArray(x.cues)&&x.cues.length>0));
check('no Project5 runtime',!/project5/i.test(html));
check('no SpeechSynthesis fallback',!/speechSynthesis|SpeechSynthesisUtterance/.test(html));
check('no visible subtitle component',!/class="[^"]*subtitle|id="[^"]*subtitle/.test(html));
check('local GSAP runtime loaded',html.includes('../../vendor/upstream/gsap/dist/gsap.min.js'));
check('MotionPath plugin loaded',html.includes('MotionPathPlugin.min.js')&&html.includes('MotionPathPlugin'));
check('DrawSVG plugin loaded',html.includes('DrawSVGPlugin.min.js')&&html.includes('DrawSVGPlugin'));
check('GSAP timelines built per scene',html.includes('const built=scenes.map((_,i)=>makeTimeline(i))')&&html.includes('timelines=built.map'));
check('six step timeline branches',[0,1,2,3,4,5].every(i=>html.includes(`if(i===${i})`)));
check('spatial motion path used',html.includes('motionPath:{path:')&&html.includes('#heroPath')&&html.includes('#promptPath')&&html.includes('#loopPath'));
check('SVG draw used',html.includes("drawSVG:'0%'")&&html.includes("drawSVG:'100%'"));
check('GSAP stagger used',html.includes('stagger:'));
check('old data-beat system removed',!html.includes('data-beat='));
check('old percentage threshold system removed',!html.includes('beatThresholds')&&!html.includes('currentTime/narration.duration')&&!html.includes('audio.currentTime / duration'));
check('timeupdate uses real cue starts',html.includes('cueData()')&&html.includes('cues[i].start')&&html.includes('narration.ontimeupdate'));
check('timeline does not own step navigation',!html.includes('onComplete:()=>go')&&!html.includes('onComplete: () => go'));
check('auto navigation only in narration ended',html.includes('narration.onended=')&&html.includes("if(mode==='auto')"));
check('manual controls explicit',html.includes("setMode('manual')")&&html.includes('prevBtn')&&html.includes('nextBtn')&&html.includes('当前旁白'));
check('toolbar outside stage DOM',html.indexOf('</main></div>')<html.indexOf('class="toolbar"'));
check('Emil press feedback',html.includes('transform:scale(.97)')&&html.includes('160ms'));
check('hover pointer gating',html.includes('@media(hover:hover) and (pointer:fine)'));
check('reduced motion supported',html.includes('prefers-reduced-motion:reduce')&&html.includes("prefers-reduced-motion: reduce"));
check('no transition all',!html.includes('transition:all')&&!html.includes('transition: all'));
check('no scale zero',!html.includes('scale(0)'));
check('recording state feedback',html.includes('等待授权')&&html.includes('正在录制')&&html.includes('已下载'));
check('secure context guard',html.includes('window.isSecureContext')&&html.includes('需 HTTPS'));
check('three preset BGM files',bgmStats.every(s=>s.size>50000),bgmStats.map(s=>s.size).join('/'));
check('local BGM upload stays browser-side',html.includes('URL.createObjectURL')&&html.includes('id="musicUpload"'));
check('browser local MediaRecorder',html.includes('getDisplayMedia')&&html.includes('MediaRecorder')&&html.includes("a.download='harness-engineering-chapter1.webm'"));
check('vendored GSAP + Emil + Galaxy files present',vendorStats.every(s=>s.size>0),vendorStats.map(s=>s.size).join('/'));
check('motion catalog promotes GSAP',motions.some(x=>x.id==='gsap'&&x.tier==='CORE'));
check('motion catalog promotes Emil Skills',motions.some(x=>x.id==='emil-skills'&&x.tier==='CORE'));
check('motion catalog promotes Uiverse Galaxy',motions.some(x=>x.id==='uiverse-galaxy'&&x.tier==='CORE'));
check('Galaxy local index has 3000+ components',galaxyIndex?.total>=3000,`total=${galaxyIndex?.total}`);
check('Galaxy curated shortlist exists',Array.isArray(galaxyCurated?.items)&&galaxyCurated.items.length>=8,`curated=${galaxyCurated?.items?.length||0}`);
check('Galaxy component workspace exists',componentsPage.includes('Project6 组件库')&&componentsPage.includes('galaxy-components.json')&&componentsPage.includes('Project6 精选'));
check('Galaxy adaptation layer wired',html.includes('./galaxy-layer.css')&&galaxyCss.includes('Project6 Galaxy adaptation layer'));
check('Galaxy layer respects reduced motion',galaxyCss.includes('prefers-reduced-motion:reduce'));
check('continuous motion assets wired',html.includes('./continuous-motion.css')&&html.includes('./continuous-motion.js'));
check('ambient layer uses active-scene lifecycle',ambientJs.includes('MutationObserver')&&ambientJs.includes("classList.contains('active')")&&ambientJs.includes('killScene'));
check('ambient layer has sustainable flow motion',ambientJs.includes('repeat:-1')&&ambientJs.includes('motionPath')&&ambientJs.includes('work-flow-')&&ambientJs.includes('repeatDelay'));
check('ambient emoji is auxiliary',ambientJs.includes("'🧠'")&&ambientJs.includes("'⚙️'")&&ambientCss.includes('.ambient-emoji'));
check('ambient reduced motion guard',ambientJs.includes("prefers-reduced-motion: reduce")&&ambientCss.includes('prefers-reduced-motion:reduce'));
check('acceptance v7 exists',acceptance.includes('第一章验收标准 v7')&&acceptance.includes('持续动画规则')&&acceptance.includes('Emoji 辅助视觉规则')&&acceptance.includes('Emil Review Gate'));
check('no authored JS template artifact',!html.includes('${Array.from')&&!html.includes('${String(i+1)'));
const staticPass=checks.every(c=>c.ok);
const audioReady=audio?.status==='ready'&&audio?.provider==='edge-tts'&&audio?.voice==='zh-CN-YunxiNeural'&&audio?.rate==='+0%'&&Object.keys(audio?.segments||{}).length===6;
console.log('\nHarness Chapter 1 Gate v8 — Garden + Galaxy + Emil + GSAP + Edge timing\n');for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nSTATIC: ${staticPass?'PASS':'FAIL'}`);console.log(`YUNXI AUDIO: ${audioReady?'PASS':'FAIL'}`);console.log(`CODE GATE: ${staticPass&&audioReady?'PASS':'FAIL'}`);console.log('USER REVIEW: REQUIRED');if(!staticPass||!audioReady)process.exitCode=1;
