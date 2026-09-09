(() => {
  const DB_NAME='project6-voice-library';
  const DB_VERSION=1;
  const STORE='sources';
  const ACTIVE_KEY='project6.harness.voice.active';
  const PROJECT='Harness Engineering';
  const EXPECT=42;

  const openDB=()=>new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
  const tx=(mode,fn)=>openDB().then(db=>new Promise((resolve,reject)=>{
    const t=db.transaction(STORE,mode),s=t.objectStore(STORE);let result;
    try{result=fn(s)}catch(e){reject(e);return}
    t.oncomplete=()=>resolve(result?.result??result);
    t.onerror=()=>reject(t.error);
  }));
  const list=()=>openDB().then(db=>new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).getAll();r.onsuccess=()=>resolve((r.result||[]).sort((a,b)=>a.createdAt.localeCompare(b.createdAt)));r.onerror=()=>reject(r.error)}));
  const get=id=>openDB().then(db=>new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)}));
  const put=source=>tx('readwrite',s=>s.put(source));
  const remove=id=>tx('readwrite',s=>s.delete(id));
  const active=()=>localStorage.getItem(ACTIVE_KEY)||'';
  const setActive=id=>{if(id)localStorage.setItem(ACTIVE_KEY,id);else localStorage.removeItem(ACTIVE_KEY);window.dispatchEvent(new CustomEvent('p6-voice-source-change',{detail:{id}}))};

  async function parseZip(file){
    if(!window.JSZip)throw new Error('JSZip 未加载，无法解析 ZIP。');
    const zip=await JSZip.loadAsync(file);
    const audios=[];
    const names=Object.keys(zip.files);
    for(const name of names){
      const entry=zip.files[name];if(entry.dir)continue;
      const m=name.replace(/\\/g,'/').match(/(?:^|\/)(\d{3})\.(mp3|wav|m4a|ogg)$/i);
      if(!m)continue;
      const n=Number(m[1]);if(n<1||n>EXPECT)continue;
      const id=String(n).padStart(3,'0');
      const blob=await entry.async('blob');
      audios.push({id,name:name.split('/').pop(),type:blob.type||({mp3:'audio/mpeg',wav:'audio/wav',m4a:'audio/mp4',ogg:'audio/ogg'}[m[2].toLowerCase()]||'audio/mpeg'),blob});
    }
    audios.sort((a,b)=>a.id.localeCompare(b.id));
    if(!audios.length)throw new Error('ZIP 中没有找到 001～042 的音频文件。');
    return audios;
  }

  async function saveZip(file){
    if(!/\.zip$/i.test(file.name))return null;
    try{await navigator.storage?.persist?.()}catch(_){}
    const audios=await parseZip(file);
    const sources=await list();
    const seq=sources.length+1;
    const now=new Date().toISOString();
    const id=`harness-voice-${Date.now()}`;
    const source={id,project:PROJECT,label:`配音源 ${seq}`,zipName:file.name,createdAt:now,total:audios.length,complete:audios.length===EXPECT,zipBlob:file,audios};
    await put(source);
    setActive(id);
    return source;
  }

  window.P6VoiceLibrary={DB_NAME,STORE,ACTIVE_KEY,list,get,put,remove,active,setActive,saveZip,parseZip};

  async function mountWorks(){
    if(!/\/works\.html$/i.test(location.pathname))return;
    const input=document.getElementById('audioFiles');if(!input)return;
    const section=input.closest('.section');if(!section)return;
    const style=document.createElement('style');style.textContent=`
      .voice-lib{margin-top:16px;border:1px solid #dfe7f1;border-radius:16px;padding:15px;background:#f8fbff}.voice-lib-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:11px}.voice-lib-head b{font-size:15px}.voice-lib-note{font-size:12px;color:#6b7789;line-height:1.55}.voice-source{border:1px solid #dfe7f1;border-radius:14px;background:#fff;padding:12px;margin-top:9px}.voice-source.active{border-color:#0f9687;box-shadow:0 0 0 2px rgba(15,150,135,.08)}.voice-source-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.voice-source-title{font-weight:900}.voice-source-meta{font-size:11px;color:#7a8798;margin-top:4px}.voice-source-actions{display:flex;gap:7px;flex-wrap:wrap}.voice-source-actions button{border:1px solid #dfe7f1;border-radius:9px;background:#fff;padding:7px 10px;font-weight:800;cursor:pointer}.voice-source-actions .use{background:#0f9687;color:#fff;border-color:#0f9687}.voice-preview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.voice-preview-grid label{font:800 11px ui-monospace;color:#5d6a7b}.voice-preview-grid audio{width:100%;margin-top:5px}.voice-empty{padding:14px;border:1px dashed #c8d2df;border-radius:12px;color:#748194;text-align:center}.voice-badge{font-size:10px;font-weight:900;padding:4px 7px;border-radius:999px;background:#eaf7f4;color:#0b756b}.voice-badge.partial{background:#fff3dc;color:#976305}@media(max-width:760px){.voice-source-top{align-items:flex-start;flex-direction:column}.voice-preview-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(style);
    const box=document.createElement('div');box.className='voice-lib';box.innerHTML=`<div class="voice-lib-head"><div><b>配音源库 · v60</b><div class="voice-lib-note">ZIP 会保存到当前浏览器 IndexedDB；单个 MP3/WAV 只临时使用，不保存。可保存多个版本并随时切换试听。</div></div><span id="voiceLibCount" class="voice-badge">0 个</span></div><div id="voiceLibList"></div>`;
    const drop=input.closest('.drop');(drop||input).after(box);
    const listEl=box.querySelector('#voiceLibList'),countEl=box.querySelector('#voiceLibCount');let objectUrls=[];
    const clearUrls=()=>{objectUrls.forEach(URL.revokeObjectURL);objectUrls=[]};

    async function render(){
      clearUrls();const sources=await list(),activeId=active();countEl.textContent=`${sources.length} 个`;
      if(!sources.length){listEl.innerHTML='<div class="voice-empty">还没有保存的配音源。上传 ZIP 后会自动保存为“配音源 1”。</div>';return}
      listEl.innerHTML='';sources.forEach((s,i)=>{
        const row=document.createElement('div');row.className='voice-source'+(s.id===activeId?' active':'');
        row.innerHTML=`<div class="voice-source-top"><div><div class="voice-source-title">${s.id===activeId?'✓ ':''}${s.label||`配音源 ${i+1}`} <span class="voice-badge ${s.complete?'':'partial'}">${s.total}/${EXPECT}</span></div><div class="voice-source-meta">${s.zipName} · ${new Date(s.createdAt).toLocaleString()}</div></div><div class="voice-source-actions"><button class="use">${s.id===activeId?'当前使用':'设为当前'}</button><button class="listen">试听 001～004</button><button class="del">删除</button></div></div><div class="samples"></div>`;
        row.querySelector('.use').onclick=()=>{setActive(s.id);render()};
        row.querySelector('.del').onclick=async()=>{if(!confirm(`删除 ${s.label||s.zipName}？`))return;await remove(s.id);if(active()===s.id)setActive('');render()};
        row.querySelector('.listen').onclick=()=>{
          const samples=row.querySelector('.samples');if(samples.childElementCount){samples.innerHTML='';return}
          const audios=(s.audios||[]).filter(a=>['001','002','003','004'].includes(a.id));
          samples.className='samples voice-preview-grid';samples.innerHTML='';audios.forEach(a=>{const url=URL.createObjectURL(a.blob);objectUrls.push(url);const d=document.createElement('div');d.innerHTML=`<label>Scene ${a.id}</label><audio controls preload="metadata" src="${url}"></audio>`;samples.appendChild(d)});
        };
        listEl.appendChild(row);
      });
    }

    input.addEventListener('change',async e=>{
      const files=[...(e.target.files||[])];const zips=files.filter(f=>/\.zip$/i.test(f.name));
      if(!zips.length)return;
      for(const file of zips){
        try{const s=await saveZip(file);if(s)console.info('[P6 Voice] saved',s.label,s.total)}catch(err){console.error(err);alert(`ZIP 保存失败：${err.message||err}`)}
      }
      render();
    },true);
    window.addEventListener('p6-voice-source-change',render);
    addEventListener('beforeunload',clearUrls);
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountWorks,{once:true});else mountWorks();
})();