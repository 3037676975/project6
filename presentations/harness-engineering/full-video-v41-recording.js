/* Project6 · Harness Engineering · v47 recorder
 * Capture policy: one click -> browser permission picker -> current tab -> auto crop to #stage.
 * Browser security does NOT allow a web page to silently choose a screen/tab; the picker is mandatory.
 * v47 restores the proven v45 capture request, while keeping v46 sound toggle + hard stop state machine.
 */
(() => {
  const stage=document.getElementById('stage'), recordBtn=document.getElementById('recordBtn'), soundBtn=document.getElementById('soundBtn');
  const recordMeta=document.getElementById('recordMeta'), recordTimer=document.getElementById('recordTimer'), status=document.getElementById('status');
  const playBtn=document.getElementById('playBtn'), pauseBtn=document.getElementById('pauseBtn'), scrub=document.getElementById('scrub'), narration=document.getElementById('narration');
  if(!stage||!recordBtn||!recordMeta||!window.MediaRecorder)return;
  const SOUND_KEY='project6.harness.sound.enabled';
  let soundEnabled=localStorage.getItem(SOUND_KEY)!=='0', recorder=null, capture=null, chunks=[], stopObserver=null, timerId=null, startedAt=0, phase='idle', outputMime='', outputExt='webm';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const nextFrame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const clock=ms=>{const t=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};
  function soundUI(){if(narration)narration.muted=!soundEnabled;if(soundBtn){soundBtn.textContent=soundEnabled?'🔊 声音开':'🔇 声音关';soundBtn.setAttribute('aria-pressed',soundEnabled?'true':'false');soundBtn.classList.toggle('primary',soundEnabled)}}
  soundUI(); soundBtn?.addEventListener('click',()=>{soundEnabled=!soundEnabled;localStorage.setItem(SOUND_KEY,soundEnabled?'1':'0');soundUI();if(phase==='idle')recordMeta.textContent=soundEnabled?'V47 READY · SOUND ON':'V47 READY · MUTED'});
  function stopTimer(){if(timerId)clearInterval(timerId);timerId=null} function startTimer(){stopTimer();recordTimer?.classList.add('live');if(recordTimer)recordTimer.textContent='REC 00:00:00';timerId=setInterval(()=>{if(recordTimer)recordTimer.textContent=`REC ${clock(Date.now()-startedAt)}`},250)}
  function resetTimer(ms=0){stopTimer();recordTimer?.classList.remove('live');if(recordTimer)recordTimer.textContent=ms?`DONE ${clock(ms)}`:'REC 00:00:00'}
  function ui(live,text,warn=false){recordBtn.classList.toggle('live',live);recordMeta.classList.toggle('live',live);recordMeta.classList.toggle('warn',warn);recordBtn.textContent=live?'■ 停止录制':'● 一键录制';recordMeta.textContent=text;stage.dataset.recording=live?'true':'false'}
  function stopTracks(){try{capture?.getTracks().forEach(t=>{try{t.stop()}catch(_){}})}catch(_){}}
  function cleanup(){stopObserver?.disconnect();stopObserver=null;stopTracks();capture=null;recorder=null;phase='idle';stage.dataset.recording='false'}
  function chooseMime(){for(const [m,e] of [['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],['video/mp4','mp4'],['video/webm;codecs=vp9,opus','webm'],['video/webm;codecs=vp8,opus','webm'],['video/webm','webm']])if(MediaRecorder.isTypeSupported(m))return{mime:m,ext:e};return{mime:'',ext:'webm'}}
  async function unlockAudio(){if(!narration)return;try{const old=narration.muted;narration.muted=true;await narration.play();narration.pause();narration.currentTime=0;narration.muted=old}catch(_){}}
  async function requestDisplay(){
    // Restore the exact request shape that previously opened capture successfully on this project.
    const preferred={video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:60,max:60}},audio:soundEnabled,preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude',systemAudio:'exclude'};
    try{return await navigator.mediaDevices.getDisplayMedia(preferred)}catch(err){
      if(err?.name==='NotAllowedError'||err?.name==='AbortError')throw err;
      // Some Chromium builds reject optional hints. Retry once with the minimum legal request.
      try{return await navigator.mediaDevices.getDisplayMedia({video:true,audio:soundEnabled})}catch(err2){throw err2}
    }
  }
  async function cropStage(track){if(!window.CropTarget||typeof window.CropTarget.fromElement!=='function'||typeof track.cropTo!=='function')throw new Error('当前浏览器不支持只录中间画面。请使用最新版 Chrome / Edge。');const target=await window.CropTarget.fromElement(stage);await track.cropTo(target)}
  async function resetPlayer(){pauseBtn?.click();if(scrub){scrub.value='0';scrub.dispatchEvent(new Event('input',{bubbles:true}));scrub.dispatchEvent(new Event('change',{bubbles:true}))}if(narration){try{narration.pause();narration.currentTime=0;narration.muted=!soundEnabled}catch(_){}}await nextFrame();await sleep(120)}
  async function finish(){const elapsed=Math.max(1000,Date.now()-startedAt), blob=chunks.length?new Blob(chunks,{type:outputMime||recorder?.mimeType||'video/webm'}):null;if(!blob||blob.size<16384){resetTimer();cleanup();ui(false,'录制没有产生有效数据',true);alert('录制没有产生有效视频数据，请重试。');return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`project6-harness-v47-${new Date().toISOString().replace(/[:.]/g,'-')}.${outputExt}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);resetTimer(elapsed);if(status)status.textContent=`RECORDED ${outputExt.toUpperCase()} · ${clock(elapsed)}`;cleanup();ui(false,`${outputExt.toUpperCase()} · LOCAL DOWNLOAD · ${soundEnabled?'SOUND ON':'MUTED'}`)}
  async function stop(reason='manual'){if(phase==='idle')return;phase='stopping';ui(true,`STOPPING · ${reason}`);pauseBtn?.click();stopObserver?.disconnect();stopObserver=null;try{if(recorder&&recorder.state!=='inactive'){try{recorder.requestData()}catch(_){}await sleep(80);if(recorder.state!=='inactive')recorder.stop()}else{stopTracks();cleanup();resetTimer();ui(false,'录制已停止')}}catch(err){console.error(err);stopTracks();cleanup();resetTimer();ui(false,'录制已强制停止',true)}}
  async function start(){if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia)throw new Error('请使用 HTTPS 地址打开 Project6。');if(phase!=='idle')return;phase='starting';ui(true,'请选择“当前标签页” · Project6 会自动裁成中间 16:9 画面');await unlockAudio();capture=await requestDisplay();const track=capture.getVideoTracks()[0];if(!track)throw new Error('浏览器没有返回视频轨道。');track.addEventListener('ended',()=>stop('浏览器停止共享'),{once:true});await cropStage(track);await resetPlayer();const chosen=chooseMime();outputMime=chosen.mime||'video/webm';outputExt=chosen.ext;chunks=[];const opts=chosen.mime?{mimeType:chosen.mime,videoBitsPerSecond:12000000,audioBitsPerSecond:192000}:{videoBitsPerSecond:12000000};recorder=new MediaRecorder(capture,opts);recorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data)});recorder.addEventListener('stop',finish,{once:true});recorder.addEventListener('error',e=>{console.error(e);stop('Recorder Error')});recorder.start();phase='recording';startedAt=Date.now();startTimer();ui(true,`${outputExt.toUpperCase()} · STAGE ONLY · ${capture.getAudioTracks().length?'SOUND ON':'MUTED'} · 点击停止`);if(status)status.textContent='RECORDING · V47';playBtn?.click();if(status){stopObserver=new MutationObserver(()=>{if(status.textContent.trim()==='END'&&phase==='recording')setTimeout(()=>stop('END'),400)});stopObserver.observe(status,{childList:true,characterData:true,subtree:true})}}
  recordBtn.addEventListener('click',async()=>{if(phase!=='idle'){await stop('手动停止');return}try{await start()}catch(err){console.error(err);stopTracks();cleanup();resetTimer();ui(false,'录制未启动',true);if(status)status.textContent=err?.message||'录制失败';alert((err?.message||'录制失败')+'\n\n请在浏览器弹窗中选择“当前标签页”。选择后 Project6 会自动只截取中间 16:9 视频区域。') }});
  window.addEventListener('beforeunload',stopTracks);resetTimer();ui(false,soundEnabled?'V47 READY · SOUND ON':'V47 READY · MUTED');
})();