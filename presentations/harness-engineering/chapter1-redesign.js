/* Project6 Harness Chapter 1 — Timeline Controller v10
 * Garden Step boundary is sacred: GSAP never changes Step.
 * SentenceBoundary starts the visual action for the sentence that is currently being spoken.
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
  const ambient=new Map();

  const audioKey=i=>`01-harness-engineering/${i+1}`;
  async function loadData(){
    [audioMap,timings]=await Promise.all([fetch('./audio-map.json').then(r=>r.json()),fetch('./timings.json').then(r=>r.json())]);
  }
  function cueData(){return timings?.segments?.[audioKey(current)]?.cues||[]}
  function audioSrc(){return audioMap?.segments?.[audioKey(current)]||''}
  function fit(){const r=viewer.getBoundingClientRect(), scale=Math.min(r.width/1920,r.height/1080);stage.style.transform=`scale(${scale})`}
  addEventListener('resize',fit);fit();


  function setProgressDots(){
    scenes.forEach((s,i)=>s.querySelectorAll('.progress-dots span').forEach((d,j)=>d.classList.toggle('on',j===i)));
    stepInfo.textContent=`${String(current+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;
  }

  function killAmbient(scene){const arr=ambient.get(scene)||[];arr.forEach(x=>x?.kill?.());ambient.delete(scene)}
  function startAmbient(i){
    const s=scenes[i];killAmbient(s);if(reduced)return;const a=[];
    if(i===0){
      const core=s.querySelector('.model-core'), map=s.querySelector('.system-card'), dot=s.querySelector('.signal-dot');
      if(map)a.push(gsap.to(map,{boxShadow:'0 30px 82px rgba(14,165,166,.13)',duration:2.8,yoyo:true,repeat:-1,ease:'sine.inOut'}));
      if(core)a.push(gsap.to(core,{y:-3,duration:2.4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
      if(dot)a.push(gsap.to(dot,{opacity:.35,duration:.8,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    }
    if(i===1){
      const badItems=[...s.querySelectorAll('.lane.bad .stack-item')];
      const goodItems=[...s.querySelectorAll('.lane.good .stack-item')];
      tl.addLabel('cue0',0)
        .to(s.querySelectorAll('.s2 .eyebrow,.s2 .headline'),{opacity:1,y:0,duration:.5,stagger:.08})
        .to(s.querySelector('.lane.bad'),{opacity:1,y:0,duration:.55},'<+.1')
        .addLabel('cue1')
        .to(s.querySelector('.vs-badge'),{opacity:1,y:0,scale:1,duration:.28,ease:'power2.out'})
        .addLabel('cue2')
        .to(badItems[0],{opacity:1,x:0,duration:.42,ease:'power3.out'})
        .to(badItems[0],{boxShadow:'0 10px 30px rgba(250,82,82,.12)',duration:.28},'<')
        .to(badItems[1],{opacity:1,x:0,duration:.42,ease:'power3.out'},'>-.04')
        .to(badItems[1],{boxShadow:'0 10px 30px rgba(250,82,82,.12)',duration:.28},'<')
        .to(badItems[2],{opacity:1,x:0,duration:.42,ease:'power3.out'},'>-.04')
        .to(badItems[2],{boxShadow:'0 10px 30px rgba(250,82,82,.12)',duration:.28},'<')
        .addLabel('cue3')
        .to(s.querySelector('.lane.good'),{opacity:1,y:0,duration:.58,ease:'power3.out'})
        .to(goodItems,{opacity:1,x:0,duration:.38,stagger:.075,ease:'power3.out'},'<+.12')
        .to(s.querySelectorAll('.lane'),{y:-2,duration:.34,ease:'sine.inOut'})
        .to(s.querySelectorAll('.lane'),{y:0,duration:.34,ease:'sine.inOut'});
    }
    if(i===2){
      const resources=[...s.querySelectorAll('.resource')];
      const cards=[...s.querySelectorAll('.runtime-card')];
      const events=[...s.querySelectorAll('.event')];
      tl.addLabel('cue0',0)
        .to(s.querySelectorAll('.s3 .eyebrow,.s3 .headline'),{opacity:1,y:0,duration:.5,stagger:.08})
        .addLabel('cue1')
        .to(s.querySelector('.console'),{opacity:1,y:0,duration:.58,ease:'power3.out'})
        .to(s.querySelector('.rail'),{opacity:1,y:0,duration:.46},'<+.05')
        .to(s.querySelector('.activity'),{opacity:1,y:0,duration:.46},'<+.04')
        .to(resources[0],{opacity:1,y:0,duration:.34},'<+.08')
        .to(cards[0],{opacity:1,y:0,duration:.34},'<+.03')
        .to(events[0],{opacity:1,y:0,duration:.3},'<+.03')
        .to(resources[1],{opacity:1,y:0,duration:.34},'>-.05')
        .to(cards[1],{opacity:1,y:0,duration:.34},'<+.02')
        .to(events[1],{opacity:1,y:0,duration:.3},'<+.02')
        .to(resources[2],{opacity:1,y:0,duration:.34},'>-.05')
        .to(cards[2],{opacity:1,y:0,duration:.34},'<+.02')
        .to(events[2],{opacity:1,y:0,duration:.3},'<+.02')
        .to(resources[3],{opacity:1,y:0,duration:.34},'>-.05')
        .to(cards[3],{opacity:1,y:0,duration:.34},'<+.02')
        .to(events[3],{opacity:1,y:0,duration:.3},'<+.02')
        .addLabel('cue2')
        .to(s.querySelector('.core-ring'),{opacity:1,scale:1,duration:.48,ease:'power3.out'})
        .to(s.querySelectorAll('.runtime-card'),{borderColor:'rgba(34,139,230,.20)',duration:.45,stagger:.04},'<');
    }
    if(i===3){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.s4 .eyebrow,.s4 .headline'),{opacity:1,y:0,duration:.55,stagger:.1}).to(s.querySelector('.prompt-card'),{opacity:1,y:0,duration:.65},'<+.12')
        .addLabel('cue1').to(s.querySelector('.prompt-orb'),{opacity:1,scale:1,duration:.42}).to(s.querySelector('.arrow-path'),{drawSVG:'100%',duration:.75,ease:'power2.inOut'},'<')
        .addLabel('cue2').to(s.querySelector('.prompt-orb'),{motionPath:{path:s.querySelector('.arrow-path'),align:s.querySelector('.arrow-path'),alignOrigin:[.5,.5]},duration:1.05,ease:'power2.inOut'})
        .addLabel('cue3').to(s.querySelector('.control-plane'),{opacity:1,y:0,duration:.7}).to(s.querySelectorAll('.cp-item'),{opacity:1,y:0,duration:.4,stagger:.09},'<+.15')
        .addLabel('cue4').to(s.querySelector('.control-bottom'),{opacity:1,y:0,duration:.5});
    }
    if(i===4){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.s5 .eyebrow,.s5 .headline'),{opacity:1,y:0,duration:.55,stagger:.1})
        .addLabel('cue1').to(s.querySelector('.research-board'),{opacity:1,y:0,duration:.68}).to(s.querySelector('.side-case'),{opacity:1,y:0,duration:.6},'<+.1').to(s.querySelector('.big-number'),{opacity:1,scale:1,duration:.55,ease:'back.out(1.2)'},'<')
        .addLabel('cue2').to(s.querySelectorAll('.pipe'),{opacity:1,y:0,duration:.38,stagger:.08}).to(s.querySelectorAll('.row:not(.head)'),{opacity:1,y:0,duration:.32,stagger:.055},'<+.15')
        .addLabel('cue3').to(s.querySelectorAll('.loop-step'),{opacity:1,y:0,duration:.4,stagger:.08})
        .addLabel('cue4').to(s.querySelectorAll('.row:not(.head) .bar i'),{width:(idx)=>`${65+(idx%4)*8}%`,duration:.5,stagger:.04,ease:'power2.out'})
        .addLabel('cue5').to(s.querySelector('.big-number'),{color:'#1c7ed6',scale:1.04,duration:.32}).to(s.querySelector('.big-number'),{scale:1,duration:.34});
    }
    if(i===5){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.summary .eyebrow,.summary .headline,.summary .subhead'),{opacity:1,y:0,duration:.58,stagger:.12}).to(s.querySelectorAll('.pillar'),{opacity:1,y:0,duration:.44,stagger:.09},'<+.18').to(s.querySelector('.merge'),{opacity:1,y:0,duration:.48},'<+.25').to(s.querySelector('.reliable'),{opacity:1,y:0,duration:.55,ease:'back.out(1.25)'},'<+.12')
        .addLabel('cue1').to(s.querySelectorAll('.pillar'),{borderColor:'rgba(20,184,166,.28)',duration:.5,stagger:.08});
    }
    return tl;
  }

  function buildAll(){timelines.forEach(t=>t.kill());timelines=scenes.map((_,i)=>buildTimeline(i))}
  function showScene(i,{preview=false}={}){
    scenes.forEach((s,n)=>{killAmbient(s);s.classList.toggle('active',n===i)});current=i;cueCursor=-1;setProgressDots();
    timelines.forEach((t,n)=>{t.pause(0);if(n!==i)initialState(n)});initialState(i);
    narration.pause();narration.currentTime=0;narration.src=audioSrc();
    if(preview){timelines[i].progress(1);startAmbient(i)}
  }

  /* Critical sync rule: cue N drives the animation block BETWEEN cueN and cueN+1.
   * In v9 tweenTo(cueN) stopped at the START of the block, causing one-sentence visual lag.
   * v10 instead moves immediately toward the END of the current sentence's visual block.
   */
  function advanceCue(idx){
    if(idx<=cueCursor)return;
    cueCursor=idx;
    const tl=timelines[current], cues=cueData();
    const nextLabel=`cue${idx+1}`;
    const target=tl.labels[nextLabel]!==undefined?nextLabel:tl.duration();
    const cue=cues[idx]||{};
    const syncDuration=reduced?0.01:Math.max(.5,Math.min(1.35,(Number(cue.duration)||2)*.24));
    tl.tweenTo(target,{duration:syncDuration,ease:'power2.out',overwrite:true});
  }
  function playCurrent(){cueCursor=-1;timelines[current].pause(0);initialState(current);narration.src=audioSrc();narration.currentTime=0;narration.play().catch(e=>console.warn(e));advanceCue(0)}
  narration.ontimeupdate=()=>{const cues=cueData();for(let i=0;i<cues.length;i++)if(narration.currentTime>=Math.max(0,cues[i].start-.08))advanceCue(i)};
  narration.onended=()=>{timelines[current].progress(1);startAmbient(current);if(mode==='auto'&&current<scenes.length-1){showScene(current+1);requestAnimationFrame(playCurrent)}else if(mode==='auto'&&current===scenes.length-1){fadeBgm();if(recorder?.state==='recording')stopRecording()}};

  function setMode(m){mode=m;modeManual.classList.toggle('on',m==='manual');modeAuto.classList.toggle('on',m==='auto')}
  modeManual.onclick=()=>setMode('manual');modeAuto.onclick=()=>setMode('auto');
  prevBtn.onclick=()=>showScene(Math.max(0,current-1),{preview:true});nextBtn.onclick=()=>showScene(Math.min(scenes.length-1,current+1),{preview:true});speakBtn.onclick=playCurrent;
  stage.onclick=e=>{if(mode==='manual'&&!e.target.closest('button,input,select'))showScene(Math.min(scenes.length-1,current+1),{preview:true})};
  addEventListener('keydown',e=>{if(e.key==='ArrowRight')showScene(Math.min(scenes.length-1,current+1),{preview:true});if(e.key==='ArrowLeft')showScene(Math.max(0,current-1),{preview:true})});

  const musicMap={none:'',tech:'./public/audio/bgm/short-plingy-loop.ogg',calm:'./public/audio/bgm/calm-loop.mp3',other:'./public/audio/bgm/other-center.ogg'};
  function setMusic(src){bgm.pause();bgm.currentTime=0;if(src){bgm.src=src;bgm.loop=true;bgm.volume=Number(musicVolume.value)/100;bgm.play().catch(()=>{})}}
  musicSelect.onchange=()=>{if(musicSelect.value==='upload'){musicUpload.click();return}setMusic(musicMap[musicSelect.value]||'')};
  musicUpload.onchange=()=>{const f=musicUpload.files?.[0];if(!f)return;if(objectMusicUrl)URL.revokeObjectURL(objectMusicUrl);objectMusicUrl=URL.createObjectURL(f);musicSelect.value='upload';setMusic(objectMusicUrl)};
  musicVolume.oninput=()=>bgm.volume=Number(musicVolume.value)/100;
  function fadeBgm(){if(!bgm.src)return;const from=bgm.volume,start=performance.now();const tick=t=>{const p=Math.min(1,(t-start)/700);bgm.volume=from*(1-p);if(p<1)requestAnimationFrame(tick);else bgm.pause()};requestAnimationFrame(tick)}

  async function startRecording(){
    if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia){recordStatus.textContent='需 HTTPS';return}
    try{recordStatus.textContent='等待授权';capture=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:60},audio:true,preferCurrentTab:true});chunks=[];recorder=new MediaRecorder(capture,{mimeType:MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm'});recorder.ondataavailable=e=>e.data.size&&chunks.push(e.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:'video/webm'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='project6-harness-chapter1.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);recordStatus.textContent='已下载';recordBtn.textContent='● 一键录制';recordBtn.classList.remove('live');capture?.getTracks().forEach(t=>t.stop())};recorder.start(1000);recordBtn.textContent='■ 停止并下载';recordBtn.classList.add('live');recordStatus.textContent='正在录制';setMode('auto');showScene(0);requestAnimationFrame(playCurrent)}catch(e){recordStatus.textContent=e?.name==='NotAllowedError'?'已取消':'录制失败'}
  }
  function stopRecording(){if(recorder?.state==='recording')recorder.stop()}
  recordBtn.onclick=()=>recorder?.state==='recording'?stopRecording():startRecording();

  loadData().then(()=>{buildAll();showScene(0,{preview:true})}).catch(e=>{console.error(e);recordStatus.textContent='资源加载失败'});
})();