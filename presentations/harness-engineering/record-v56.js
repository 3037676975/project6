(() => {
  const $=id=>document.getElementById(id);
  const startBtn=$('startRecord'),openBtn=$('openRecord'),pauseRecBtn=$('pauseRecord'),stopBtn=$('stopRecord'),cancelBtn=$('cancelRecord');
  const soundBtn=$('soundRecord'),playState=$('playState');
  const musicFile=$('musicFile'),musicToggle=$('musicToggle'),musicName=$('musicName'),musicVolume=$('musicVolume'),bgm=$('bgm');
  const overlay=$('recOverlay'),info=$('recordInfo'),timerEl=$('recTimer'),stateEl=$('recState'),source=$('captureSource'),canvas=$('recordCanvas'),stage=$('stage'),stageFrame=$('stageFrame');
  const narration=$('narration'),status=$('status'),countLabel=$('countLabel');
  const prevBtn=$('prevBtn'),playBtn=$('playBtn'),pauseBtn=$('pauseBtn'),nextBtn=$('nextBtn');
  if(!startBtn||!openBtn||!pauseRecBtn||!stopBtn||!cancelBtn||!source||!canvas||!stageFrame)return;
  const ctx=canvas.getContext('2d',{alpha:false});
  const SOUND_KEY='project6.harness.sound.enabled';
  let soundEnabled=localStorage.getItem(SOUND_KEY)!=='0';
  let musicUrl='',musicWanted=false;
  let rawStream=null,composedStream=null,recorder=null,chunks=[],raf=0,startedAt=0,timerId=0,stopping=false,cancelled=false;
  let recPausedAt=0,totalPausedMs=0;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clock=ms=>{const t=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};

  function fitStage(){const r=stageFrame.getBoundingClientRect();stage.style.transform=`scale(${Math.min(r.width/1920,r.height/1080)})`}
  addEventListener('resize',fitStage);fitStage();

  function syncSound(){if(narration)narration.muted=!soundEnabled;soundBtn.textContent=soundEnabled?'🔊 旁白开':'🔇 旁白关';soundBtn.classList.toggle('on',soundEnabled);localStorage.setItem(SOUND_KEY,soundEnabled?'1':'0')}
  syncSound(); soundBtn.addEventListener('click',()=>{soundEnabled=!soundEnabled;syncSound()});

  function syncPlayerState(){
    const c=(countLabel?.textContent||'01 / 42').trim();
    const s=(status?.textContent||'').trim();
    if(s==='PAUSED') playState.textContent=`已暂停 · ${c}`;
    else if(s==='END') playState.textContent=`已结束 · ${c}`;
    else if(playBtn?.classList.contains('on')) playState.textContent=`自动播放中 · ${c}`;
    else playState.textContent=`手动控制 · ${c}`;
  }
  if(status)new MutationObserver(syncPlayerState).observe(status,{childList:true,characterData:true,subtree:true});
  if(countLabel)new MutationObserver(syncPlayerState).observe(countLabel,{childList:true,characterData:true,subtree:true});
  [prevBtn,playBtn,pauseBtn,nextBtn].forEach(btn=>btn?.addEventListener('click',()=>requestAnimationFrame(syncPlayerState)));
  syncPlayerState();

  musicVolume.addEventListener('input',()=>bgm.volume=Number(musicVolume.value)/100);bgm.volume=Number(musicVolume.value)/100;
  musicFile.addEventListener('change',()=>{const f=musicFile.files?.[0];if(!f)return;if(musicUrl)URL.revokeObjectURL(musicUrl);musicUrl=URL.createObjectURL(f);bgm.src=musicUrl;bgm.currentTime=0;musicWanted=false;musicName.textContent=`已选 · ${f.name}`;musicToggle.disabled=false;musicToggle.textContent='▶ 配乐';musicToggle.classList.remove('on');bgm.addEventListener('loadedmetadata',()=>{if(Number.isFinite(bgm.duration))musicName.textContent=`${f.name} · ${clock(bgm.duration*1000)}`},{once:true})});
  musicToggle.addEventListener('click',async()=>{if(!bgm.src)return;musicWanted=!musicWanted;if(musicWanted){try{await bgm.play();musicToggle.textContent='⏸ 配乐';musicToggle.classList.add('on')}catch(_){musicWanted=false}}else{bgm.pause();musicToggle.textContent='▶ 配乐';musicToggle.classList.remove('on')}});

  function chooseMime(){for(const [mime,ext] of [['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],['video/mp4','mp4'],['video/webm;codecs=vp9,opus','webm'],['video/webm','webm']])if(MediaRecorder.isTypeSupported(mime))return{mime,ext};return{mime:'',ext:'webm'}}
  function stopTracks(){try{rawStream?.getTracks().forEach(t=>t.stop())}catch(_){}try{composedStream?.getTracks().forEach(t=>t.stop())}catch(_){}}
  function crop(){const r=stageFrame.getBoundingClientRect(),sw=source.videoWidth||1,sh=source.videoHeight||1,vw=Math.max(1,document.documentElement.clientWidth),vh=Math.max(1,document.documentElement.clientHeight);const sx=Math.max(0,r.left/vw*sw),sy=Math.max(0,r.top/vh*sh),cw=Math.min(sw-sx,r.width/vw*sw),ch=Math.min(sh-sy,r.height/vh*sh);return{sx,sy,cw,ch}}
  function draw(){const {sx,sy,cw,ch}=crop();ctx.fillStyle='#111';ctx.fillRect(0,0,1920,1080);if(cw>2&&ch>2)ctx.drawImage(source,sx,sy,cw,ch,0,0,1920,1080);raf=requestAnimationFrame(draw)}
  function elapsed(){const now=Date.now(),livePause=recPausedAt?now-recPausedAt:0;return Math.max(0,now-startedAt-totalPausedMs-livePause)}
  function startTimer(){clearInterval(timerId);timerEl.classList.add('live');timerId=setInterval(()=>{const t=clock(elapsed());timerEl.innerHTML=`<span class="rec-dot"></span>REC ${t}`;document.title=`● REC ${t} · Project6 v57`},250)}
  function resetRecUI(){clearInterval(timerId);timerId=0;timerEl.classList.remove('live');openBtn.disabled=false;pauseRecBtn.disabled=true;pauseRecBtn.textContent='⏸ 暂停录制';stopBtn.disabled=true;cancelBtn.disabled=true;stageFrame.classList.remove('recording')}

  async function finalize(save=true,reason='manual'){
    if(stopping)return;stopping=true;cancelled=!save;clearInterval(timerId);
    if(recorder&&recorder.state!=='inactive'){
      if(recorder.state==='paused'){try{recorder.resume()}catch(_){} }
      try{recorder.requestData()}catch(_){}
      await sleep(60);if(recorder.state!=='inactive')recorder.stop();
    }else{cancelAnimationFrame(raf);stopTracks();resetRecUI();stopping=false}
    stateEl.textContent=`${save?'STOPPING':'CANCELLING'} · ${reason}`;
  }
  async function finish(ext,mime){
    cancelAnimationFrame(raf);const duration=elapsed(),blob=new Blob(chunks,{type:mime||'video/webm'});stopTracks();
    if(cancelled){stateEl.textContent='CANCELLED · 未保存文件';timerEl.innerHTML='<span class="rec-dot"></span>CANCELLED';resetRecUI();stopping=false;recorder=null;return}
    if(blob.size<16384){alert('录制文件异常小，请重试。');resetRecUI();stopping=false;return}
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`project6-harness-v57-1080p-${new Date().toISOString().replace(/[:.]/g,'-')}.${ext}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    stateEl.textContent=`DONE · ${ext.toUpperCase()} · ${(blob.size/1024/1024).toFixed(1)}MB`;timerEl.innerHTML=`<span class="rec-dot"></span>DONE ${clock(duration)}`;document.title=`Project6 v57 · DONE ${clock(duration)}`;resetRecUI();stopping=false;recorder=null;rawStream=null;composedStream=null;
  }

  async function begin(){
    if(!window.isSecureContext||!navigator.mediaDevices?.getDisplayMedia)throw new Error('请使用 HTTPS + 最新版 Chrome / Edge。');
    info.textContent='正在打开浏览器共享选择器…';
    rawStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true,preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude'});
    const vt=rawStream.getVideoTracks()[0];if(!vt)throw new Error('没有获得视频轨道。');vt.addEventListener('ended',()=>finalize(true,'浏览器停止共享'),{once:true});
    source.srcObject=rawStream;await source.play();await new Promise(r=>source.readyState>=2&&source.videoWidth?r():source.addEventListener('loadedmetadata',r,{once:true}));
    overlay.classList.add('hidden');draw();composedStream=canvas.captureStream(60);rawStream.getAudioTracks().forEach(t=>composedStream.addTrack(t));
    const c=chooseMime(),opts=c.mime?{mimeType:c.mime,videoBitsPerSecond:18_000_000,audioBitsPerSecond:192_000}:{videoBitsPerSecond:18_000_000};
    chunks=[];cancelled=false;totalPausedMs=0;recPausedAt=0;recorder=new MediaRecorder(composedStream,opts);recorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data)});recorder.addEventListener('stop',()=>finish(c.ext,c.mime||recorder.mimeType),{once:true});recorder.start();startedAt=Date.now();startTimer();
    openBtn.disabled=true;pauseRecBtn.disabled=false;stopBtn.disabled=false;cancelBtn.disabled=false;stageFrame.classList.add('recording');stateEl.textContent=`LIVE · PLAYER INIT FIXED · ${source.videoWidth}×${source.videoHeight}`;
  }

  openBtn.addEventListener('click',()=>{if(recorder?.state==='recording'||recorder?.state==='paused')return;overlay.classList.remove('hidden');info.textContent='v57 · Garden 播放器已完整初始化；录制不再接管播放/翻页'});
  pauseRecBtn.addEventListener('click',()=>{if(!recorder)return;if(recorder.state==='recording'){recorder.pause();recPausedAt=Date.now();pauseRecBtn.textContent='▶ 继续录制';stateEl.textContent='REC PAUSED · Garden 播放器仍可操作'}else if(recorder.state==='paused'){recorder.resume();totalPausedMs+=Date.now()-recPausedAt;recPausedAt=0;pauseRecBtn.textContent='⏸ 暂停录制';stateEl.textContent='LIVE · 录制已继续'}});
  stopBtn.addEventListener('click',()=>finalize(true,'手动停止并保存'));
  cancelBtn.addEventListener('click',()=>finalize(false,'用户取消'));
  startBtn.addEventListener('click',async()=>{startBtn.disabled=true;try{await begin()}catch(err){console.error(err);stopTracks();overlay.classList.remove('hidden');info.textContent=err?.message||'录制失败';alert((err?.message||'录制失败')+'\n\n请选择“当前标签页”，并勾选“分享标签页音频”。')}finally{startBtn.disabled=false}});
  addEventListener('beforeunload',()=>{if(musicUrl)URL.revokeObjectURL(musicUrl);stopTracks()});
})();