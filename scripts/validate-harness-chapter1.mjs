import fs from 'node:fs/promises';

const root=new URL('../presentations/harness-engineering/',import.meta.url);
const htmlPath=new URL('index.html',root),audioPath=new URL('audio-map.json',root),acceptancePath=new URL('ACCEPTANCE.md',root),projectsPath=new URL('../data/projects.json',import.meta.url);
const bgmFiles=['public/audio/bgm/short-plingy-loop.ogg','public/audio/bgm/calm-loop.mp3','public/audio/bgm/other-center.ogg'];
const [html,audioRaw,acceptance,projectsRaw,...bgmStats]=await Promise.all([
  fs.readFile(htmlPath,'utf8'),fs.readFile(audioPath,'utf8'),fs.readFile(acceptancePath,'utf8'),fs.readFile(projectsPath,'utf8'),...bgmFiles.map(p=>fs.stat(new URL(p,root)))
]);
const audio=JSON.parse(audioRaw),projects=JSON.parse(projectsRaw),p=projects.find(x=>x.id==='P0026');
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok,detail});
check('1920x1080 fixed stage',/width:1920px;height:1080px/.test(html));
check('six Garden steps',(html.match(/data-step="\d+"/g)||[]).length===6);
check('warm-keynote metadata',p?.gardenTheme==='warm-keynote');
check('direct edge-tts provider',audio?.provider==='edge-tts'&&audio?.client==='rany2/edge-tts');
check('Yunxi lively male voice',audio?.voice==='zh-CN-YunxiNeural'&&audio?.locale==='zh-CN');
check('1.0x rate',audio?.rate==='+0%'&&Number(audio?.speed)===1);
check('six real narration files',Object.keys(audio?.segments||{}).length===6);
check('no Project5 runtime',!/project5/i.test(html));
check('no SpeechSynthesis fallback',!/speechSynthesis|SpeechSynthesisUtterance/.test(html));
check('no subtitle component',!/subtitle|字幕/.test(html));
check('no emoji UI',!/[😀-🙏🌀-🫿🚀-🛿]/u.test(html));
check('SVG visual components',(html.match(/<svg/g)||[]).length>=5,`${(html.match(/<svg/g)||[]).length} svg`);
check('multiple motion keyframes',(html.match(/@keyframes/g)||[]).length>=8,`${(html.match(/@keyframes/g)||[]).length} keyframes`);
check('manual mode explicit',html.includes("setMode('manual')")&&html.includes('prevBtn')&&html.includes('nextBtn')&&html.includes('播放当前旁白'));
check('auto mode audio-ended driven',html.includes("mode==='auto'")&&html.includes('voice.onended'));
check('stage click advances manual',html.includes("mode==='manual'")&&html.includes("stage.addEventListener('click'"));
check('three preset BGM files',bgmStats.every(s=>s.size>50000),bgmStats.map(s=>s.size).join('/'));
check('local BGM upload stays browser-side',html.includes('URL.createObjectURL')&&html.includes('type="file"')&&html.includes('不会上传 Project6 服务器'));
check('BGM volume control',html.includes('musicVolume')&&html.includes('bgm.volume'));
check('browser local MediaRecorder',html.includes('getDisplayMedia')&&html.includes('MediaRecorder')&&html.includes("a.download='harness-engineering-chapter1.webm'"));
check('controls hidden while recording',html.includes('body.recording .player')&&html.includes('body.recording .music-toggle'));
check('acceptance v3 exists',acceptance.includes('第一章验收标准 v3')&&acceptance.includes('口播自然')&&acceptance.includes('手动模式'));
const staticPass=checks.every(c=>c.ok);
const audioReady=audio?.status==='ready'&&audio?.provider==='edge-tts'&&audio?.voice==='zh-CN-YunxiNeural'&&audio?.rate==='+0%'&&Object.keys(audio?.segments||{}).length===6;
console.log('\nHarness Chapter 1 Gate v3\n');for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${c.detail?` · ${c.detail}`:''}`);
console.log(`\nSTATIC: ${staticPass?'PASS':'FAIL'}`);console.log(`YUNXI AUDIO: ${audioReady?'PASS':'FAIL'}`);console.log(`CODE GATE: ${staticPass&&audioReady?'PASS':'FAIL'}`);console.log('USER REVIEW: REQUIRED');if(!staticPass||!audioReady)process.exitCode=1;
