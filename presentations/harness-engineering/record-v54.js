(() => {
  const startBtn=document.getElementById('startRecord');
  const openBtn=document.getElementById('openRecord');
  const stopBtn=document.getElementById('stopRecord');
  const soundBtn=document.getElementById('soundRecord');
  const playState=document.getElementById('playState');
  const musicFile=document.getElementById('musicFile');
  const musicToggle=document.getElementById('musicToggle');
  const musicName=document.getElementById('musicName');
  const musicVolume=document.getElementById('musicVolume');
  const bgm=document.getElementById('bgm');
  const overlay=document.getElementById('recOverlay');
  const info=document.getElementById('recordInfo');
  const timerEl=document.getElementById('recTimer');
  const stateEl=document.getElementById('recState');
  const source=document.getElementById('captureSource');
  const canvas=document.getElementById('recordCanvas');
  const ctx=canvas.getContext('2d',{alpha:false});
  const stage=document.getElementById('stage');
  const stageFrame=document.getElementById('stageFrame');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const prevBtn=document.getElementById('prevBtn');
  const nextBtn=document.getElementById('nextBtn');
  const narration=document.getElementById('narration');
  const status=document.getElementById('status');
  if(!startBtn||!openBtn||!stopBtn||!overlay||!source||!canvas||!ctx||!stageFrame)return;

  const SOUND_KEY='project6.harness.sound.enabled';
  let soundEnabled=localStorage.getItem(SOUND_KEY)!=='0';
  let musicUrl='',musicWanted=false;
  let rawStream=null,composedStream=null,recorder=null,chunks=[],raf=0,startedAt=0,stopping=false,timerId=0,observer=null;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clock=ms=>{const t=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};

  function fitStage(){
    const r=stageFrame.getBoundingClientRect();
    stage.style.transform=`scale(${Math.min(r.width/1920,r.height/1080)})`;
  }
  addEventListener('resize',fitStage);fitStage();

  function syncSound(){
    if(narration)narration.muted=!soundEnabled;
    soundBtn.textContent=soundEnabled?'🔊 旁白开':'🔇 旁白关';
    soundBtn.classList.toggle('on',soundEnabled);
    localStorage.setItem(SOUND_KEY,soundEnabled?'1':'0');
  }
  syncSound();
  soundBtn.addEventListener('click',()=>{soundEnabled=!soundEnabled;syncSound()});

  function syncTransportLabel(){
    const s=(status?.textContent||'').trim();
    const count=(document.getElementById('countLabel')?.textContent||'').trim();
    if(s==='PAUSED')playState.textContent=`已暂停 · ${count}`;
    else if(s==='END')playState.textContent='已结束 · 42/42';
    else if(playBtn?.classList.contains('on'))playState.textContent=`自动播放中 · ${count}`;
    else playState.textContent=`待播放 · ${count}`;
  }
  if(status)new MutationObserver(syncTransportLabel).observe(status,{childList:true,characterData:true,subtree:true});
  [prevBtn,nextBtn,playBtn,pauseBtn].forEach(btn=>btn?.addEventListener('click',()=>setTimeout(syncTransportLabel,20)));
  syncTransportLabel();

  musicVolume.addEventListener('input',()=>{bgm.volume=Number(musicVolume.value)/100});
  bgm.volume=Number(musicVolume.value)/100;
  musicFile.addEventListener('change',()=>{
    const file=musicFile.files?.[0];
    if(!file)return;
    if(musicUrl)URL.revokeObjectURL(musicUrl);
    musicUrl=URL.createObjectURL(file);
    bgm.src=musicUrl;bgm.currentTime=0;musicWanted=false;
    musicName.textContent=`已选 · ${file.name}`;
    musicToggle.disabled=false;musicToggle.textContent='▶ 配乐';musicToggle.classList.remove('on');
    bgm.addEventListener('loadedmetadata',()=>{if(Number.isFinite(bgm.duration))musicName.textContent=`${file.name} · ${clock(bgm.duration*1000)}`},{once:true});
  });
  musicToggle.addEventListener('click',async()=>{
    if(!bgm.src)return;
    musicWanted=!musicWanted;
    if(musicWanted){try{await bgm.play();musicToggle.textContent='⏸ 配乐';musicToggle.classList.add('on')}catch(_){musicWanted=false}}
    else{bgm.pause();musicToggle.textContent='▶ 配乐';musicToggle.classList.remove('on')}
  });

  function chooseMime(){
    const c=[['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],['video/mp4','mp4'],['video/webm;codecs=vp9,opus','webm'],['video/webm;codecs=vp8,opus','webm'],['video/webm','webm']];
    for(const [mime,ext] of c)if(MediaRecorder.isTypeSupported(mime))return{mime,ext};
    return{mime:'',ext:'webm'};
  }
  function stopTracks(){try{rawStream?.getTracks().forEach(t=>t.stop())}catch(_){}try{composedStream?.getTracks().forEach(t=>t.stop())}catch(_){}}

  function stageCropInSource(){
    const rect=stageFrame.getBoundingClientRect();
    const sw=source.videoWidth||1,sh=source.videoHeight||1;
    const vw=Math.max(1,document.documentElement.clientWidth),vh=Math.max(1,document.documentElement.clientHeight);
    const sx=Math.max(0,rect.left/vw*sw),sy=Math.max(0,rect.top/vh*sh);
    const cw=Math.min(sw-sx,rect.width/vw*sw),ch=Math.min(sh-sy,rect.height/vh*sh);
    return{sx,sy,cw,ch};
  }
  function drawFrame(){
    const {sx,sy,cw,ch}=stageCropInSource();
    ctx.fillStyle='#111';ctx.fillRect(0,0,1920,1080);
    if(cw>2&&ch>2)ctx.drawImage(source,sx,sy,cw,ch,0,0,1920,1080);
    raf=requestAnimationFrame(drawFrame);
  }

  function startTimer(){
    clearInterval(timerId);timerEl.classList.add('live');timerEl.innerHTML='<span class="rec-dot"></span>REC 00:00:00';
    timerId=setInterval(()=>{const t=clock(Date.now()-startedAt);timerEl.innerHTML=`<span class="rec-dot"></span>REC ${t}`;document.title=`● REC ${t} · Project6 v54`},250);
  }
  function resetUI(doneMs=0){
    clearInterval(timerId);timerId=0;timerEl.classList.remove('live');timerEl.innerHTML=`<span class="rec-dot"></span>${doneMs?`DONE ${clock(doneMs)}`:'REC 00:00:00'}`;stopBtn.disabled=true;openBtn.disabled=false;stageFrame.classList.remove('recording');
  }

  async function stop(reason='manual'){
    if(stopping)return;stopping=true;
    observer?.disconnect();observer=null;
    if(recorder&&recorder.state!=='inactive'){
      try{recorder.requestData()}catch(_){}
      await sleep(80);if(recorder.state!=='inactive')recorder.stop();
    }else{cancelAnimationFrame(raf);stopTracks();resetUI();stopping=false}
    stateEl.textContent=`STOPPING · ${reason}`;
  }
  async function finish(ext,mime){
    cancelAnimationFrame(raf);
    const elapsed=Math.max(1000,Date.now()-startedAt),blob=new Blob(chunks,{type:mime||'video/webm'});
    stopTracks();
    if(blob.size<16384){alert('录制文件异常小，请重试。');resetUI();stopping=false;return}
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`project6-harness-v54-1080p-${new Date().toISOString().replace(/[:.]/g,'-')}.${ext}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    stateEl.textContent=`DONE · ${ext.toUpperCase()} · ${(blob.size/1024/1024).toFixed(1)}MB`;document.title=`Project6 v54 · DONE ${clock(elapsed)}`;resetUI(elapsed);stopping=false;recorder=null;rawStream=null;composedStream=null;
  }

  async function start(){
    if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia)throw new Error('请使用 HTTPS + 最新版 Chrome / Edge。');
    info.textContent='正在打开浏览器共享选择器…';
    rawStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true,preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude'});
    const vt=rawStream.getVideoTracks()[0];if(!vt)throw new Error('没有获得视频轨道。');vt.addEventListener('ended',()=>stop('浏览器停止共享'),{once:true});
    source.srcObject=rawStream;await source.play();await new Promise(resolve=>{if(source.readyState>=2&&source.videoWidth)resolve();else source.addEventListener('loadedmetadata',resolve,{once:true})});

    overlay.classList.add('hidden');
    drawFrame();
    composedStream=canvas.captureStream(60);rawStream.getAudioTracks().forEach(t=>composedStream.addTrack(t));
    const chosen=chooseMime();const opts=chosen.mime?{mimeType:chosen.mime,videoBitsPerSecond:18_000_000,audioBitsPerSecond:192_000}:{videoBitsPerSecond:18_000_000};
    chunks=[];recorder=new MediaRecorder(composedStream,opts);recorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data)});recorder.addEventListener('stop',()=>finish(chosen.ext,chosen.mime||recorder.mimeType),{once:true});recorder.start();startedAt=Date.now();startTimer();

    openBtn.disabled=true;stopBtn.disabled=false;stageFrame.classList.add('recording');
    stateEl.textContent=`LIVE · REC ONLY · PLAYER UNLOCKED · ${source.videoWidth}×${source.videoHeight}`;
    playState.textContent=`录制中 · 等你点击自动播放 · ${(document.getElementById('countLabel')?.textContent||'01 / 42').trim()}`;

    if(musicWanted&&bgm.src){try{bgm.currentTime=0;await bgm.play()}catch(_){}}
    observer=new MutationObserver(()=>{if(status?.textContent?.trim()==='END'){observer.disconnect();stop('END')}});if(status)observer.observe(status,{childList:true,characterData:true,subtree:true});
  }

  function openOverlay(){if(recorder?.state==='recording')return;overlay.classList.remove('hidden');info.textContent='v54 · 录制与播放已完全解耦：开始录制后，再手动点“自动播放”';}
  openBtn.addEventListener('click',openOverlay);stopBtn.addEventListener('click',()=>stop('手动停止'));
  startBtn.addEventListener('click',async()=>{startBtn.disabled=true;try{await start()}catch(err){console.error(err);stopTracks();overlay.classList.remove('hidden');info.textContent=err?.message||'录制失败';alert((err?.message||'录制失败')+'\n\n请选择“当前标签页”，并勾选“分享标签页音频”。')}finally{startBtn.disabled=false}});
  addEventListener('keydown',e=>{if((e.key==='s'||e.key==='S'||e.key==='Escape')&&recorder?.state==='recording')stop('快捷键停止')});
  addEventListener('beforeunload',()=>{if(musicUrl)URL.revokeObjectURL(musicUrl);stopTracks()});
})();