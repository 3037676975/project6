/* Project6 Harness Chapter 1 — Timeline Controller v14
 * Garden Step boundary is sacred: GSAP never changes Step.
 * Edge TTS SentenceBoundary drives sentence-level motion.
 * Semantic sub-cues handle multi-concept sentences without jumping ahead.
 */
(() => {
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  if(!window.gsap||!window.MotionPathPlugin||!window.DrawSVGPlugin){console.error('GSAP runtime missing');return}
  gsap.registerPlugin(MotionPathPlugin,DrawSVGPlugin);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes=$$('.scene'), stage=$('.stage'), viewer=$('.viewer');
  const narration=$('#narration'), bgm=$('#bgm');
  const modeManual=$('#modeManual'), modeAuto=$('#modeAuto'), prevBtn=$('#prevBtn'), nextBtn=$('#nextBtn'), speakBtn=$('#speakBtn');
  const recordBtn=$('#recordBtn'), recordStatus=$('#recordStatus'), stepInfo=$('#stepInfo'), musicSelect=$('#musicSelect'), musicVolume=$('#musicVolume'), musicUpload=$('#musicUpload');
  let current=0, mode='manual', timelines=[], cueCursor=-1, audioMap=null, timings=null, recorder=null, capture=null, chunks=[], objectMusicUrl=null;
  let semanticFired=new Set();
  const ambient=new Map();

  const audioKey=i=>`01-harness-engineering/${i+1}`;
  async function loadData(){[audioMap,timings]=await Promise.all([fetch('./audio-map.json').then(r=>r.json()),fetch('./timings.json').then(r=>r.json())])}
  function cueData(){return timings?.segments?.[audioKey(current)]?.cues||[]}
  function audioSrc(){return audioMap?.segments?.[audioKey(current)]||''}
  function fit(){const r=viewer.getBoundingClientRect(),scale=Math.min(r.width/1920,r.height/1080);stage.style.transform=`scale(${scale})`}
  addEventListener('resize',fit);fit();

  function setProgressDots(){scenes.forEach((s,i)=>s.querySelectorAll('.progress-dots span').forEach((d,j)=>d.classList.toggle('on',j===i)));stepInfo.textContent=`${String(current+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`}
  function killAmbient(scene){(ambient.get(scene)||[]).forEach(x=>x?.kill?.());ambient.delete(scene);scene.querySelectorAll('.flow-particle').forEach(n=>n.remove())}

  function addFlowParticles(scene){
    const svg=scene.querySelector('.orbit-svg'); if(!svg||reduced)return [];
    const paths=[...svg.querySelectorAll('.orbit-line')]; const tweens=[];
    paths.forEach((path,i)=>{
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('r',i%2?5:6); dot.setAttribute('class','flow-particle'); svg.appendChild(dot);
      tweens.push(gsap.to(dot,{duration:3.2+i*.32,repeat:-1,delay:i*.24,ease:'none',motionPath:{path,align:path,alignOrigin:[.5,.5]}}));
    });
    return tweens;
  }

  function startAmbient(i){
    const s=scenes[i]; killAmbient(s); if(reduced)return; const a=[];
    if(i===0){
      a.push(...addFlowParticles(s));
      const core=s.querySelector('.model-core'); if(core)a.push(gsap.to(core,{y:-3,duration:2.6,yoyo:true,repeat:-1,ease:'sine.inOut'}));
      s.querySelectorAll('.sat').forEach((el,n)=>a.push(gsap.to(el,{y:n%2?-2:2,duration:2.8+n*.18,yoyo:true,repeat:-1,ease:'sine.inOut'})));
    }
    if(i===1){s.querySelectorAll('.flow-rail i').forEach((el,n)=>a.push(gsap.fromTo(el,{xPercent:-110},{xPercent:360,duration:3+n*.35,repeat:-1,repeatDelay:.4+n*.2,ease:'none'})))}
    if(i===2){s.querySelectorAll('.runtime-card .mini i').forEach((el,n)=>a.push(gsap.fromTo(el,{xPercent:-120},{xPercent:110,duration:2.8+n*.28,repeat:-1,repeatDelay:.45,ease:'none'})));const core=s.querySelector('.core-ring');if(core)a.push(gsap.to(core,{y:-2,duration:2.4,yoyo:true,repeat:-1,ease:'sine.inOut'}))}
    if(i===3){const orb=s.querySelector('.prompt-orb');if(orb)a.push(gsap.to(orb,{boxShadow:'0 14px 36px rgba(77,171,247,.30)',duration:2.1,yoyo:true,repeat:-1,ease:'sine.inOut'}))}
    if(i===4){s.querySelectorAll('.pipe').forEach((el,n)=>a.push(gsap.to(el,{backgroundPosition:'120% 0',duration:3+n*.25,repeat:-1,ease:'none'})));s.querySelectorAll('.row:not(.head) .bar i').forEach((el,n)=>a.push(gsap.to(el,{opacity:.72,duration:1.8+n*.12,yoyo:true,repeat:-1,ease:'sine.inOut'})))}
    if(i===5){const r=s.querySelector('.reliable');if(r)a.push(gsap.to(r,{boxShadow:'0 18px 46px rgba(77,171,247,.24)',duration:2.5,yoyo:true,repeat:-1,ease:'sine.inOut'}));s.querySelectorAll('.merge-line').forEach((el,n)=>a.push(gsap.to(el,{backgroundPosition:'180% 0',duration:2.8+n*.3,repeat:-1,ease:'none'})))}
    ambient.set(s,a)
  }

  function initialState(i){
    const s=scenes[i];
    if(i===0){gsap.set(s.querySelectorAll('.s1 .question-pill,.s1 .eyebrow,.s1 .cover-main,.s1 .cover-sub,.s1 .copy p,.s1 .cover-proof'),{opacity:0,y:18});gsap.set(s.querySelector('.s1 .system-card'),{opacity:0,y:24,scale:.988});gsap.set(s.querySelector('.s1 .model-core'),{opacity:0,scale:.96});gsap.set(s.querySelectorAll('.s1 .orbit-line'),{drawSVG:'0%'});gsap.set(s.querySelectorAll('.s1 .sat'),{opacity:0,y:14});gsap.set(s.querySelector('.s1 .signal-dot'),{opacity:0})}
    if(i===1){gsap.set(s.querySelectorAll('.s2 .eyebrow,.s2 .headline,.lane,.vs-badge'),{opacity:0,y:20});gsap.set(s.querySelectorAll('.stack-item'),{opacity:0,x:-16})}
    if(i===2){gsap.set(s.querySelectorAll('.s3 .eyebrow,.s3 .headline,.rail,.console,.activity'),{opacity:0,y:20});gsap.set(s.querySelectorAll('.resource,.runtime-card,.event'),{opacity:0,y:12});gsap.set(s.querySelector('.core-ring'),{opacity:0,scale:.97})}
    if(i===3){gsap.set(s.querySelectorAll('.s4 .eyebrow,.s4 .headline,.prompt-card,.control-plane'),{opacity:0,y:20});gsap.set(s.querySelector('.arrow-path'),{drawSVG:'0%'});gsap.set(s.querySelector('.prompt-orb'),{opacity:0,scale:.97});gsap.set(s.querySelectorAll('.cp-item'),{opacity:0,y:12});gsap.set(s.querySelector('.control-bottom'),{opacity:0,y:10})}
    if(i===4){gsap.set(s.querySelectorAll('.s5 .eyebrow,.s5 .headline,.research-board,.side-case'),{opacity:0,y:20});gsap.set(s.querySelectorAll('.pipe,.row:not(.head),.loop-step'),{opacity:0,y:10});gsap.set(s.querySelector('.big-number'),{opacity:0,scale:.97})}
    if(i===5){gsap.set(s.querySelectorAll('.summary .eyebrow,.summary .headline,.summary .subhead,.pillar,.merge,.reliable'),{opacity:0,y:18})}
  }

  function buildTimeline(i){
    const s=scenes[i],tl=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});initialState(i);
    if(i===0){tl.addLabel('cue0',0).to(s.querySelectorAll('.s1 .question-pill,.s1 .eyebrow'),{opacity:1,y:0,duration:.42,stagger:.08}).to(s.querySelectorAll('.s1 .cover-main,.s1 .cover-sub'),{opacity:1,y:0,duration:.62,stagger:.08},'<+.08').addLabel('cue1').to(s.querySelector('.s1 .copy p'),{opacity:1,y:0,duration:.48}).to(s.querySelector('.s1 .system-card'),{opacity:1,y:0,scale:1,duration:.62},'<+.08').to(s.querySelector('.s1 .model-core'),{opacity:1,scale:1,duration:.42},'<+.08').addLabel('cue2').to(s.querySelectorAll('.s1 .orbit-line'),{drawSVG:'100%',duration:.78,stagger:.05,ease:'power2.inOut'}).to(s.querySelectorAll('.s1 .sat'),{opacity:1,y:0,duration:.42,stagger:.07},'<+.16').to(s.querySelector('.s1 .signal-dot'),{opacity:1,duration:.25},'<+.12').addLabel('cue3').to(s.querySelector('.s1 .cover-proof'),{opacity:1,y:0,duration:.46})}
    if(i===1){tl.addLabel('cue0',0).to(s.querySelectorAll('.s2 .eyebrow,.s2 .headline'),{opacity:1,y:0,duration:.5,stagger:.08}).to(s.querySelector('.lane.bad'),{opacity:1,y:0,duration:.58},'<+.12').addLabel('cue1').to(s.querySelector('.vs-badge'),{opacity:1,y:0,duration:.3}).addLabel('cue2').to(s.querySelector('.lane.bad'),{boxShadow:'0 22px 68px rgba(250,82,82,.08)',duration:.36}).addLabel('cue3').to(s.querySelector('.lane.good'),{opacity:1,y:0,duration:.6}).to(s.querySelectorAll('.lane.good .stack-item'),{opacity:1,x:0,duration:.38,stagger:.07},'<+.12')}
    if(i===2){tl.addLabel('cue0',0).to(s.querySelectorAll('.s3 .eyebrow,.s3 .headline'),{opacity:1,y:0,duration:.5,stagger:.08}).addLabel('cue1').to(s.querySelector('.console'),{opacity:1,y:0,duration:.58}).to(s.querySelector('.rail'),{opacity:1,y:0,duration:.46},'<+.05').to(s.querySelector('.activity'),{opacity:1,y:0,duration:.46},'<+.04').addLabel('cue2').to(s.querySelector('.core-ring'),{opacity:1,scale:1,duration:.48}).to(s.querySelectorAll('.runtime-card'),{borderColor:'rgba(77,171,247,.28)',duration:.42,stagger:.04},'<')}
    if(i===3){tl.addLabel('cue0',0).to(s.querySelectorAll('.s4 .eyebrow,.s4 .headline'),{opacity:1,y:0,duration:.55,stagger:.1}).to(s.querySelector('.prompt-card'),{opacity:1,y:0,duration:.65},'<+.12').addLabel('cue1').to(s.querySelector('.prompt-orb'),{opacity:1,scale:1,duration:.42}).to(s.querySelector('.arrow-path'),{drawSVG:'100%',duration:.75,ease:'power2.inOut'},'<').addLabel('cue2').to(s.querySelector('.prompt-orb'),{motionPath:{path:s.querySelector('.arrow-path'),align:s.querySelector('.arrow-path'),alignOrigin:[.5,.5]},duration:1.05,ease:'power2.inOut'}).addLabel('cue3').to(s.querySelector('.control-plane'),{opacity:1,y:0,duration:.7}).to(s.querySelectorAll('.cp-item'),{opacity:1,y:0,duration:.4,stagger:.09},'<+.15').addLabel('cue4').to(s.querySelector('.control-bottom'),{opacity:1,y:0,duration:.5})}
    if(i===4){tl.addLabel('cue0',0).to(s.querySelectorAll('.s5 .eyebrow,.s5 .headline'),{opacity:1,y:0,duration:.55,stagger:.1}).addLabel('cue1').to(s.querySelector('.research-board'),{opacity:1,y:0,duration:.68}).to(s.querySelector('.side-case'),{opacity:1,y:0,duration:.6},'<+.1').to(s.querySelector('.big-number'),{opacity:1,scale:1,duration:.55},'<').addLabel('cue2').to(s.querySelectorAll('.pipe'),{opacity:1,y:0,duration:.38,stagger:.08}).to(s.querySelectorAll('.row:not(.head)'),{opacity:1,y:0,duration:.32,stagger:.055},'<+.15').addLabel('cue3').to(s.querySelectorAll('.loop-step'),{opacity:1,y:0,duration:.4,stagger:.08}).addLabel('cue4').to(s.querySelectorAll('.row:not(.head) .bar i'),{width:(idx)=>`${65+(idx%4)*8}%`,duration:.5,stagger:.04,ease:'power2.out'}).addLabel('cue5').to(s.querySelector('.big-number'),{color:'#228be6',scale:1.04,duration:.32}).to(s.querySelector('.big-number'),{scale:1,duration:.34})}
    if(i===5){tl.addLabel('cue0',0).to(s.querySelectorAll('.summary .eyebrow,.summary .headline,.summary .subhead'),{opacity:1,y:0,duration:.58,stagger:.1}).to(s.querySelectorAll('.pillar'),{opacity:1,y:0,duration:.44,stagger:.08},'<+.16').to(s.querySelector('.merge'),{opacity:1,y:0,duration:.48},'<+.24').to(s.querySelector('.reliable'),{opacity:1,y:0,duration:.55},'<+.12').addLabel('cue1').to(s.querySelectorAll('.pillar'),{borderColor:'rgba(77,171,247,.28)',duration:.5,stagger:.08})}
    return tl
  }

  function fireSemantic(step,key,fn){const id=`${step}:${key}`;if(semanticFired.has(id))return;semanticFired.add(id);fn()}
  function semanticSync(){
    if(reduced)return;const t=narration.currentTime,s=scenes[current];
    if(current===1){
      if(t>=8.6)fireSemantic(1,'tool',()=>gsap.to(s.querySelectorAll('.lane.bad .stack-item')[0],{opacity:1,x:0,duration:.42,ease:'power3.out'}));
      if(t>=10.45)fireSemantic(1,'state',()=>gsap.to(s.querySelectorAll('.lane.bad .stack-item')[1],{opacity:1,x:0,duration:.42,ease:'power3.out'}));
      if(t>=12.25)fireSemantic(1,'stuck',()=>gsap.to(s.querySelectorAll('.lane.bad .stack-item')[2],{opacity:1,x:0,duration:.42,ease:'power3.out'}));
    }
    if(current===2){
      const res=s.querySelectorAll('.resource'),cards=s.querySelectorAll('.runtime-card'),events=s.querySelectorAll('.event');
      const reveal=n=>gsap.to([res[n],cards[n],events[n]],{opacity:1,y:0,duration:.38,stagger:.045,ease:'power3.out'});
      if(t>=3.35)fireSemantic(2,'context',()=>reveal(0));
      if(t>=5.25)fireSemantic(2,'tools',()=>reveal(1));
      if(t>=7.25)fireSemantic(2,'state',()=>reveal(2));
      if(t>=9.15)fireSemantic(2,'recovery',()=>reveal(3));
    }
  }

  function buildAll(){timelines.forEach(t=>t.kill());timelines=scenes.map((_,i)=>buildTimeline(i))}
  function showScene(i,{preview=false}={}){scenes.forEach((s,n)=>{killAmbient(s);s.classList.toggle('active',n===i)});current=i;cueCursor=-1;semanticFired.clear();setProgressDots();timelines.forEach((t,n)=>{t.pause(0);if(n!==i)initialState(n)});initialState(i);narration.pause();narration.currentTime=0;narration.src=audioSrc();if(preview){timelines[i].progress(1);if(i===1)gsap.set(scenes[i].querySelectorAll('.stack-item'),{opacity:1,x:0});if(i===2)gsap.set(scenes[i].querySelectorAll('.resource,.runtime-card,.event'),{opacity:1,y:0});startAmbient(i)}}

  function advanceCue(idx){if(idx<=cueCursor)return;cueCursor=idx;const tl=timelines[current],cues=cueData(),nextLabel=`cue${idx+1}`,target=tl.labels[nextLabel]!==undefined?nextLabel:tl.duration(),cue=cues[idx]||{},syncDuration=reduced?.01:Math.max(.45,Math.min(1.15,(Number(cue.duration)||2)*.2));tl.tweenTo(target,{duration:syncDuration,ease:'power2.out',overwrite:true})}
  function playCurrent(){cueCursor=-1;semanticFired.clear();timelines[current].pause(0);initialState(current);narration.src=audioSrc();narration.currentTime=0;narration.play().catch(e=>console.warn(e));advanceCue(0)}
  narration.ontimeupdate=()=>{const cues=cueData();for(let i=0;i<cues.length;i++)if(narration.currentTime>=Math.max(0,cues[i].start-.07))advanceCue(i);semanticSync()};
  narration.onended=()=>{timelines[current].progress(1);if(current===1)gsap.set(scenes[current].querySelectorAll('.stack-item'),{opacity:1,x:0});if(current===2)gsap.set(scenes[current].querySelectorAll('.resource,.runtime-card,.event'),{opacity:1,y:0});startAmbient(current);if(mode==='auto'&&current<scenes.length-1){showScene(current+1);requestAnimationFrame(playCurrent)}else if(mode==='auto'&&current===scenes.length-1){fadeBgm();if(recorder?.state==='recording')stopRecording()}};

  function setMode(m){mode=m;modeManual.classList.toggle('on',m==='manual');modeAuto.classList.toggle('on',m==='auto')}
  modeManual.onclick=()=>setMode('manual');modeAuto.onclick=()=>setMode('auto');prevBtn.onclick=()=>showScene(Math.max(0,current-1),{preview:true});nextBtn.onclick=()=>showScene(Math.min(scenes.length-1,current+1),{preview:true});speakBtn.onclick=playCurrent;
  stage.onclick=e=>{if(mode==='manual'&&!e.target.closest('button,input,select'))showScene(Math.min(scenes.length-1,current+1),{preview:true})};addEventListener('keydown',e=>{if(e.key==='ArrowRight')showScene(Math.min(scenes.length-1,current+1),{preview:true});if(e.key==='ArrowLeft')showScene(Math.max(0,current-1),{preview:true})});

  const musicMap={none:'',tech:'./public/audio/bgm/short-plingy-loop.ogg',calm:'./public/audio/bgm/calm-loop.mp3',other:'./public/audio/bgm/other-center.ogg'};
  function setMusic(src){bgm.pause();bgm.currentTime=0;if(src){bgm.src=src;bgm.loop=true;bgm.volume=Number(musicVolume.value)/100;bgm.play().catch(()=>{})}}
  musicSelect.onchange=()=>{if(musicSelect.value==='upload'){musicUpload.click();return}setMusic(musicMap[musicSelect.value]||'')};musicUpload.onchange=()=>{const f=musicUpload.files?.[0];if(!f)return;if(objectMusicUrl)URL.revokeObjectURL(objectMusicUrl);objectMusicUrl=URL.createObjectURL(f);musicSelect.value='upload';setMusic(objectMusicUrl)};musicVolume.oninput=()=>bgm.volume=Number(musicVolume.value)/100;
  function fadeBgm(){if(!bgm.src)return;const from=bgm.volume,start=performance.now();const tick=t=>{const p=Math.min(1,(t-start)/700);bgm.volume=from*(1-p);if(p<1)requestAnimationFrame(tick);else bgm.pause()};requestAnimationFrame(tick)}

  async function startRecording(){if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia){recordStatus.textContent='需 HTTPS';return}try{recordStatus.textContent='等待授权';capture=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:60},audio:true,preferCurrentTab:true});chunks=[];recorder=new MediaRecorder(capture,{mimeType:MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm'});recorder.ondataavailable=e=>e.data.size&&chunks.push(e.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:'video/webm'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='project6-harness-chapter1.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);recordStatus.textContent='已下载';recordBtn.textContent='● 一键录制';recordBtn.classList.remove('live');capture?.getTracks().forEach(t=>t.stop())};recorder.start(1000);recordBtn.textContent='■ 停止并下载';recordBtn.classList.add('live');recordStatus.textContent='正在录制';setMode('auto');showScene(0);requestAnimationFrame(playCurrent)}catch(e){recordStatus.textContent=e?.name==='NotAllowedError'?'已取消':'录制失败'}}
  function stopRecording(){if(recorder?.state==='recording')recorder.stop()} recordBtn.onclick=()=>recorder?.state==='recording'?stopRecording():startRecording();

  loadData().then(()=>{buildAll();showScene(0,{preview:true})}).catch(e=>{console.error(e);recordStatus.textContent='资源加载失败'});
})();