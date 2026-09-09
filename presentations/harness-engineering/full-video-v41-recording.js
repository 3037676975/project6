/* Project6 · Harness Engineering · v50 recorder launcher
 * The preview page no longer records itself. Chrome exits Fullscreen when the
 * screen-share picker opens, which caused the stage to shrink again.
 * v50 opens a dedicated record-only page whose entire tab is the video surface.
 */
(() => {
  const recordBtn=document.getElementById('recordBtn');
  const recordMeta=document.getElementById('recordMeta');
  const soundBtn=document.getElementById('soundBtn');
  const narration=document.getElementById('narration');
  if(!recordBtn)return;
  const SOUND_KEY='project6.harness.sound.enabled';
  let soundEnabled=localStorage.getItem(SOUND_KEY)!=='0';
  function syncSound(){
    if(narration)narration.muted=!soundEnabled;
    if(soundBtn){soundBtn.textContent=soundEnabled?'🔊 声音开':'🔇 声音关';soundBtn.setAttribute('aria-pressed',soundEnabled?'true':'false');soundBtn.classList.toggle('primary',soundEnabled)}
  }
  syncSound();
  soundBtn?.addEventListener('click',()=>{soundEnabled=!soundEnabled;localStorage.setItem(SOUND_KEY,soundEnabled?'1':'0');syncSound()});
  recordBtn.textContent='● 打开 1080P 录制';
  if(recordMeta)recordMeta.textContent='V50 · 专用录制页 · 1920×1080 OUTPUT';
  recordBtn.addEventListener('click',()=>{
    const url=new URL('./record.html?v=50',location.href);
    const w=window.open(url.href,'project6Recorder','popup=yes,width=1600,height=900,resizable=yes');
    if(!w) alert('浏览器阻止了录制窗口，请允许本站弹出窗口后再点一次。');
  });
})();