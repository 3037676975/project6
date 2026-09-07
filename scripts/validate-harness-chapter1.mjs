import fs from 'node:fs/promises';

const htmlPath=new URL('../presentations/harness-engineering/index.html',import.meta.url);
const audioPath=new URL('../presentations/harness-engineering/audio-map.json',import.meta.url);
const acceptancePath=new URL('../presentations/harness-engineering/ACCEPTANCE.md',import.meta.url);
const projectsPath=new URL('../data/projects.json',import.meta.url);

const [html,audioRaw,acceptance,projectsRaw]=await Promise.all([
  fs.readFile(htmlPath,'utf8'),fs.readFile(audioPath,'utf8'),fs.readFile(acceptancePath,'utf8'),fs.readFile(projectsPath,'utf8')
]);
const audio=JSON.parse(audioRaw),projects=JSON.parse(projectsRaw),p=projects.find(x=>x.id==='P0026');
const checks=[];
function check(name,ok,detail=''){checks.push({name,ok,detail});}

check('1920x1080 fixed stage',/width:1920px;height:1080px/.test(html));
check('six Garden steps',(html.match(/data-step="\d+"/g)||[]).length===6);
check('warm-keynote project metadata',p?.gardenTheme==='warm-keynote');
check('ETG1 voice id metadata',p?.voiceId==='zh-TW-YunJheNeural'&&Number(p?.voiceSpeed)===1.1);
check('Project5-only runtime',html.includes("audioMap?.provider==='project5'")&&html.includes("audioMap?.voice==='zh-TW-YunJheNeural'"));
check('no SpeechSynthesis fallback',!/speechSynthesis|SpeechSynthesisUtterance/.test(html));
check('no subtitle component',!/subtitle|字幕/.test(html));
check('no emoji UI',!/[😀-🙏🌀-🫿🚀-🛿]/u.test(html));
check('SVG visual components',(html.match(/<svg/g)||[]).length>=5,`${(html.match(/<svg/g)||[]).length} svg`);
check('multiple distinct motion keyframes',(html.match(/@keyframes/g)||[]).length>=8,`${(html.match(/@keyframes/g)||[]).length} keyframes`);
check('browser local MediaRecorder',html.includes('getDisplayMedia')&&html.includes('MediaRecorder'));
check('recording blocked before ETG1',html.includes("if(!audioReady())")&&html.includes('禁止录制'));
check('official auto audio-ended drive',html.includes('voice.onended')&&html.includes('setTimeout(next,200)'));
check('acceptance gate exists',acceptance.includes('最终 Gate')&&acceptance.includes('当前：**FAIL**'));

const staticPass=checks.every(c=>c.ok);
const audioReady=audio?.status==='ready'&&audio?.provider==='project5'&&audio?.engine==='edge'&&audio?.voice==='zh-TW-YunJheNeural'&&Number(audio?.speed)===1.1&&Object.keys(audio?.segments||{}).length===6;
console.log('\nHarness Chapter 1 Static Gate\n');
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nSTATIC: ${staticPass?'PASS':'FAIL'}`);
console.log(`ETG1 AUDIO: ${audioReady?'PASS':'FAIL (6 real Project5 segments required)'}`);
console.log(`FINAL: ${staticPass&&audioReady?'PASS':'FAIL'}`);
if(!staticPass||!audioReady) process.exitCode=1;
