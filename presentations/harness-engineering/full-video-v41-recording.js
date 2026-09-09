/* Project6 · Harness Engineering · v58 recorder launcher */
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
  recordBtn.textContent='● 打开高清录制';
  if(recordMeta)recordMeta.textContent='V58 · SAME VISUAL CHAIN · 1080P / 1440P / 4K';
  recordBtn.addEventListener('click',()=>{
    const url=new URL('./record.html?v=58',location.href);
    const w=window.open(url.href,'project6Recorder','popup=yes,width=1700,height=1050,resizable=yes');
    if(!w) alert('浏览器阻止了录制窗口，请允许本站弹出窗口后再点一次。');
  });
})();