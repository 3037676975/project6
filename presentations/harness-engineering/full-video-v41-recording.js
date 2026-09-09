/* Project6 · Harness Engineering · v49 recorder
 * Policy: first enter fullscreen, then explicitly start capture from fullscreen gate.
 * No Region Crop. The fullscreen 16:9 stage is captured as the current tab.
 * Reject capture below 1920x1080 so low-resolution files are never mislabeled as 1080P.
 */
(() => {
  const stage=document.getElementById('stage');
  const stageFrame=document.querySelector('.stage-frame');
  const recordBtn=document.getElementById('recordBtn');
  const fsRecordGate=document.getElementById('fsRecordGate');
  const fsRecordStart=document.getElementById('fsRecordStart');
  const soundBtn=document.getElementById('soundBtn');
  const recordMeta=document.getElementById('recordMeta');
  const recordTimer=document.getElementById('recordTimer');
  const status=document.getElementById('status');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const scrub=document.getElementById('scrub');
  const narration=document.getElementById('narration');
  if(!stage||!stageFrame||!recordBtn||!fsRecordGate||!fsRecordStart||!recordMeta||!window.MediaRecorder)return;

  const SOUND_KEY='project6.harness.sound.enabled';
  let soundEnabled=localStorage.getItem(SOUND_KEY)!=='0';
  let recorder=null,capture=null,chunks=[],timerId=null,stopObserver=null,startedAt=0,phase='idle';
  let outputMime='',outputExt='webm',oldTitle=document.title;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const nextFrame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const clock=ms=>{const t=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};

  function applySoundUI(){
    if(narration)narration.muted=!soundEnabled;
    if(soundBtn){soundBtn.textContent=soundEnabled?'🔊 声音开':'🔇 声音关';soundBtn.setAttribute('aria-pressed',soundEnabled?'true':'false');soundBtn.classList.toggle('primary',soundEnabled)}
  }
  applySoundUI();
  soundBtn?.addEventListener('click',()=>{if(phase!=='idle')return;soundEnabled=!soundEnabled;localStorage.setItem(SOUND_KEY,soundEnabled?'1':'0');applySoundUI();recordMeta.textContent=soundEnabled?'V49 READY · 先全屏再录制 · SOUND ON':'V49 READY · 先全屏再录制 · MUTED'});

  function setUI(live,text,warn=false){recordBtn.classList.toggle('live',live);recordMeta.classList.toggle('live',live);recordMeta.classList.toggle('warn',warn);recordBtn.textContent=live?'■ 停止录制':'● 一键录制';recordMeta.textContent=text;stage.dataset.recording=live?'true':'false'}
  function stopTimer(){if(timerId)clearInterval(timerId);timerId=null}
  function startTimer(){stopTimer();recordTimer?.classList.add('live');if(recordTimer)recordTimer.textContent='REC 00:00:00';timerId=setInterval(()=>{const v=clock(Date.now()-startedAt);if(recordTimer)recordTimer.textContent=`REC ${v}`;document.title=`● REC ${v} · Project6 v49`},250)}
  function resetTimer(ms=0){stopTimer();recordTimer?.classList.remove('live');if(recordTimer)recordTimer.textContent=ms?`DONE ${clock(ms)}`:'REC 00:00:00';document.title=oldTitle.replace(/v\d+/gi,'v49')}
  function stopTracks(){try{capture?.getTracks().forEach(t=>{try{t.stop()}catch(_){}})}catch(_){}}
  function cleanup(){stopObserver?.disconnect();stopObserver=null;stopTracks();capture=null;recorder=null;phase='idle';stage.dataset.recording='false';fsRecordGate.classList.remove('armed','capturing')}
  function chooseMime(){for(const [mime,ext] of [['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],['video/mp4','mp4'],['video/webm;codecs=vp9,opus','webm'],['video/webm;codecs=vp8,opus','webm'],['video/webm','webm']])if(MediaRecorder.isTypeSupported(mime))return{mime,ext};return{mime:'',ext:'webm'}}
  function realCaptureInfo(track){const s=track?.getSettings?.()||{};return{width:Number(s.width||0),height:Number(s.height||0),fps:Math.round(Number(s.frameRate||0))}}
  async function resetPlayer(){pauseBtn?.click();if(scrub){scrub.value='0';scrub.dispatchEvent(new Event('input',{bubbles:true}));scrub.dispatchEvent(new Event('change',{bubbles:true}))}if(narration){try{narration.pause();narration.currentTime=0;narration.muted=!soundEnabled}catch(_){}}await nextFrame();await sleep(180)}

  async function enterFullscreenGate(){
    if(!window.isSecureContext)throw new Error('请使用 HTTPS 地址打开 Project6。');
    oldTitle=document.title;
    if(document.fullscreenElement!==stageFrame){
      try{await stageFrame.requestFullscreen()}catch(err){throw new Error('请先允许浏览器进入全屏，然后再开始录制。')}
    }
    phase='armed';
    fsRecordGate.classList.add('armed');
    setUI(false,'已全屏 · 点击画面中央“开始 1080P 高清录制”');
    if(status)status.textContent='FULLSCREEN READY · V49';
  }

  async function startCaptureFromFullscreen(){
    if(phase!=='armed')return;
    if(document.fullscreenElement!==stageFrame)throw new Error('当前没有处于视频全屏模式，请重新点击“一键录制”。');
    if(!navigator.mediaDevices?.getDisplayMedia)throw new Error('当前浏览器不支持标签页录制，请使用最新版 Chrome / Edge。');
    phase='starting';fsRecordGate.classList.add('capturing');
    setUI(true,'请选择“当前标签页”并勾选分享标签页音频');

    capture=await navigator.mediaDevices.getDisplayMedia({
      video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:60,max:60}},
      audio:soundEnabled,
      preferCurrentTab:true,
      selfBrowserSurface:'include',
      surfaceSwitching:'exclude',
      systemAudio:'exclude'
    });
    const track=capture.getVideoTracks()[0];
    if(!track)throw new Error('浏览器没有返回视频轨道。');
    track.addEventListener('ended',()=>stop('浏览器停止共享'),{once:true});
    const info=realCaptureInfo(track);
    if(info.width&&info.height&&(info.width<1920||info.height<1080)){
      stopTracks();capture=null;phase='armed';fsRecordGate.classList.remove('capturing');
      throw new Error(`当前实际捕获只有 ${info.width}×${info.height}，未达到 1920×1080。请把浏览器放到全屏/F11，并确保显示器输出至少 1920×1080 后再录。`);
    }

    await resetPlayer();
    const chosen=chooseMime();outputMime=chosen.mime||'video/webm';outputExt=chosen.ext;chunks=[];
    const opts=chosen.mime?{mimeType:chosen.mime,videoBitsPerSecond:18000000,audioBitsPerSecond:192000}:{videoBitsPerSecond:18000000};
    recorder=new MediaRecorder(capture,opts);
    recorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data)});
    recorder.addEventListener('stop',finish,{once:true});
    recorder.addEventListener('error',e=>{console.error(e);stop('Recorder Error')});
    recorder.start();phase='recording';startedAt=Date.now();startTimer();
    setUI(true,`${outputExt.toUpperCase()} · ${info.width||'?'}×${info.height||'?'} · ${info.fps||'?'}fps · FULLSCREEN · ${capture.getAudioTracks().length?'SOUND ON':'MUTED'}`);
    if(status)status.textContent='RECORDING · V49 · 1080P';
    playBtn?.click();
    if(status){stopObserver=new MutationObserver(()=>{if(status.textContent.trim()==='END'&&phase==='recording')setTimeout(()=>stop('END'),500)});stopObserver.observe(status,{childList:true,characterData:true,subtree:true})}
  }

  async function finish(){
    const elapsed=Math.max(1000,Date.now()-startedAt),blob=chunks.length?new Blob(chunks,{type:outputMime||recorder?.mimeType||'video/webm'}):null;
    if(!blob||blob.size<16384){resetTimer();cleanup();setUI(false,'录制没有产生有效数据',true);alert('录制没有产生有效视频数据，请重试。');return}
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`project6-harness-v49-${new Date().toISOString().replace(/[:.]/g,'-')}.${outputExt}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    resetTimer(elapsed);if(status)status.textContent=`RECORDED ${outputExt.toUpperCase()} · ${clock(elapsed)} · ${(blob.size/1024/1024).toFixed(1)}MB`;cleanup();setUI(false,`${outputExt.toUpperCase()} · LOCAL DOWNLOAD · ${soundEnabled?'SOUND ON':'MUTED'}`)
  }

  async function stop(reason='manual'){
    if(phase==='idle'||phase==='armed'){cleanup();setUI(false,'录制已取消');return}
    phase='stopping';pauseBtn?.click();stopObserver?.disconnect();stopObserver=null;
    try{if(recorder&&recorder.state!=='inactive'){try{recorder.requestData()}catch(_){}await sleep(100);if(recorder.state!=='inactive')recorder.stop()}else{stopTracks();cleanup();resetTimer();setUI(false,'录制已停止')}}catch(err){console.error(err);stopTracks();cleanup();resetTimer();setUI(false,'录制已强制停止',true)}
  }

  recordBtn.addEventListener('click',async()=>{
    if(phase==='recording'||phase==='starting'||phase==='stopping'){await stop('手动停止');return}
    try{await enterFullscreenGate()}catch(err){console.error(err);cleanup();setUI(false,'录制未启动',true);alert(err?.message||'无法进入全屏录制模式')}
  });
  fsRecordStart.addEventListener('click',async()=>{
    try{await startCaptureFromFullscreen()}catch(err){console.error(err);stopTracks();if(phase!=='armed')phase='armed';fsRecordGate.classList.remove('capturing');fsRecordGate.classList.add('armed');setUI(false,'录制未启动',true);if(status)status.textContent=err?.message||'录制失败';alert((err?.message||'录制失败')+'\n\n请在共享弹窗中选择“当前标签页”。')}
  });

  document.addEventListener('fullscreenchange',()=>{
    document.body.classList.toggle('p6-fullscreen',!!document.fullscreenElement);
    if(!document.fullscreenElement){
      fsRecordGate.classList.remove('armed','capturing');
      if(phase==='recording'||phase==='starting')stop('退出全屏');
      else if(phase==='armed'){phase='idle';setUI(false,'V49 READY · 先全屏再录制')}
    }
  });
  window.addEventListener('beforeunload',stopTracks);
  resetTimer();setUI(false,soundEnabled?'V49 READY · 先全屏再录制 · SOUND ON':'V49 READY · 先全屏再录制 · MUTED');
})();