/* Project6 Chapter1 v20 runtime
 * Recording defaults to CURRENT slide, not forced page 1.
 * HTTP fallback uses a throttled 10fps DOM snapshot loop to reduce UI jank.
 * Controls are never part of the captured 1920x1080 stage.
 */
(() => {
  const stage=document.querySelector('.stage'),toolbar=document.querySelector('.toolbar');
  const recordBtn=document.getElementById('recordBtn'),recordStatus=document.getElementById('recordStatus');
  const narration=document.getElementById('narration'),bgm=document.getElementById('bgm');
  const speakBtn=document.getElementById('speakBtn'),stepInfo=document.getElementById('stepInfo');
  if(!stage||!toolbar||!recordBtn||!recordStatus)return;
  if(!document.getElementById('designSystemBtn')){const a=document.createElement('a');a.id='designSystemBtn';a.className='btn';a.href='./design-system.html';a.target='_blank';a.rel='noopener';a.textContent='设计规范';toolbar.querySelector('.right')?.insertBefore(a,toolbar.querySelector('.right')?.firstChild)}

  let rec=null,stream=null,canvas=null,rendering=false,mixCtx=null,mixDest=null,raf=0,lastFrame=0;
  async function audioMix(){
    if(mixDest)return mixDest;
    mixCtx=new (window.AudioContext||window.webkitAudioContext)();await mixCtx.resume();mixDest=mixCtx.createMediaStreamDestination();
    try{const n=mixCtx.createMediaElementSource(narration);n.connect(mixCtx.destination);n.connect(mixDest)}catch(e){}
    try{const b=mixCtx.createMediaElementSource(bgm);b.connect(mixCtx.destination);b.connect(mixDest)}catch(e){}
    return mixDest;
  }
  async function paint(ctx,now){
    if(!rendering)return;
    // html2canvas is expensive: cap DOM rasterization to 10fps instead of fighting the UI at ~30fps.
    if(now-lastFrame>=100){lastFrame=now;try{
      const snap=await html2canvas(stage,{backgroundColor:'#eef8ff',scale:1,width:1920,height:1080,logging:false,useCORS:true,removeContainer:true,onclone:doc=>{const s=doc.querySelector('.stage');if(s){s.style.transform='none';s.style.transformOrigin='center center';s.style.margin='0'}}});
      ctx.clearRect(0,0,1920,1080);ctx.drawImage(snap,0,0,1920,1080);
    }catch(e){console.warn('record frame',e)}}
    if(rendering)raf=requestAnimationFrame(t=>paint(ctx,t));
  }
  async function startFallback(){
    if(!window.html2canvas||!HTMLCanvasElement.prototype.captureStream||!window.MediaRecorder){recordStatus.textContent='浏览器不支持兼容录制';return}
    try{
      document.body.classList.add('recording-active');recordStatus.textContent='准备当前页…';
      const audio=await audioMix();canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;const ctx=canvas.getContext('2d',{alpha:false});
      // Paint a clean first frame BEFORE MediaRecorder starts, preventing wrong/cropped opening frames.
      const first=await html2canvas(stage,{backgroundColor:'#eef8ff',scale:1,width:1920,height:1080,logging:false,useCORS:true,removeContainer:true,onclone:doc=>{const s=doc.querySelector('.stage');if(s){s.style.transform='none';s.style.transformOrigin='center center';s.style.margin='0'}}});ctx.drawImage(first,0,0,1920,1080);
      const vs=canvas.captureStream(10);stream=new MediaStream([...vs.getVideoTracks(),...audio.stream.getAudioTracks()]);
      const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')?'video/webm;codecs=vp8,opus':'video/webm';const chunks=[];
      rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5500000});rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);rec.onstop=()=>{rendering=false;cancelAnimationFrame(raf);stream?.getTracks().forEach(t=>t.stop());document.body.classList.remove('recording-active');const blob=new Blob(chunks,{type:'video/webm'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`project6-harness-${(stepInfo?.textContent||'current').replace(/\s+/g,'')}.webm`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1800);recordBtn.textContent='● 一键录制';recordBtn.classList.remove('live');recordStatus.textContent='当前页已下载'};
      rec.start(1000);rendering=true;lastFrame=0;raf=requestAnimationFrame(t=>paint(ctx,t));recordBtn.textContent='■ 停止并下载';recordBtn.classList.add('live');recordStatus.textContent=`录制当前页 · ${stepInfo?.textContent||''}`;
      // Do NOT jump to page 1 or force Auto. Record exactly what the user is looking at.
      setTimeout(()=>{if(narration?.paused)speakBtn?.click()},180);
    }catch(e){console.error(e);rendering=false;document.body.classList.remove('recording-active');recordStatus.textContent='兼容录制失败'}
  }
  function stop(){if(rec?.state==='recording')rec.stop()}
  const native=!!(window.isSecureContext&&navigator.mediaDevices?.getDisplayMedia);
  if(!native){recordStatus.textContent='HTTP · 当前页录制';recordBtn.title='从当前画面开始录，只捕获中间 1920×1080 内容。';document.addEventListener('click',e=>{if(e.target!==recordBtn)return;e.preventDefault();e.stopImmediatePropagation();rec?.state==='recording'?stop():startFallback()},true);narration?.addEventListener('ended',()=>{if(rec?.state==='recording')setTimeout(stop,450)})}
  else{recordStatus.textContent='录制就绪';recordBtn.title='HTTPS 原生录制；建议只选择当前标签页。'}
})();