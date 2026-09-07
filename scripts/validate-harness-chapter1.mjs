import fs from 'node:fs/promises';

const htmlPath=new URL('../presentations/harness-engineering/index.html',import.meta.url);
const audioPath=new URL('../presentations/harness-engineering/audio-map.json',import.meta.url);
const acceptancePath=new URL('../presentations/harness-engineering/ACCEPTANCE.md',import.meta.url);
const projectsPath=new URL('../data/projects.json',import.meta.url);
const bgmPath=new URL('../presentations/harness-engineering/public/audio/bgm/short-plingy-loop.ogg',import.meta.url);

const [html,audioRaw,acceptance,projectsRaw,bgm]=await Promise.all([
  fs.readFile(htmlPath,'utf8'),fs.readFile(audioPath,'utf8'),fs.readFile(acceptancePath,'utf8'),fs.readFile(projectsPath,'utf8'),fs.stat(bgmPath)
]);
const audio=JSON.parse(audioRaw),projects=JSON.parse(projectsRaw),p=projects.find(x=>x.id==='P0026');
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok,detail});

check('1920x1080 fixed stage',/width:1920px;height:1080px/.test(html));
check('six Garden steps',(html.match(/data-step="\d+"/g)||[]).length===6);
check('warm-keynote metadata',p?.gardenTheme==='warm-keynote');
check('direct edge-tts provider',audio?.provider==='edge-tts'&&audio?.client==='rany2/edge-tts');
check('YunJhe Taiwan male voice',audio?.voice==='zh-TW-YunJheNeural'&&audio?.locale==='zh-TW');
check('1.0x rate',audio?.rate==='+0%'&&Number(audio?.speed)===1);
check('six real narration files',Object.keys(audio?.segments||{}).length===6);
check('no Project5 runtime',!/project5/i.test(html));
check('no SpeechSynthesis fallback',!/speechSynthesis|SpeechSynthesisUtterance/.test(html));
check('no subtitle component',!/subtitle|字幕/.test(html));
check('no emoji UI',!/[😀-🙏🌀-🫿🚀-🛿]/u.test(html));
check('SVG visual components',(html.match(/<svg/g)||[]).length>=5,`${(html.match(/<svg/g)||[]).length} svg`);
check('multiple motion keyframes',(html.match(/@keyframes/g)||[]).length>=10,`${(html.match(/@keyframes/g)||[]).length} keyframes`);
check('scene transition states',html.includes('.scene.leaving')&&html.includes('transitionTo('));
check('CC0 BGM file exists',bgm.size>100000,`${bgm.size} bytes`);
check('BGM low-volume fade',html.includes('fadeBgm(.065')&&html.includes('stopBgm()'));
check('browser local MediaRecorder',html.includes('getDisplayMedia')&&html.includes('MediaRecorder'));
check('controls hidden while recording',html.includes('body.recording .controls{display:none}'));
check('audio-ended drives Auto',html.includes('narration.onended')&&html.includes('transitionTo(step+1'));
check('acceptance v2 exists',acceptance.includes('第一章验收标准 v2')&&acceptance.includes('画面好看')&&acceptance.includes('动画衔接合适'));

const staticPass=checks.every(c=>c.ok);
const audioReady=audio?.status==='ready'&&audio?.provider==='edge-tts'&&audio?.voice==='zh-TW-YunJheNeural'&&audio?.rate==='+0%'&&Object.keys(audio?.segments||{}).length===6;
console.log('\nHarness Chapter 1 Gate v2\n');
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nSTATIC: ${staticPass?'PASS':'FAIL'}`);
console.log(`YUNJHE AUDIO: ${audioReady?'PASS':'FAIL'}`);
console.log(`CODE GATE: ${staticPass&&audioReady?'PASS':'FAIL'}`);
console.log('USER VISUAL REVIEW: REQUIRED');
if(!staticPass||!audioReady) process.exitCode=1;
