(() => {
  if(!/\/record\.html$/i.test(location.pathname)||!window.P6VoiceLibrary)return;
  const LIB=window.P6VoiceLibrary;
  const channel=new BroadcastChannel('project6-harness-control');
  const grid=document.querySelector('.grid');if(!grid)return;
  const card=document.createElement('div');card.className='card';card.innerHTML=`<h2>② 配音源</h2><div class="row"><select id="voiceSourceSelect" class="select"><option value="">未选择已保存配音源</option></select><button class="btn" id="voicePreviewBtn" disabled>▶ 试听 001</button><span class="pill" id="voiceSourceState">读取本地配音源…</span><span class="pill" id="voicePlayState">旁白默认开启</span></div><audio id="voicePreviewAudio" controls style="width:100%;margin-top:12px;display:none"></audio><p class="tip">v62 起旁白由录制控制台直接播放并混入最终录制音轨，不再要求去成片窗口额外点“启用旁白声音”。选择配音源后，点“自动播放”即可直接有声音。</p>`;
  const musicCard=[...grid.children].find(x=>x.querySelector('h2')?.textContent.includes('配乐'));
  grid.insertBefore(card,musicCard||grid.children[1]||null);
  const sel=card.querySelector('#voiceSourceSelect'),preview=card.querySelector('#voicePreviewBtn'),state=card.querySelector('#voiceSourceState'),playState=card.querySelector('#voicePlayState'),previewAudio=card.querySelector('#voicePreviewAudio');
  const prev=document.getElementById('prevBtn'),play=document.getElementById('playBtn'),pause=document.getElementById('pauseBtn'),next=document.getElementById('nextBtn'),soundBtn=document.getElementById('soundBtn');
  const engineAudio=document.createElement('audio');engineAudio.preload='auto';engineAudio.style.display='none';document.body.appendChild(engineAudio);
  let previewUrl='',engineUrl='',scene='001',auto=false,pendingAuto=false,soundEnabled=true;
  let audioCtx=null,gain=null,dest=null,sourceNode=null;
  const revokePreview=()=>{if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=''}};
  const revokeEngine=()=>{if(engineUrl){URL.revokeObjectURL(engineUrl);engineUrl=''}};
  function sceneFromCount(v){return String(Number(String(v||'01').match(/\d+/)?.[0]||1)).padStart(3,'0')}
  async function ensureAudioGraph(){
    if(!audioCtx){
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      sourceNode=audioCtx.createMediaElementSource(engineAudio);gain=audioCtx.createGain();dest=audioCtx.createMediaStreamDestination();
      sourceNode.connect(gain);gain.connect(audioCtx.destination);gain.connect(dest);window.P6_VOICE_MIX_STREAM=dest.stream;
    }
    if(audioCtx.state!=='running')await audioCtx.resume();
    gain.gain.value=soundEnabled?1:0;
  }
  async function getSceneBlob(id){const sid=LIB.active();if(!sid)return null;const s=await LIB.get(sid);return (s?.audios||[]).find(a=>a.id===id)?.blob||null}
  async function loadEngine(id){const blob=await getSceneBlob(id);if(!blob)return false;revokeEngine();engineUrl=URL.createObjectURL(blob);engineAudio.src=engineUrl;engineAudio.currentTime=0;return true}
  async function playScene(id){
    await ensureAudioGraph();const ok=await loadEngine(id);if(!ok){playState.textContent=`Scene ${id} 无配音`;return false}
    try{await engineAudio.play();playState.textContent=`🔊 播放中 · ${id}`;return true}catch(err){console.error(err);playState.textContent='旁白播放失败';return false}
  }
  async function render(){
    const sources=await LIB.list(),active=LIB.active();sel.innerHTML='<option value="">未选择已保存配音源</option>'+sources.map((s,i)=>`<option value="${s.id}" ${s.id===active?'selected':''}>${s.label||`配音源 ${i+1}`} · ${s.total}/42 · ${s.zipName}</option>`).join('');
    state.textContent=sources.length?`${sources.length} 个已保存 · ${active?'当前已选择':'请选择一个'}`:'暂无已保存 ZIP 配音源';preview.disabled=!active;
  }
  sel.addEventListener('change',()=>{auto=false;engineAudio.pause();LIB.setActive(sel.value);preview.disabled=!sel.value;state.textContent=sel.value?'已切换当前配音源':'未选择配音源';revokePreview();revokeEngine();previewAudio.style.display='none'});
  preview.addEventListener('click',async()=>{const blob=await getSceneBlob('001');if(!blob)return;revokePreview();previewUrl=URL.createObjectURL(blob);previewAudio.src=previewUrl;previewAudio.style.display='block';previewAudio.play().catch(()=>{})});
  function intercept(el,fn){el?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();fn(e)},{capture:true})}
  intercept(play,async()=>{auto=true;pendingAuto=false;await playScene(scene)});
  intercept(pause,()=>{auto=false;pendingAuto=false;engineAudio.pause();playState.textContent=`⏸ 已暂停 · ${scene}`;channel.postMessage({type:'cmd',action:'pause'})});
  intercept(next,()=>{auto=false;pendingAuto=false;engineAudio.pause();channel.postMessage({type:'cmd',action:'next'})});
  intercept(prev,()=>{auto=false;pendingAuto=false;engineAudio.pause();channel.postMessage({type:'cmd',action:'prev'})});
  intercept(soundBtn,()=>{soundEnabled=!soundEnabled;if(gain)gain.gain.value=soundEnabled?1:0;soundBtn.textContent=soundEnabled?'🔊 旁白开':'🔇 旁白关';soundBtn.classList.toggle('primary',soundEnabled);playState.textContent=soundEnabled?'旁白默认开启':'旁白已静音'});
  engineAudio.addEventListener('ended',()=>{if(!auto)return;const n=Number(scene);if(n>=42){auto=false;playState.textContent='旁白播放完成';return}pendingAuto=true;channel.postMessage({type:'cmd',action:'next'})});
  channel.addEventListener('message',e=>{const m=e.data||{};if(m.type==='state'){const nextScene=sceneFromCount(m.count);if(nextScene!==scene){scene=nextScene;if(pendingAuto&&auto){pendingAuto=false;setTimeout(()=>playScene(scene),120)}}}});
  window.addEventListener('p6-voice-source-change',render);
  addEventListener('beforeunload',()=>{revokePreview();revokeEngine();channel.close();try{audioCtx?.close()}catch(_){}});
  render();
})();