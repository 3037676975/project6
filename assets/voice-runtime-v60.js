(() => {
  const LIB=window.P6VoiceLibrary;
  const narration=document.getElementById('narration');
  if(!LIB||!narration)return;
  let urls=[];
  const revokeAll=()=>{urls.forEach(URL.revokeObjectURL);urls=[]};
  async function inject(){
    revokeAll();
    const sourceId=LIB.active();
    if(!sourceId){window.postMessage({type:'P6_CLEAR_AUDIO'},location.origin);return}
    const source=await LIB.get(sourceId);
    if(!source){window.postMessage({type:'P6_CLEAR_AUDIO'},location.origin);return}
    const files={};
    for(const item of (source.audios||[])){
      const url=URL.createObjectURL(item.blob);urls.push(url);files[item.id]=url;
    }
    narration.muted=localStorage.getItem('project6.harness.sound.enabled')==='0';
    window.postMessage({type:'P6_LOCAL_AUDIO',files},location.origin);
    narration.dataset.voiceSource=sourceId;
  }
  window.addEventListener('p6-voice-source-change',inject);
  window.addEventListener('storage',e=>{if(e.key===LIB.ACTIVE_KEY)inject()});
  addEventListener('load',()=>setTimeout(inject,80));
  addEventListener('beforeunload',revokeAll);
})();