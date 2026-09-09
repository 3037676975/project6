(() => {
  const startBtn=document.getElementById('startRecord');
  const overlay=document.getElementById('recOverlay');
  const info=document.getElementById('recordInfo');
  const source=document.getElementById('captureSource');
  const canvas=document.getElementById('recordCanvas');
  const ctx=canvas.getContext('2d',{alpha:false});
  const stage=document.getElementById('stage');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const scrub=document.getElementById('scrub');
  const narration=document.getElementById('narration');
  const status=document.getElementById('status');
  if(!startBtn||!overlay||!source||!canvas||!ctx)return;

  let rawStream=null, composedStream=null, recorder=null, chunks=[], raf=0, startedAt=0, stopping=false;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clock=ms=>{const t=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};

  function chooseMime(){
    const c=[['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],['video/mp4','mp4'],['video/webm;codecs=vp9,opus','webm'],['video/webm;codecs=vp8,opus','webm'],['video/webm','webm']];
    for(const [mime,ext] of c) if(MediaRecorder.isTypeSupported(mime)) return {mime,ext};
    return {mime:'',ext:'webm'};
  }

  function stopTracks(){
    try{rawStream?.getTracks().forEach(t=>t.stop())}catch(_){}
    try{composedStream?.getTracks().forEach(t=>t.stop())}catch(_){}
  }

  async function resetPlayer(){
    pauseBtn?.click();
    if(scrub){scrub.value='0';scrub.dispatchEvent(new Event('input',{bubbles:true}));scrub.dispatchEvent(new Event('change',{bubbles:true}))}
    if(narration){try{narration.pause();narration.currentTime=0}catch(_){}}
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    await sleep(120);
  }

  function drawFrame(){
    const sw=source.videoWidth||1, sh=source.videoHeight||1;
    const target=16/9, sourceAR=sw/sh;
    let sx=0,sy=0,cw=sw,ch=sh;
    if(sourceAR>target){cw=sh*target;sx=(sw-cw)/2}else if(sourceAR<target){ch=sw/target;sy=(sh-ch)/2}
    ctx.fillStyle='#111';ctx.fillRect(0,0,1920,1080);
    ctx.drawImage(source,sx,sy,cw,ch,0,0,1920,1080);
    raf=requestAnimationFrame(drawFrame);
  }

  async function stop(reason='manual'){
    if(stopping)return;stopping=true;
    pauseBtn?.click();
    if(recorder&&recorder.state!=='inactive'){
      try{recorder.requestData()}catch(_){}
      await sleep(80);
      if(recorder.state!=='inactive')recorder.stop();
    }else{
      cancelAnimationFrame(raf);stopTracks();stopping=false;
    }
    document.title=`Project6 v50 · 已停止 · ${reason}`;
  }

  async function finish(ext,mime){
    cancelAnimationFrame(raf);
    const elapsed=Math.max(1000,Date.now()-startedAt);
    const blob=new Blob(chunks,{type:mime||'video/webm'});
    stopTracks();
    if(blob.size<16384){alert('录制文件异常小，请重试。');stopping=false;return}
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`project6-harness-v50-1080p-${new Date().toISOString().replace(/[:.]/g,'-')}.${ext}`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    document.title=`Project6 v50 · DONE ${clock(elapsed)}`;
    stopping=false;
  }

  async function start(){
    if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia)throw new Error('请使用 HTTPS + 最新版 Chrome / Edge。');
    info.textContent='正在打开浏览器共享选择器…';
    rawStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true,preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude'});
    const vt=rawStream.getVideoTracks()[0];
    if(!vt)throw new Error('没有获得视频轨道。');
    vt.addEventListener('ended',()=>stop('浏览器停止共享'),{once:true});

    source.srcObject=rawStream;
    await source.play();
    await new Promise(resolve=>{if(source.readyState>=2&&source.videoWidth)resolve();else source.addEventListener('loadedmetadata',resolve,{once:true})});

    overlay.classList.add('hidden');
    await resetPlayer();
    drawFrame();

    composedStream=canvas.captureStream(60);
    rawStream.getAudioTracks().forEach(t=>composedStream.addTrack(t));
    const chosen=chooseMime();
    const opts=chosen.mime?{mimeType:chosen.mime,videoBitsPerSecond:18_000_000,audioBitsPerSecond:192_000}:{videoBitsPerSecond:18_000_000};
    chunks=[];
    recorder=new MediaRecorder(composedStream,opts);
    recorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data)});
    recorder.addEventListener('stop',()=>finish(chosen.ext,chosen.mime||recorder.mimeType),{once:true});
    recorder.start();
    startedAt=Date.now();
    document.title='● REC 00:00:00 · Project6 v50';
    const timer=setInterval(()=>{if(!recorder||recorder.state==='inactive'){clearInterval(timer);return}document.title=`● REC ${clock(Date.now()-startedAt)} · Project6 v50`},250);
    playBtn?.click();

    const observer=new MutationObserver(()=>{if(status?.textContent?.trim()==='END'){observer.disconnect();stop('END')}});
    if(status)observer.observe(status,{childList:true,characterData:true,subtree:true});
  }

  startBtn.addEventListener('click',async()=>{
    startBtn.disabled=true;
    try{await start()}catch(err){console.error(err);stopTracks();overlay.classList.remove('hidden');info.textContent=err?.message||'录制失败';alert((err?.message||'录制失败')+'\n\n请选择“当前标签页”。这个录制页只有视频画面，最终输出会固定为 1920×1080。')}
    finally{startBtn.disabled=false}
  });

  addEventListener('keydown',e=>{if((e.key==='s'||e.key==='S'||e.key==='Escape')&&recorder?.state==='recording')stop('手动停止')});
})();