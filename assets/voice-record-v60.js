(() => {
  if(!/\/record\.html$/i.test(location.pathname)||!window.P6VoiceLibrary)return;
  const LIB=window.P6VoiceLibrary;
  const channel=new BroadcastChannel('project6-harness-v60');
  const grid=document.querySelector('.grid');if(!grid)return;
  const card=document.createElement('div');card.className='card';card.innerHTML=`<h2>② 配音源</h2><div class="row"><select id="voiceSourceSelect" class="select"><option value="">未选择已保存配音源</option></select><button class="btn" id="voicePreviewBtn" disabled>▶ 试听 001</button><span class="pill" id="voiceSourceState">读取本地配音源…</span><span class="pill" id="voiceUnlockState">声音未解锁</span></div><audio id="voicePreviewAudio" controls style="width:100%;margin-top:12px;display:none"></audio><p class="tip">ZIP 配音源保存在当前浏览器。选择后会实时同步到纯成片窗口。<strong>首次录制前，请切到纯成片窗口点一次“🔊 启用旁白声音”</strong>，否则 Chrome 可能拦截跨窗口自动播放。</p>`;
  const musicCard=[...grid.children].find(x=>x.querySelector('h2')?.textContent.includes('配乐'));
  grid.insertBefore(card,musicCard||grid.children[1]||null);
  const sel=card.querySelector('#voiceSourceSelect'),preview=card.querySelector('#voicePreviewBtn'),state=card.querySelector('#voiceSourceState'),unlock=card.querySelector('#voiceUnlockState'),audio=card.querySelector('#voicePreviewAudio');let url='';
  const revoke=()=>{if(url){URL.revokeObjectURL(url);url=''}};
  async function render(){
    const sources=await LIB.list(),active=LIB.active();sel.innerHTML='<option value="">未选择已保存配音源</option>'+sources.map((s,i)=>`<option value="${s.id}" ${s.id===active?'selected':''}>${s.label||`配音源 ${i+1}`} · ${s.total}/42 · ${s.zipName}</option>`).join('');
    state.textContent=sources.length?`${sources.length} 个已保存 · ${active?'当前已选择':'请选择一个'}`:'暂无已保存 ZIP 配音源';preview.disabled=!active;
    if(active)channel.postMessage({type:'voice-source',id:active});
  }
  sel.addEventListener('change',()=>{LIB.setActive(sel.value);preview.disabled=!sel.value;state.textContent=sel.value?'已切换并同步配音源':'未选择配音源';channel.postMessage({type:'voice-source',id:sel.value});revoke();audio.style.display='none'});
  preview.addEventListener('click',async()=>{const id=sel.value||LIB.active();if(!id)return;const s=await LIB.get(id),item=(s?.audios||[]).find(a=>a.id==='001');if(!item)return;revoke();url=URL.createObjectURL(item.blob);audio.src=url;audio.style.display='block';audio.play().catch(()=>{});});
  channel.addEventListener('message',e=>{const m=e.data||{};if((m.type==='audio-unlocked'&&m.ok)||(m.type==='state'&&m.audioUnlocked)){unlock.textContent='✓ 声音已解锁';unlock.style.color='#68e6c8';}});
  addEventListener('beforeunload',()=>{revoke();channel.close()});
  render();
})();