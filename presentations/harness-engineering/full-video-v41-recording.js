/* Project6 · Harness Engineering · v48 recorder
 * Strategy: DO NOT Region-Crop the DOM capture.
 * One click requests fullscreen + current-tab capture from the same user gesture.
 * Once permission is granted, the 16:9 stage-frame is the fullscreen tab content,
 * so the recorder captures the real composited animation instead of a cropped GPU layer.
 */
(() => {
  const stage=document.getElementById('stage');
  const stageFrame=document.querySelector('.stage-frame');
  const recordBtn=document.getElementById('recordBtn');
  const soundBtn=document.getElementById('soundBtn');
  const recordMeta=document.getElementById('recordMeta');
  const recordTimer=document.getElementById('recordTimer');
  const status=document.getElementById('status');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const scrub=document.getElementById('scrub');
  const narration=document.getElementById('narration');
  if(!stage||!stageFrame||!recordBtn||!recordMeta||!window.MediaRecorder)return;

  const SOUND_KEY='project6.harness.sound.enabled';
  let soundEnabled=localStorage.getItem(SOUND_KEY)!=='0';
  let recorder=null,capture=null,chunks=[],timerId=null,stopObserver=null,startedAt=0,phase='idle';
  let outputMime='',outputExt='webm',oldTitle=document.title;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const nextFrame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const clock=ms=>{const t=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};

  function syncSoundUI(){
    if(narration)narration.muted=!soundEnabled;
    if(soundBtn){soundBtn.textContent=soundEnabled?'🔊 声音开':'🔇 声音关';soundBtn.setAttribute('aria-pressed',soundEnabled?'true':'false';);soundBtn.classList.toggle('primary',soundEnabled)}
  }

  // Keep this separate to avoid syntax-sensitive inline mutation above.
  function applySoundUI(){
    if(narration)narration.muted=!soundEnabled;
    if(soundBtn){
      soundBtn.textContent=soundEnabled?'🔊 声音开':'🔇 声音关';
      soundBtn.setAttribute('aria-pressed',soundEnabled?'true':'false');
      soundBtn.classList.toggle('primary',soundEnabled);
    }
  }
  applySoundUI();
  soundBtn?.addEventListener('click',()=>{
    if(phase!=='idle')return;
    soundEnabled=!soundEnabled;
    localStorage.setItem(SOUND_KEY,soundEnabled?'1':'0');
    applySoundUI();
    recordMeta.textContent=soundEnabled?'V48 READY · SOUND ON':'V48 READY · MUTED';
  });

  function setUI(live,text,warn=false){
    recordBtn.classList.toggle('live',live);
    recordMeta.classList.toggle('live',live);
    recordMeta.classList.toggle('warn',warn);
    recordBtn.textContent=live?'■ 停止录制':'● 一键录制';
    recordMeta.textContent=text;
    stage.dataset.recording=live?'true':'false';
  }
  function stopTimer(){if(timerId)clearInterval(timerId);timerId=null}
  function startTimer(){
    stopTimer();
    recordTimer?.classList.add('live');
    if(recordTimer)recordTimer.textContent='REC 00:00:00';
    timerId=setInterval(()=>{
      const value=clock(Date.now()-startedAt);
      if(recordTimer)recordTimer.textContent=`REC ${value}`;
      document.title=`● REC ${value} · Project6 v48`;
    },250);
  }
  function resetTimer(ms=0){
    stopTimer();
    recordTimer?.classList.remove('live');
    if(recordTimer)recordTimer.textContent=ms?`DONE ${clock(ms)}`:'REC 00:00:00';
    document.title=oldTitle.replace(/v\d+/gi,'v48');
  }
  function stopTracks(){try{capture?.getTracks().forEach(t=>{try{t.stop()}catch(_){}})}catch(_){}}
  async function leaveFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen()}catch(_){}}
  function cleanup(){
    stopObserver?.disconnect();stopObserver=null;
    stopTracks();capture=null;recorder=null;phase='idle';stage.dataset.recording='false';
  }
  function chooseMime(){
    const candidates=[
      ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],
      ['video/mp4;codecs=avc1,mp4a.40.2','mp4'],
      ['video/mp4','mp4'],
      ['video/webm;codecs=vp9,opus','webm'],
      ['video/webm;codecs=vp8,opus','webm'],
      ['video/webm','webm']
    ];
    for(const [mime,ext] of candidates)if(MediaRecorder.isTypeSupported(mime))return{mime,ext};
    return{mime:'',ext:'webm'};
  }
  async function resetPlayer(){
    pauseBtn?.click();
    if(scrub){scrub.value='0';scrub.dispatchEvent(new Event('input',{bubbles:true}));scrub.dispatchEvent(new Event('change',{bubbles:true}))}
    if(narration){try{narration.pause();narration.currentTime=0;narration.muted=!soundEnabled}catch(_){}}
    await nextFrame();await sleep(180);
  }
  function realCaptureInfo(track){
    const s=track?.getSettings?.()||{};
    return{width:Number(s.width||0),height:Number(s.height||0),fps:Math.round(Number(s.frameRate||0))};
  }

  async function finish(){
    const elapsed=Math.max(1000,Date.now()-startedAt);
    const blob=chunks.length?new Blob(chunks,{type:outputMime||recorder?.mimeType||'video/webm'}):null;
    if(!blob||blob.size<16384){
      resetTimer();cleanup();await leaveFullscreen();setUI(false,'录制没有产生有效数据',true);alert('录制没有产生有效视频数据，请重试。');return;
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`project6-harness-v48-${new Date().toISOString().replace(/[:.]/g,'-')}.${outputExt}`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    resetTimer(elapsed);
    if(status)status.textContent=`RECORDED ${outputExt.toUpperCase()} · ${clock(elapsed)} · ${(blob.size/1024/1024).toFixed(1)}MB`;
    cleanup();await leaveFullscreen();setUI(false,`${outputExt.toUpperCase()} · LOCAL DOWNLOAD · ${soundEnabled?'SOUND ON':'MUTED'}`);
  }

  async function stop(reason='manual'){
    if(phase==='idle')return;
    phase='stopping';
    pauseBtn?.click();
    stopObserver?.disconnect();stopObserver=null;
    try{
      if(recorder&&recorder.state!=='inactive'){
        try{recorder.requestData()}catch(_){}
        await sleep(100);
        if(recorder.state!=='inactive')recorder.stop();
      }else{
        stopTracks();cleanup();resetTimer();await leaveFullscreen();setUI(false,'录制已停止');
      }
    }catch(err){
      console.error(err);stopTracks();cleanup();resetTimer();await leaveFullscreen();setUI(false,'录制已强制停止',true);
    }
  }

  async function start(){
    if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia)throw new Error('请使用 HTTPS 地址和最新版 Chrome / Edge。');
    if(phase!=='idle')return;
    phase='starting';
    oldTitle=document.title;
    setUI(true,'正在进入全屏录制模式…');

    // Both gated APIs are invoked from the same click gesture.
    let fsPromise=Promise.resolve();
    try{if(stageFrame.requestFullscreen)fsPromise=stageFrame.requestFullscreen()}catch(_){ }
    const capturePromise=navigator.mediaDevices.getDisplayMedia({
      video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:60,max:60}},
      audio:soundEnabled,
      preferCurrentTab:true,
      selfBrowserSurface:'include',
      surfaceSwitching:'exclude',
      systemAudio:'exclude'
    });
    try{await fsPromise}catch(_){ }
    capture=await capturePromise;

    const track=capture.getVideoTracks()[0];
    if(!track)throw new Error('浏览器没有返回视频轨道。');
    track.addEventListener('ended',()=>stop('浏览器停止共享'),{once:true});

    const info=realCaptureInfo(track);
    if(info.width&&info.height&&(info.width<1920||info.height<1080)){
      stopTracks();capture=null;phase='idle';await leaveFullscreen();
      throw new Error(`当前实际捕获只有 ${info.width}×${info.height}，不是 1080P。请把显示器/浏览器切到 1920×1080 或更高后重试。`);
    }

    await resetPlayer();
    const chosen=chooseMime();outputMime=chosen.mime||'video/webm';outputExt=chosen.ext;chunks=[];
    const opts=chosen.mime?{mimeType:chosen.mime,videoBitsPerSecond:16000000,audioBitsPerSecond:192000}:{videoBitsPerSecond:16000000};
    recorder=new MediaRecorder(capture,opts);
    recorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data)});
    recorder.addEventListener('stop',finish,{once:true});
    recorder.addEventListener('error',e=>{console.error(e);stop('Recorder Error')});
    recorder.start();
    phase='recording';startedAt=Date.now();startTimer();
    setUI(true,`${outputExt.toUpperCase()} · ${info.width||'?' }×${info.height||'?'} · ${info.fps||'?'}fps · FULL TAB/STAGE · ${capture.getAudioTracks().length?'SOUND ON':'MUTED'}`);
    if(status)status.textContent='RECORDING · V48 · FULLSCREEN';
    playBtn?.click();

    if(status){
      stopObserver=new MutationObserver(()=>{if(status.textContent.trim()==='END'&&phase==='recording')setTimeout(()=>stop('END'),500)});
      stopObserver.observe(status,{childList:true,characterData:true,subtree:true});
    }
  }

  recordBtn.addEventListener('click',async()=>{
    if(phase!=='idle'){await stop('手动停止');return;}
    try{await start()}catch(err){
      console.error(err);stopTracks();cleanup();resetTimer();await leaveFullscreen();setUI(false,'录制未启动',true);
      if(status)status.textContent=err?.message||'录制失败';
      alert((err?.message||'录制失败')+'\n\n请在浏览器弹窗里选择“当前标签页”。Project6 v48 不再裁剪画面，而是先把视频区铺满标签页后直接录制。');
    }
  });

  document.addEventListener('fullscreenchange',()=>{
    if(!document.fullscreenElement&&phase==='recording')stop('退出全屏');
  });
  window.addEventListener('beforeunload',stopTracks);
  resetTimer();setUI(false,soundEnabled?'V48 READY · FULLSCREEN RECORD · SOUND ON':'V48 READY · FULLSCREEN RECORD · MUTED');
})();