/* Project6 Harness Chapter 1 — Timeline Controller v9
 * Garden Step boundary is sacred: GSAP never changes Step.
 * SentenceBoundary only advances animation inside current Step.
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
      const paths=s.querySelectorAll('.orbit-line'), dot=s.querySelector('.signal-dot');
      if(paths[0]&&dot)a.push(gsap.to(dot,{motionPath:{path:paths[0],align:paths[0],alignOrigin:[.5,.5]},duration:3.6,repeat:-1,ease:'none'}));
      a.push(gsap.to(s.querySelector('.model-core'),{boxShadow:'0 28px 78px rgba(20,184,166,.22)',duration:2.4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    }
    if(i===1){
      s.querySelectorAll('.flow-rail i').forEach((el,n)=>a.push(gsap.fromTo(el,{xPercent:-120},{xPercent:340,duration:3.1+n*.35,repeat:-1,repeatDelay:.5+n*.25,ease:'none'})));
    }
    if(i===2){
      s.querySelectorAll('.runtime-card .mini i').forEach((el,n)=>a.push(gsap.fromTo(el,{xPercent:-110},{xPercent:90,duration:2.6+n*.3,repeat:-1,repeatDelay:.5,ease:'none'})));
      a.push(gsap.to(s.querySelector('.core-ring'),{y:-3,duration:2,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    }
    if(i===3){a.push(gsap.to(s.querySelector('.control-bottom'),{boxShadow:'0 15px 38px rgba(20,184,166,.16)',duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut'}))}
    if(i===4){
      s.querySelectorAll('.row:not(.head) .bar i').forEach((el,n)=>a.push(gsap.to(el,{width:`${58+(n%4)*9}%`,duration:2+n*.16,repeat:-1,yoyo:true,ease:'sine.inOut'})));
      a.push(gsap.to(s.querySelectorAll('.loop-step i'),{opacity:.28,duration:.55,stagger:.22,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    }
    if(i===5){a.push(gsap.to(s.querySelector('.reliable'),{boxShadow:'0 24px 58px rgba(20,184,166,.26)',duration:2.5,yoyo:true,repeat:-1,ease:'sine.inOut'}))}
    ambient.set(s,a);
  }

  function initialState(i){
    const s=scenes[i];
    if(i===0){gsap.set(s.querySelectorAll('.question-pill,.copy .eyebrow,.copy h1,.copy p,.system-card'),{opacity:0,y:24});gsap.set(s.querySelectorAll('.sat'),{opacity:0,scale:.97});gsap.set(s.querySelectorAll('.orbit-line'),{drawSVG:'0%'});gsap.set(s.querySelector('.signal-dot'),{opacity:0})}
    if(i===1){gsap.set(s.querySelectorAll('.s2 .eyebrow,.s2 .headline,.lane,.vs-badge'),{opacity:0,y:22});gsap.set(s.querySelectorAll('.stack-item'),{opacity:0,x:-18})}
    if(i===2){gsap.set(s.querySelectorAll('.s3 .eyebrow,.s3 .headline,.rail,.console,.activity'),{opacity:0,y:22});gsap.set(s.querySelectorAll('.resource,.runtime-card,.event'),{opacity:0,y:12});gsap.set(s.querySelector('.core-ring'),{opacity:0,scale:.97})}
    if(i===3){gsap.set(s.querySelectorAll('.s4 .eyebrow,.s4 .headline,.prompt-card,.control-plane'),{opacity:0,y:22});gsap.set(s.querySelector('.arrow-path'),{drawSVG:'0%'});gsap.set(s.querySelector('.prompt-orb'),{opacity:0,scale:.97});gsap.set(s.querySelectorAll('.cp-item'),{opacity:0,y:14});gsap.set(s.querySelector('.control-bottom'),{opacity:0,y:12})}
    if(i===4){gsap.set(s.querySelectorAll('.s5 .eyebrow,.s5 .headline,.research-board,.side-case'),{opacity:0,y:22});gsap.set(s.querySelectorAll('.pipe,.row:not(.head),.loop-step'),{opacity:0,y:12});gsap.set(s.querySelector('.big-number'),{opacity:0,scale:.96})}
    if(i===5){gsap.set(s.querySelectorAll('.summary .eyebrow,.summary .headline,.summary .subhead,.pillar,.merge,.reliable'),{opacity:0,y:20});gsap.set(s.querySelectorAll('.merge-line:after'),{})}
  }

  function buildTimeline(i){
    const s=scenes[i], tl=gsap.timeline({paused:true,defaults:{ease:'power3.out'}}); initialState(i);
    if(i===0){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.question-pill,.copy .eyebrow'),{opacity:1,y:0,duration:.45,stagger:.08})
        .to(s.querySelector('.copy h1'),{opacity:1,y:0,duration:.72},'<+.08')
        .to(s.querySelector('.copy p'),{opacity:1,y:0,duration:.55},'<+.18')
        .addLabel('cue1').to(s.querySelector('.system-card'),{opacity:1,y:0,duration:.75})
        .to(s.querySelector('.model-core'),{scale:1,duration:.55},'<+.08')
        .to(s.querySelectorAll('.sat'),{opacity:1,scale:1,duration:.48,stagger:.1},'<+.15')
        .to(s.querySelectorAll('.orbit-line'),{drawSVG:'100%',duration:1.15,stagger:.1,ease:'power2.inOut'},'<+.05')
        .to(s.querySelector('.signal-dot'),{opacity:1,duration:.2},'<+.45')
        .addLabel('cue2').to(s.querySelector('.model-core'),{boxShadow:'0 28px 80px rgba(239,111,114,.22)',duration:.42})
        .addLabel('cue3').to(s.querySelector('.model-core'),{boxShadow:'0 28px 80px rgba(20,184,166,.18)',duration:.55});
    }
    if(i===1){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.s2 .eyebrow,.s2 .headline'),{opacity:1,y:0,duration:.55,stagger:.12})
        .to(s.querySelector('.lane.bad'),{opacity:1,y:0,duration:.68},'<+.12')
        .to(s.querySelectorAll('.lane.bad .stack-item'),{opacity:1,x:0,duration:.44,stagger:.1},'<+.18')
        .addLabel('cue1').to(s.querySelector('.vs-badge'),{opacity:1,y:0,scale:1.04,duration:.38,ease:'back.out(1.4)'})
        .addLabel('cue2').to(s.querySelector('.lane.good'),{opacity:1,y:0,duration:.68})
        .to(s.querySelectorAll('.lane.good .stack-item'),{opacity:1,x:0,duration:.44,stagger:.1},'<+.15')
        .addLabel('cue3').to(s.querySelectorAll('.lane'),{y:-4,duration:.5,ease:'power2.inOut'}).to(s.querySelectorAll('.lane'),{y:0,duration:.5,ease:'power2.inOut'});
    }
    if(i===2){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.s3 .eyebrow,.s3 .headline'),{opacity:1,y:0,duration:.55,stagger:.1})
        .addLabel('cue1').to(s.querySelector('.console'),{opacity:1,y:0,duration:.68})
        .to(s.querySelector('.rail'),{opacity:1,y:0,duration:.55},'<+.1').to(s.querySelector('.activity'),{opacity:1,y:0,duration:.55},'<+.08')
        .to(s.querySelectorAll('.resource'),{opacity:1,y:0,duration:.38,stagger:.07},'<+.08')
        .to(s.querySelectorAll('.runtime-card'),{opacity:1,y:0,duration:.38,stagger:.08},'<+.05')
        .to(s.querySelectorAll('.event'),{opacity:1,y:0,duration:.34,stagger:.08},'<+.1')
        .addLabel('cue2').to(s.querySelector('.core-ring'),{opacity:1,scale:1,duration:.55,ease:'back.out(1.3)'});
    }
    if(i===3){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.s4 .eyebrow,.s4 .headline'),{opacity:1,y:0,duration:.55,stagger:.1})
        .to(s.querySelector('.prompt-card'),{opacity:1,y:0,duration:.65},'<+.12')
        .addLabel('cue1').to(s.querySelector('.prompt-orb'),{opacity:1,scale:1,duration:.42}).to(s.querySelector('.arrow-path'),{drawSVG:'100%',duration:.75,ease:'power2.inOut'},'<')
        .addLabel('cue2').to(s.querySelector('.prompt-orb'),{motionPath:{path:s.querySelector('.arrow-path'),align:s.querySelector('.arrow-path'),alignOrigin:[.5,.5]},duration:1.05,ease:'power2.inOut'})
        .addLabel('cue3').to(s.querySelector('.control-plane'),{opacity:1,y:0,duration:.7}).to(s.querySelectorAll('.cp-item'),{opacity:1,y:0,duration:.4,stagger:.09},'<+.15')
        .addLabel('cue4').to(s.querySelector('.control-bottom'),{opacity:1,y:0,duration:.5});
    }
    if(i===4){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.s5 .eyebrow,.s5 .headline'),{opacity:1,y:0,duration:.55,stagger:.1})
        .addLabel('cue1').to(s.querySelector('.research-board'),{opacity:1,y:0,duration:.68}).to(s.querySelector('.side-case'),{opacity:1,y:0,duration:.6},'<+.1')
        .to(s.querySelector('.big-number'),{opacity:1,scale:1,duration:.55,ease:'back.out(1.2)'},'<')
        .addLabel('cue2').to(s.querySelectorAll('.pipe'),{opacity:1,y:0,duration:.38,stagger:.08}).to(s.querySelectorAll('.row:not(.head)'),{opacity:1,y:0,duration:.32,stagger:.055},'<+.15')
        .addLabel('cue3').to(s.querySelectorAll('.loop-step'),{opacity:1,y:0,duration:.4,stagger:.08})
        .addLabel('cue4').to(s.querySelectorAll('.row:not(.head) .bar i'),{width:(idx)=>`${65+(idx%4)*8}%`,duration:.5,stagger:.04,ease:'power2.out'})
        .addLabel('cue5').to(s.querySelector('.big-number'),{color:'#0f8f82',scale:1.04,duration:.32}).to(s.querySelector('.big-number'),{scale:1,duration:.34});
    }
    if(i===5){
      tl.addLabel('cue0',0).to(s.querySelectorAll('.summary .eyebrow,.summary .headline,.summary .subhead'),{opacity:1,y:0,duration:.58,stagger:.12})
        .to(s.querySelectorAll('.pillar'),{opacity:1,y:0,duration:.44,stagger:.09},'<+.18')
        .to(s.querySelector('.merge'),{opacity:1,y:0,duration:.48},'<+.25')
        .to(s.querySelector('.reliable'),{opacity:1,y:0,duration:.55,ease:'back.out(1.25)'},'<+.12')
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
  function advanceCue(idx){if(idx<=cueCursor)return;cueCursor=idx;const label=`cue${idx}`;if(timelines[current].labels[label]!==undefined){timelines[current].tweenTo(label,{duration:.48,ease:'power2.out',onComplete:()=>{if(idx===cueData().length-1)startAmbient(current)}})}}
  function playCurrent(){cueCursor=-1;timelines[current].pause(0);initialState(current);narration.src=audioSrc();narration.currentTime=0;narration.play().catch(e=>console.warn(e));advanceCue(0)}
  narration.ontimeupdate=()=>{const cues=cueData();for(let i=0;i<cues.length;i++)if(narration.currentTime>=cues[i].start-.03)advanceCue(i)};
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
