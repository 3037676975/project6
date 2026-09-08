/* Project6 Chapter1 v19 runtime
 * - Adds Design System entry outside stage
 * - HTTP fallback recorder: DOM -> canvas -> captureStream -> MediaRecorder
 * - Never uploads the output
 */
(() => {
  const stage=document.querySelector('.stage');
  const toolbar=document.querySelector('.toolbar');
  const recordBtn=document.getElementById('recordBtn');
  const recordStatus=document.getElementById('recordStatus');
  const narration=document.getElementById('narration');
  const bgm=document.getElementById('bgm');
  const modeAuto=document.getElementById('modeAuto');
  const prevBtn=document.getElementById('prevBtn');
  const speakBtn=document.getElementById('speakBtn');
  const stepInfo=document.getElementById('stepInfo');
  if(!stage||!toolbar||!recordBtn||!recordStatus)return;

  // Design rules live outside the 1920x1080 stage.
  if(!document.getElementById('designSystemBtn')){
    const a=document.createElement('a');
    a.id='designSystemBtn';a.className='btn';a.href='./design-system.html';a.target='_blank';a.rel='noopener';a.textContent='设计规范';
    const right=toolbar.querySelector('.right');
    right?.insertBefore(a,right.firstChild);
  }

  let fallbackRecorder=null, fallbackStream=null, fallbackCanvas=null, renderActive=false, mixCtx=null, mixDest=null;
  async function ensureAudioMix(){
    if(mixDest)return mixDest;
    mixCtx=new (window.AudioContext||window.webkitAudioContext)();
    await mixCtx.resume();
    mixDest=mixCtx.createMediaStreamDestination();
    const nsrc=mixCtx.createMediaElementSource(narration); nsrc.connect(mixCtx.destination); nsrc.connect(mixDest);
    const bsrc=mixCtx.createMediaElementSource(bgm); bsrc.connect(mixCtx.destination); bsrc.connect(mixDest);
    return mixDest;
  }

  async function renderLoop(ctx){
    while(renderActive){
      try{
        const snap=await html2canvas(stage,{backgroundColor:null,scale:1,width:1920,height:1080,logging:false,useCORS:true,onclone:doc=>{const s=doc.querySelector('.stage');if(s){s.style.transform='none';s.style.transformOrigin='top left'}}});
        ctx.clearRect(0,0,1920,1080);ctx.drawImage(snap,0,0,1920,1080);
      }catch(e){console.warn('fallback render frame failed',e)}
      await new Promise(r=>setTimeout(r,34));
    }
  }

  async function startFallbackRecording(){
    if(!window.html2canvas||!HTMLCanvasElement.prototype.captureStream||!window.MediaRecorder){recordStatus.textContent='当前浏览器不支持兼容录制';return}
    try{
      recordStatus.textContent='准备兼容录制';
      const audioDest=await ensureAudioMix();
      fallbackCanvas=document.createElement('canvas');fallbackCanvas.width=1920;fallbackCanvas.height=1080;
      const ctx=fallbackCanvas.getContext('2d',{alpha:false});
      const videoStream=fallbackCanvas.captureStream(15);
      fallbackStream=new MediaStream([...videoStream.getVideoTracks(),...audioDest.stream.getAudioTracks()]);
      const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm';
      const chunks=[];fallbackRecorder=new MediaRecorder(fallbackStream,{mimeType:mime,videoBitsPerSecond:7000000});
      fallbackRecorder.ondataavailable=e=>e.data.size&&chunks.push(e.data);
      fallbackRecorder.onstop=()=>{
        renderActive=false;fallbackStream?.getTracks().forEach(t=>t.stop());
        const blob=new Blob(chunks,{type:'video/webm'}),url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download='project6-harness-chapter1-http.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
        recordBtn.textContent='● 一键录制';recordBtn.classList.remove('live');recordStatus.textContent='已下载 · HTTP兼容';
      };
      renderActive=true;renderLoop(ctx);fallbackRecorder.start(1000);
      recordBtn.textContent='■ 停止并下载';recordBtn.classList.add('live');recordStatus.textContent='正在录制 · HTTP兼容';
      for(let i=0;i<8;i++)prevBtn?.click();modeAuto?.click();requestAnimationFrame(()=>speakBtn?.click());
    }catch(e){console.error(e);renderActive=false;recordStatus.textContent='兼容录制失败'}
  }
  function stopFallback(){if(fallbackRecorder?.state==='recording')fallbackRecorder.stop()}

  const secureNative=!!(window.isSecureContext&&navigator.mediaDevices?.getDisplayMedia);
  if(!secureNative){
    recordStatus.textContent='HTTP兼容录制就绪';
    recordBtn.title='HTTP 下使用 Canvas 兼容录制；视频只在浏览器本地生成并下载。';
    document.addEventListener('click',e=>{if(e.target!==recordBtn)return;e.preventDefault();e.stopImmediatePropagation();fallbackRecorder?.state==='recording'?stopFallback():startFallbackRecording()},true);
    narration?.addEventListener('ended',()=>{if(fallbackRecorder?.state==='recording'&&stepInfo?.textContent?.trim().startsWith('06'))setTimeout(stopFallback,500)});
  }else{
    recordStatus.textContent='录制就绪';
    recordBtn.title='HTTPS：原生标签页录制，结束后只下载本地 WebM。';
  }
})();