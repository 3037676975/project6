/* Project6 · Harness Engineering · Chapter 1 v22
 * Garden synchronization contract:
 * - one Garden Step owns one narration file
 * - only timings.json SentenceBoundary cues trigger visual phases
 * - no guessed in-sentence currentTime thresholds
 * - GSAP never changes Step
 * - Auto advances only on narration ended + 200ms
 */
(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const scenes=$$('.scene'), stage=$('.stage'), viewer=$('.viewer');
  const narration=$('#narration'), bgm=$('#bgm');
  const modeManual=$('#modeManual'), modeAuto=$('#modeAuto'), prevBtn=$('#prevBtn'), nextBtn=$('#nextBtn'), speakBtn=$('#speakBtn');
  const stepInfo=$('#stepInfo'), musicSelect=$('#musicSelect'), musicVolume=$('#musicVolume'), musicUpload=$('#musicUpload');
  const recordBtn=$('#recordBtn'), recordStatus=$('#recordStatus');
  if(!stage||!viewer||!narration||!window.gsap)return;
  if(window.MotionPathPlugin)gsap.registerPlugin(MotionPathPlugin);
  if(window.DrawSVGPlugin)gsap.registerPlugin(DrawSVGPlugin);

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const key=i=>`01-harness-engineering/${i+1}`;
  let current=0, mode='manual', audioMap=null, timings=null, cueCursor=-1, ambient=[], objectMusicUrl=null;
  let recorder=null,capture=null,chunks=[];

  const fit=()=>{const r=viewer.getBoundingClientRect();stage.style.transform=`scale(${Math.min(r.width/1920,r.height/1080)})`};
  addEventListener('resize',fit);fit();
  const duration=(v=.55)=>reduced?.01:v;
  const hide=(nodes,opts={})=>{const list=Array.isArray(nodes)?nodes.filter(Boolean):nodes;if(list&&(!Array.isArray(list)||list.length))gsap.set(list,{opacity:0,x:opts.x??0,y:opts.y??18,scale:opts.scale??1})};
  const reveal=(nodes,opts={})=>{const list=Array.isArray(nodes)?nodes.filter(Boolean):nodes;if(list&&(!Array.isArray(list)||list.length))gsap.to(list,{opacity:1,x:0,y:0,scale:1,duration:duration(opts.duration??.55),stagger:reduced?0:(opts.stagger??.07),ease:opts.ease??'power3.out',overwrite:'auto'})};

  function progress(){scenes.forEach((s,i)=>$$('.progress-dots span',s).forEach((d,j)=>d.classList.toggle('on',j===i)));if(stepInfo)stepInfo.textContent=`${String(current+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`}
  function killAmbient(){ambient.forEach(t=>t?.kill?.());ambient=[]}

  function prepare(i){
    const s=scenes[i];killAmbient();cueCursor=-1;
    if(i===0){hide($$('.copy .kicker,.copy .eyebrow,.copy .hero-title,.copy .hero-copy,.cover-proof',s));hide($('.runtime-shell',s),{y:24});hide($('.core',s),{scale:.94,y:0});hide($$('.port',s),{y:12});window.DrawSVGPlugin?gsap.set($$('.orbit path',s),{drawSVG:'0%'}):gsap.set($$('.orbit path',s),{opacity:.15});gsap.set($('.flow-dot',s),{opacity:0})}
    if(i===1){$$('.exec-node',s).forEach(n=>n.classList.remove('broken'));hide($$('.heading .eyebrow,.heading .hero-title',s));hide($('.breakdown',s),{y:22});hide($$('.exec-node',s),{y:14});gsap.set($('.exec-line .progress',s),{width:'0%'});hide($('.failure-note',s),{y:10})}
    if(i===2){hide($$('.heading .eyebrow,.heading .hero-title',s));hide($('.workbench-base',s),{scale:.985,y:10});hide($('.workbench-core',s),{scale:.95,y:0});hide($$('.module',s),{y:14});hide($('.workbench-label',s),{y:8});window.DrawSVGPlugin?gsap.set($$('.workbench-svg path',s),{drawSVG:'0%'}):gsap.set($$('.workbench-svg path',s),{opacity:.25})}
    if(i===3){hide($$('.heading .eyebrow,.heading .hero-title',s));hide($('.control-frame',s),{scale:.99,y:12});hide($('.prompt-ticket',s),{x:-18,y:0});hide($$('.env-item',s),{y:14});hide($('.frame-caption',s),{y:8})}
    if(i===4){hide($$('.heading .eyebrow,.heading .hero-title',s));hide($('.research-loop',s),{x:14,y:0});hide($('.prompt-only',s),{x:-14,y:0});hide($$('.company-dot',s),{y:9});hide($$('.loop-step',s),{scale:.97,y:8});hide($('.loop-message',s),{y:8});hide($('.straight-line',s),{y:8});window.DrawSVGPlugin?gsap.set($('.loop-svg path',s),{drawSVG:'0%'}):gsap.set($('.loop-svg path',s),{opacity:.25});gsap.set($('.loop-dot',s),{opacity:0})}
    if(i===5){hide($$('.summary .eyebrow,.summary .hero-title',s));hide($$('.eq-card,.operator',s),{y:15});hide($$('.foundation span,.foundation i',s),{y:8});hide($('.final-line',s),{y:9})}
  }

  function finish(i){
    const s=scenes[i];$$('*',s).forEach(el=>{if(getComputedStyle(el).opacity==='0')gsap.set(el,{opacity:1,x:0,y:0,scale:1})});
    if((i===0||i===2||i===4)&&window.DrawSVGPlugin){const paths=$$('svg path',s);if(paths.length)gsap.set(paths,{drawSVG:'100%'})}
    if(i===1){$$('.exec-node',s).forEach((n,x)=>n.classList.toggle('broken',x>0&&x<4));gsap.set($('.exec-line .progress',s),{width:'100%'})}
  }

  function startAmbient(i){
    killAmbient();if(reduced)return;const s=scenes[i];
    if(i===0&&window.MotionPathPlugin){const dot=$('.flow-dot',s),path=$('.orbit path.hot',s);if(dot&&path){gsap.set(dot,{opacity:1});ambient.push(gsap.to(dot,{duration:3.8,repeat:-1,ease:'none',motionPath:{path,align:path,alignOrigin:[.5,.5]}}))}}
    if(i===2){const core=$('.workbench-core',s);if(core)ambient.push(gsap.to(core,{y:-3,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'}))}
    if(i===4&&window.MotionPathPlugin){const dot=$('.loop-dot',s),path=$('.loop-svg path',s);if(dot&&path){gsap.set(dot,{opacity:1});ambient.push(gsap.to(dot,{duration:4.6,repeat:-1,ease:'none',motionPath:{path,align:path,alignOrigin:[.5,.5]}}))}}
  }

  function fireCue(step,idx){
    const s=scenes[step];if(!s)return;
    if(step===0){
      if(idx===0)reveal($$('.copy .kicker,.copy .eyebrow,.copy .hero-title',s),{stagger:.08});
      if(idx===1){reveal($('.copy .hero-copy',s));reveal($('.runtime-shell',s),{duration:.65});reveal($('.core',s),{duration:.5})}
      if(idx===2){const paths=$$('.orbit path',s);window.DrawSVGPlugin?gsap.to(paths,{drawSVG:'100%',duration:duration(.9),stagger:reduced?0:.08,ease:'power2.inOut'}):gsap.to(paths,{opacity:1,duration:duration(.4)});reveal($$('.port',s),{stagger:.08,duration:.45})}
      if(idx===3){reveal($('.cover-proof',s));startAmbient(step)}
    }
    if(step===1){
      if(idx===0){reveal($$('.heading .eyebrow,.heading .hero-title',s));reveal($('.breakdown',s),{duration:.65})}
      if(idx===1)reveal($$('.exec-node',s),{stagger:.06});
      if(idx===2){gsap.to($('.exec-line .progress',s),{width:'100%',duration:duration(1.05),ease:'power2.inOut'});$$('.exec-node',s).forEach((n,x)=>n.classList.toggle('broken',x>0&&x<4))}
      if(idx===3)reveal($('.failure-note',s))
    }
    if(step===2){
      if(idx===0)reveal($$('.heading .eyebrow,.heading .hero-title',s));
      if(idx===1){reveal($('.workbench-base',s),{duration:.7});reveal($('.workbench-core',s),{duration:.55});const paths=$$('.workbench-svg path',s);window.DrawSVGPlugin?gsap.to(paths,{drawSVG:'100%',duration:duration(.9),stagger:reduced?0:.06,ease:'power2.inOut'}):gsap.to(paths,{opacity:1,duration:duration(.4)});reveal($$('.module',s),{stagger:.07,duration:.48})}
      if(idx===2){reveal($('.workbench-label',s));startAmbient(step)}
    }
    if(step===3){
      if(idx===0){reveal($$('.heading .eyebrow,.heading .hero-title',s));reveal($('.control-frame',s),{duration:.7})}
      if(idx===1)reveal($('.prompt-ticket',s),{duration:.55});
      if(idx===2){const frame=$('.control-frame',s);if(frame)gsap.fromTo(frame,{scale:1},{scale:1.008,duration:duration(.25),yoyo:true,repeat:1,ease:'power2.inOut'})}
      if(idx===3)reveal($$('.env-item',s),{stagger:.08,duration:.48});
      if(idx===4)reveal($('.frame-caption',s))
    }
    if(step===4){
      if(idx===0)reveal($$('.heading .eyebrow,.heading .hero-title',s));
      if(idx===1){reveal($('.prompt-only',s),{duration:.55});reveal($$('.company-dot',s),{stagger:.035,duration:.34})}
      if(idx===2)reveal($('.straight-line',s));
      if(idx===3)reveal($('.research-loop',s),{duration:.62});
      if(idx===4){reveal($$('.loop-step',s),{stagger:.07,duration:.43});const path=$('.loop-svg path',s);if(window.DrawSVGPlugin&&path)gsap.to(path,{drawSVG:'100%',duration:duration(1.1),ease:'power2.inOut'});else if(path)gsap.to(path,{opacity:1,duration:duration(.5)});startAmbient(step)}
      if(idx===5)reveal($('.loop-message',s))
    }
    if(step===5){
      if(idx===0){reveal($$('.summary .eyebrow,.summary .hero-title',s));reveal($$('.eq-card,.operator',s),{stagger:.08,duration:.52});reveal($$('.foundation span,.foundation i',s),{stagger:.045,duration:.38})}
      if(idx===1)reveal($('.final-line',s),{duration:.6})
    }
  }

  const cues=()=>timings?.segments?.[key(current)]?.cues||[];
  const audioSrc=()=>audioMap?.segments?.[key(current)]||'';
  function showScene(i,{preview=false}={}){const next=Math.max(0,Math.min(scenes.length-1,i));narration.pause();narration.removeAttribute('src');narration.load();killAmbient();scenes.forEach((s,n)=>s.classList.toggle('active',n===next));current=next;progress();prepare(current);if(preview){const list=timings?.segments?.[key(current)]?.cues||[];list.forEach((_,idx)=>fireCue(current,idx));finish(current);startAmbient(current)}}
  async function playCurrent(){killAmbient();cueCursor=-1;prepare(current);const src=audioSrc();if(!src){if(recordStatus)recordStatus.textContent='当前旁白缺失';return}narration.src=src;narration.currentTime=0;fireCue(current,0);cueCursor=0;try{await narration.play()}catch(e){console.warn(e);if(recordStatus)recordStatus.textContent='点击播放以授权音频'}}

  narration.addEventListener('timeupdate',()=>{const list=cues();for(let i=cueCursor+1;i<list.length;i++){if(narration.currentTime>=Math.max(0,Number(list[i].start||0)-.04)){fireCue(current,i);cueCursor=i}else break}});
  narration.addEventListener('ended',()=>{finish(current);startAmbient(current);if(mode==='auto'&&current<scenes.length-1)setTimeout(()=>{showScene(current+1);requestAnimationFrame(playCurrent)},200);else if(mode==='auto'&&current===scenes.length-1){fadeBgm();if(recorder?.state==='recording')setTimeout(stopRecording,350)}});
  narration.addEventListener('error',()=>{if(recordStatus)recordStatus.textContent='旁白加载失败'});

  function setMode(m){mode=m;modeManual?.classList.toggle('on',m==='manual');modeAuto?.classList.toggle('on',m==='auto')}
  modeManual?.addEventListener('click',()=>setMode('manual'));modeAuto?.addEventListener('click',()=>setMode('auto'));
  prevBtn?.addEventListener('click',()=>showScene(current-1,{preview:true}));nextBtn?.addEventListener('click',()=>showScene(current+1,{preview:true}));speakBtn?.addEventListener('click',playCurrent);
  stage.addEventListener('click',e=>{if(mode==='manual'&&!e.target.closest('[data-no-advance],button,input,select,a'))showScene(current+1,{preview:true})});
  addEventListener('keydown',e=>{if(e.key==='ArrowRight')showScene(current+1,{preview:true});if(e.key==='ArrowLeft')showScene(current-1,{preview:true})});

  const musicMap={none:'',tech:'./public/audio/bgm/short-plingy-loop.ogg',calm:'./public/audio/bgm/calm-loop.mp3',other:'./public/audio/bgm/other-center.ogg'};
  function setMusic(src){bgm.pause();bgm.currentTime=0;if(!src){bgm.removeAttribute('src');bgm.load();return}bgm.src=src;bgm.loop=true;bgm.volume=Number(musicVolume?.value||8)/100;bgm.play().catch(()=>{})}
  musicSelect?.addEventListener('change',()=>{if(musicSelect.value==='upload'){musicUpload?.click();return}setMusic(musicMap[musicSelect.value]||'')});
  musicUpload?.addEventListener('change',()=>{const f=musicUpload.files?.[0];if(!f)return;if(objectMusicUrl)URL.revokeObjectURL(objectMusicUrl);objectMusicUrl=URL.createObjectURL(f);musicSelect.value='upload';setMusic(objectMusicUrl)});
  musicVolume?.addEventListener('input',()=>bgm.volume=Number(musicVolume.value)/100);
  function fadeBgm(){if(!bgm.src||bgm.paused)return;const from=bgm.volume,start=performance.now();const tick=now=>{const p=Math.min(1,(now-start)/700);bgm.volume=from*(1-p);if(p<1)requestAnimationFrame(tick);else bgm.pause()};requestAnimationFrame(tick)}

  async function startRecording(){
    if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia||!window.MediaRecorder){if(recordStatus)recordStatus.textContent='HTTPS 才能录制';return}
    try{
      if(recordStatus)recordStatus.textContent='等待屏幕授权';capture=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:60},audio:true,preferCurrentTab:true});chunks=[];
      const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm';recorder=new MediaRecorder(capture,{mimeType:mime,videoBitsPerSecond:6500000});
      recorder.addEventListener('dataavailable',e=>e.data.size&&chunks.push(e.data));recorder.addEventListener('stop',()=>{const blob=new Blob(chunks,{type:'video/webm'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='project6-harness-chapter1-v22.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),1800);capture?.getTracks().forEach(t=>t.stop());recordBtn?.classList.remove('record-live');if(recordBtn)recordBtn.textContent='● 一键录制';if(recordStatus)recordStatus.textContent='已下载'});
      recorder.start(1000);recordBtn?.classList.add('record-live');if(recordBtn)recordBtn.textContent='■ 停止并下载';if(recordStatus)recordStatus.textContent='录制中';setMode('auto');showScene(0);setTimeout(playCurrent,280)
    }catch(e){console.error(e);if(recordStatus)recordStatus.textContent=e?.name==='NotAllowedError'?'已取消':'录制失败'}
  }
  function stopRecording(){if(recorder?.state==='recording')recorder.stop()}
  recordBtn?.addEventListener('click',()=>recorder?.state==='recording'?stopRecording():startRecording());

  Promise.all([
    fetch('./audio-map.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('audio-map');return r.json()}),
    fetch('./timings.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('timings');return r.json()})
  ]).then(([a,t])=>{audioMap=a;timings=t;showScene(0,{preview:true})}).catch(e=>{console.error(e);showScene(0,{preview:true});if(recordStatus)recordStatus.textContent='同步数据加载失败'});
})();
