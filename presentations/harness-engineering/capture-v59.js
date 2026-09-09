(() => {
  const channel = new BroadcastChannel('project6-harness-v59');
  const $ = id => document.getElementById(id);
  const prev=$('prevBtn'),next=$('nextBtn'),play=$('playBtn'),pause=$('pauseBtn'),sound=$('narration'),bgm=$('bgm'),count=$('countLabel'),status=$('status');
  let musicUrl='';

  function mountAudioUnlock(){
    if(document.getElementById('p6AudioUnlock'))return;
    const wrap=document.createElement('div');wrap.id='p6AudioUnlock';
    wrap.innerHTML='<button type="button">🔊 启用旁白声音</button><small>录制前只需点一次，随后此提示会消失</small>';
    Object.assign(wrap.style,{position:'fixed',left:'50%',bottom:'28px',transform:'translateX(-50%)',zIndex:'999999',display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderRadius:'16px',background:'rgba(10,15,22,.90)',border:'1px solid rgba(255,255,255,.18)',boxShadow:'0 14px 46px rgba(0,0,0,.35)',color:'#fff',fontFamily:'Noto Sans SC, sans-serif'});
    const btn=wrap.querySelector('button');const note=wrap.querySelector('small');
    Object.assign(btn.style,{border:'0',borderRadius:'11px',padding:'11px 16px',background:'#13b89f',color:'#062822',fontWeight:'900',cursor:'pointer'});
    Object.assign(note.style,{opacity:'.72',fontSize:'12px'});
    btn.addEventListener('click',async()=>{
      try{
        sound.muted=false;
        window.dispatchEvent(new CustomEvent('p6-voice-source-change',{detail:{id:window.P6VoiceLibrary?.active?.()||''}}));
        await new Promise(r=>setTimeout(r,80));
        if(sound.src){
          const oldVol=sound.volume;sound.volume=0.001;
          try{await sound.play();sound.pause();sound.currentTime=0}catch(_){}
          sound.volume=oldVol;
        }
        sessionStorage.setItem('project6.harness.audio.unlocked','1');
        wrap.remove();
        channel.postMessage({type:'audio-unlocked',ok:true});
      }catch(err){console.warn('[P6] audio unlock failed',err)}
    });
    document.body.appendChild(wrap);
  }

  const sendState=()=>channel.postMessage({type:'state',count:(count?.textContent||'01 / 42').trim(),status:(status?.textContent||'READY').trim(),ready:true,audioUnlocked:sessionStorage.getItem('project6.harness.audio.unlocked')==='1',voiceSource:window.P6VoiceLibrary?.active?.()||''});
  if(count)new MutationObserver(sendState).observe(count,{childList:true,subtree:true,characterData:true});
  if(status)new MutationObserver(sendState).observe(status,{childList:true,subtree:true,characterData:true});
  channel.onmessage=async e=>{
    const m=e.data||{};
    if(m.type==='cmd'){
      if(m.action==='prev')prev?.click();
      if(m.action==='next')next?.click();
      if(m.action==='play')play?.click();
      if(m.action==='pause')pause?.click();
      if(m.action==='sound'&&sound)sound.muted=!m.enabled;
      if(m.action==='goto'&&Number.isFinite(m.index)){
        const scrub=$('scrub'); if(scrub){scrub.value=String(m.index);scrub.dispatchEvent(new Event('input',{bubbles:true}));}
      }
      requestAnimationFrame(sendState);
    }
    if(m.type==='voice-source'){
      window.P6VoiceLibrary?.setActive?.(m.id||'');
      window.dispatchEvent(new CustomEvent('p6-voice-source-change',{detail:{id:m.id||''}}));
      sendState();
    }
    if(m.type==='music-file'&&m.file){
      if(musicUrl)URL.revokeObjectURL(musicUrl);
      musicUrl=URL.createObjectURL(m.file); bgm.src=musicUrl; bgm.currentTime=0; bgm.volume=Number.isFinite(m.volume)?m.volume:.35;
      if(m.play){try{await bgm.play()}catch(_){}}
    }
    if(m.type==='music-play'){if(m.play){try{await bgm.play()}catch(_){}}else bgm.pause();}
    if(m.type==='music-volume')bgm.volume=Math.max(0,Math.min(1,Number(m.volume)||0));
  };
  addEventListener('load',async()=>{
    if(document.fonts?.ready)await document.fonts.ready;
    if(sessionStorage.getItem('project6.harness.audio.unlocked')!=='1')mountAudioUnlock();
    setTimeout(()=>{sendState();channel.postMessage({type:'capture-ready'});},160);
  });
  addEventListener('beforeunload',()=>{if(musicUrl)URL.revokeObjectURL(musicUrl);channel.close()});
})();