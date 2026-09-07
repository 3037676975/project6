import fs from 'node:fs/promises';
import process from 'node:process';

const BASE_URL=(process.env.PROJECT5_BASE_URL||'http://186.244.245.177:28442').replace(/\/$/,'');
const API_KEY=process.env.PROJECT5_API_KEY;
const ENGINE='edge';
const VOICE='zh-TW-YunJheNeural';
const SPEED=1.10;
const inputPath=new URL('../presentations/harness-engineering/narrations.json',import.meta.url);
const outputPath=new URL('../presentations/harness-engineering/audio-map.json',import.meta.url);
if(!API_KEY) throw new Error('缺少 PROJECT5_API_KEY；只允许通过服务端环境变量提供。');
const data=JSON.parse(await fs.readFile(inputPath,'utf8'));
async function req(url,options={}){const r=await fetch(url,{...options,headers:{...(options.headers||{}),Authorization:`Bearer ${API_KEY}`}});const body=await r.json();if(!r.ok)throw new Error(body.detail||body.error||`HTTP ${r.status}`);return body}
async function poll(id){const start=Date.now();while(Date.now()-start<180000){const t=await req(`${BASE_URL}/v1/tasks/${encodeURIComponent(id)}`);if(t.status==='completed')return t;if(t.status==='failed')throw new Error(t.error||'TTS failed');await new Promise(r=>setTimeout(r,1000))}throw new Error('TTS timeout')}
const segments={};
for(let i=0;i<data.steps.length;i++){
  const accepted=await req(`${BASE_URL}/v1/audio/speech`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:data.steps[i],engine:ENGINE,voice:VOICE,speed:SPEED})});
  const id=accepted.id||accepted.task_id;if(!id)throw new Error('Project5 未返回 task id');
  const done=await poll(id);if(!done.audio_url)throw new Error('completed 但缺少 audio_url');
  segments[`01-harness-engineering/${i+1}`]=done.audio_url;
  console.log(`[${i+1}/${data.steps.length}] OK`);
}
await fs.writeFile(outputPath,JSON.stringify({provider:'project5',baseUrl:BASE_URL,engine:ENGINE,voice:VOICE,speed:SPEED,status:'ready',generatedAt:new Date().toISOString(),segments},null,2)+'\n');
console.log('Harness ETG1 audio-map ready.');
