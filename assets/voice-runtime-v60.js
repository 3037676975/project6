(() => {
  const LIB=window.P6VoiceLibrary;
  const narration=document.getElementById('narration');
  const count=document.getElementById('countLabel');
  if(!LIB||!narration||!count)return;
  let currentUrl='',loadingId='';
  const sceneId=()=>String((count.textContent||'01').match(/\d+/)?.[0]||'1').padStart(3,'0');
  const revoke=()=>{if(currentUrl){URL.revokeObjectURL(currentUrl);currentUrl=''}};
  async function loadSceneAudio(force=false){
    const sourceId=LIB.active();
    if(!sourceId){revoke();loadingId='';narration.removeAttribute('src');return false}
    const sid=sceneId(),key=`${sourceId}:${sid}`;if(!force&&loadingId===key&&narration.src)return true;
    const source=await LIB.get(sourceId);if(!source)return false;
    const item=(source.audios||[]).find(a=>a.id===sid);if(!item)return false;
    revoke();currentUrl=URL.createObjectURL(item.blob);loadingId=key;narration.src=currentUrl;narration.dataset.voiceSource=sourceId;narration.dataset.scene=sid;return true;
  }
  const nativePlay=narration.play.bind(narration);
  narration.play=function(){return loadSceneAudio().then(()=>nativePlay())};
  new MutationObserver(()=>loadSceneAudio(true)).observe(count,{childList:true,subtree:true,characterData:true});
  window.addEventListener('p6-voice-source-change',()=>loadSceneAudio(true));
  window.addEventListener('storage',e=>{if(e.key===LIB.ACTIVE_KEY)loadSceneAudio(true)});
  addEventListener('load',()=>loadSceneAudio(true));
  addEventListener('beforeunload',revoke);
})();