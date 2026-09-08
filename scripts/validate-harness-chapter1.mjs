import fs from 'node:fs/promises';

const root=new URL('../presentations/harness-engineering/',import.meta.url);
const repoRoot=new URL('../',root);
const htmlPath=new URL('index.html',root),audioPath=new URL('audio-map.json',root),acceptancePath=new URL('ACCEPTANCE.md',root),projectsPath=new URL('../data/projects.json',import.meta.url),motionsPath=new URL('../data/motions.json',import.meta.url);
const bgmFiles=['public/audio/bgm/short-plingy-loop.ogg','public/audio/bgm/calm-loop.mp3','public/audio/bgm/other-center.ogg'];
const vendorFiles=[
  new URL('vendor/upstream/gsap/dist/gsap.min.js',repoRoot),
  new URL('vendor/upstream/gsap/README.md',repoRoot),
  new URL('vendor/upstream/emil-skills/LICENSE',repoRoot),
  new URL('vendor/upstream/emil-skills/skills/animate/SKILL.md',repoRoot),
  new URL('vendor/upstream/emil-skills/skills/review-animations/STANDARDS.md',repoRoot)
];
const [html,audioRaw,acceptance,projectsRaw,motionsRaw,...stats]=await Promise.all([
  fs.readFile(htmlPath,'utf8'),fs.readFile(audioPath,'utf8'),fs.readFile(acceptancePath,'utf8'),fs.readFile(projectsPath,'utf8'),fs.readFile(motionsPath,'utf8'),
  ...bgmFiles.map(p=>fs.stat(new URL(p,root))),...vendorFiles.map(p=>fs.stat(p))
]);
const audio=JSON.parse(audioRaw),projects=JSON.parse(projectsRaw),motions=JSON.parse(motionsRaw),p=projects.find(x=>x.id==='P0026');
const bgmStats=stats.slice(0,bgmFiles.length),vendorStats=stats.slice(bgmFiles.length);
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok,detail});
check('1920x1080 fixed stage',/width:1920px;height:1080px/.test(html));
check('six Garden steps',(html.match(/data-step="\d+"/g)||[]).length===6);
check('warm-keynote metadata',p?.gardenTheme==='warm-keynote');
check('direct edge-tts provider',audio?.provider==='edge-tts'&&audio?.client==='rany2/edge-tts');
check('Yunxi voice',audio?.voice==='zh-CN-YunxiNeural'&&audio?.locale==='zh-CN');
check('1.0x rate',audio?.rate==='+0%'&&Number(audio?.speed)===1);
check('six real narration files',Object.keys(audio?.segments||{}).length===6);
check('no Project5 runtime',!/project5/i.test(html));
check('no SpeechSynthesis fallback',!/speechSynthesis|SpeechSynthesisUtterance/.test(html));
check('no subtitle component',!/subtitle|字幕/.test(html));
check('local GSAP runtime loaded',html.includes('../../vendor/upstream/gsap/dist/gsap.min.js'));
check('GSAP timelines built per scene',html.includes('timelines=scenes.map((_,i)=>makeTimeline(i))'));
check('six step timeline branches',[0,1,2,3,4,5].every(i=>html.includes(`if(i===${i})`)));
check('GSAP stagger used',html.includes('stagger:'));
check('GSAP strong ease-out used',html.includes("ease:'power3.out'"));
check('old data-beat system removed',!html.includes('data-beat='));
check('old narration progress thresholds removed',!html.includes('narration.ontimeupdate')&&!html.includes('narration.currentTime/narration.duration')&&!html.includes('beatThresholds'));
check('timeline does not own step navigation',!html.includes('onComplete:()=>go')&&!html.includes('onComplete: () => go'));
check('auto navigation only in narration ended',html.includes('narration.onended=')&&html.includes("if(mode==='auto')"));
check('manual controls explicit',html.includes("setMode('manual')")&&html.includes('prevBtn')&&html.includes('nextBtn')&&html.includes('当前旁白'));
check('toolbar outside stage DOM',html.indexOf('</main></div>')<html.indexOf('class="toolbar"'));
check('recording state feedback',html.includes('等待授权')&&html.includes('正在录制')&&html.includes('已下载'));
check('secure context guard',html.includes('window.isSecureContext')&&html.includes('需 HTTPS'));
check('three preset BGM files',bgmStats.every(s=>s.size>50000),bgmStats.map(s=>s.size).join('/'));
check('local BGM upload stays browser-side',html.includes('URL.createObjectURL')&&html.includes('id="musicUpload"'));
check('browser local MediaRecorder',html.includes('getDisplayMedia')&&html.includes('MediaRecorder')&&html.includes("a.download='harness-engineering-chapter1.webm'"));
check('vendored GSAP + Emil files present',vendorStats.every(s=>s.size>0),vendorStats.map(s=>s.size).join('/'));
check('motion catalog promotes GSAP',motions.some(x=>x.id==='gsap'&&x.tier==='CORE'));
check('motion catalog promotes Emil Skills',motions.some(x=>x.id==='emil-skills'&&x.tier==='CORE'));
check('acceptance v5 exists',acceptance.includes('第一章验收标准 v5')&&acceptance.includes('GSAP 动画核心')&&acceptance.includes('严格 Step 边界'));
const staticPass=checks.every(c=>c.ok);
const audioReady=audio?.status==='ready'&&audio?.provider==='edge-tts'&&audio?.voice==='zh-CN-YunxiNeural'&&audio?.rate==='+0%'&&Object.keys(audio?.segments||{}).length===6;
console.log('\nHarness Chapter 1 Gate v5 — GSAP + Emil\n');for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nSTATIC: ${staticPass?'PASS':'FAIL'}`);console.log(`YUNXI AUDIO: ${audioReady?'PASS':'FAIL'}`);console.log(`CODE GATE: ${staticPass&&audioReady?'PASS':'FAIL'}`);console.log('USER REVIEW: REQUIRED');if(!staticPass||!audioReady)process.exitCode=1;
