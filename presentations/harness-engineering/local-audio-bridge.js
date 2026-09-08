(() => {
  const narration = document.getElementById('narration');
  const autoButton = document.getElementById('modeAuto');
  const speakButton = document.getElementById('speakBtn');
  if (!narration) return;

  let externalMap = null;
  let swapping = false;

  function activeKey() {
    const scene = document.querySelector('.scene.active');
    const index = Number(scene?.dataset?.step || 0) + 1;
    return `01-harness-engineering/${index}`;
  }

  narration.addEventListener('play', () => {
    if (!externalMap || swapping) return;
    const wanted = externalMap[activeKey()];
    if (!wanted || narration.src === wanted || narration.currentSrc === wanted) return;
    swapping = true;
    narration.pause();
    narration.src = wanted;
    narration.currentTime = 0;
    const p = narration.play();
    if (p?.finally) p.finally(() => { swapping = false; });
    else swapping = false;
  }, true);

  window.Project6AudioBridge = {
    setAudioMap(map) {
      externalMap = map && typeof map === 'object' ? map : null;
      return Boolean(externalMap);
    },
    clear() {
      externalMap = null;
    },
    startAuto() {
      autoButton?.click();
      document.querySelector('[data-step="0"]')?.scrollIntoView?.({block:'nearest'});
      if (document.querySelector('.scene.active')?.dataset?.step !== '0') {
        location.reload();
        return false;
      }
      setTimeout(() => speakButton?.click(), 80);
      return true;
    }
  };
})();
