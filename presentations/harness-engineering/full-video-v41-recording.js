/* Project6 · Harness Engineering · v46 local recorder
 * v46 goals:
 * - resilient getDisplayMedia fallback when strict capture hints fail
 * - recording can always be stopped, even if MediaRecorder/capture states drift
 * - playback sound toggle is independent and persisted
 * - audio capture is optional: sound OFF => video-only recording
 * - exact Stage crop remains mandatory when supported
 */
(() => {
  const stage = document.getElementById('stage');
  const recordBtn = document.getElementById('recordBtn');
  const soundBtn = document.getElementById('soundBtn');
  const recordMeta = document.getElementById('recordMeta');
  const recordTimer = document.getElementById('recordTimer');
  const status = document.getElementById('status');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const scrub = document.getElementById('scrub');
  const narration = document.getElementById('narration');
  if (!stage || !recordBtn || !recordMeta || !window.MediaRecorder) return;

  const SOUND_KEY = 'project6.harness.sound.enabled';
  let soundEnabled = localStorage.getItem(SOUND_KEY) !== '0';
  let recorder = null;
  let capture = null;
  let chunks = [];
  let stopObserver = null;
  let startedAt = 0;
  let timerId = null;
  let phase = 'idle';
  let outputExt = 'webm';
  let outputMime = 'video/webm';

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const formatClock = ms => {
    const total = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(total / 3600)).padStart(2,'0')}:${String(Math.floor((total % 3600) / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
  };

  function syncSoundUI(){
    if (narration) narration.muted = !soundEnabled;
    if (soundBtn) {
      soundBtn.textContent = soundEnabled ? '🔊 声音开' : '🔇 声音关';
      soundBtn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
      soundBtn.classList.toggle('primary', soundEnabled);
    }
  }
  syncSoundUI();
  soundBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem(SOUND_KEY, soundEnabled ? '1' : '0');
    syncSoundUI();
    if (recordMeta && phase === 'idle') recordMeta.textContent = soundEnabled ? '播放声音：开 · 录制可带标签页声音' : '播放声音：关 · 录制为静音视频';
  });

  function startTimer(){
    stopTimer();
    recordTimer?.classList.add('live');
    if (recordTimer) recordTimer.textContent = 'REC 00:00:00';
    timerId = setInterval(() => {
      if (recordTimer) recordTimer.textContent = `REC ${formatClock(Date.now() - startedAt)}`;
    }, 250);
  }
  function stopTimer(){ if (timerId) clearInterval(timerId); timerId = null; }
  function resetTimer(doneMs = 0){
    stopTimer();
    recordTimer?.classList.remove('live');
    if (recordTimer) recordTimer.textContent = doneMs ? `DONE ${formatClock(doneMs)}` : 'REC 00:00:00';
  }

  function setRecordUI(live, text, warn=false){
    recordBtn.classList.toggle('live', live);
    recordMeta.classList.toggle('live', live);
    recordMeta.classList.toggle('warn', warn);
    recordBtn.textContent = live ? '■ 停止录制' : '● 一键录制';
    recordMeta.textContent = text;
    stage.dataset.recording = live ? 'true' : 'false';
  }

  function stopTracks(){
    try { capture?.getTracks().forEach(t => { try { t.stop(); } catch(_){} }); } catch(_){}
  }
  function cleanup(){
    stopObserver?.disconnect(); stopObserver = null;
    stopTracks();
    capture = null;
    recorder = null;
    phase = 'idle';
    stage.dataset.recording = 'false';
  }

  function chooseMime(){
    const candidates = [
      ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],
      ['video/mp4;codecs=avc1,mp4a.40.2','mp4'],
      ['video/mp4','mp4'],
      ['video/webm;codecs=vp9,opus','webm'],
      ['video/webm;codecs=vp8,opus','webm'],
      ['video/webm','webm']
    ];
    for (const [mime,ext] of candidates) {
      if (MediaRecorder.isTypeSupported(mime)) return {mime,ext};
    }
    return {mime:'',ext:'webm'};
  }

  async function requestDisplay(){
    const attempts = [
      { video: true, audio: soundEnabled },
      { video: true, audio: false }
    ];
    let lastErr = null;
    for (const constraints of attempts) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        if (stream?.getVideoTracks?.().length) return stream;
        stream?.getTracks?.().forEach(t => t.stop());
      } catch (err) {
        lastErr = err;
        if (err?.name === 'NotAllowedError' || err?.name === 'AbortError') throw err;
      }
    }
    throw lastErr || new Error('无法启动屏幕视频源。请重新选择“当前标签页”，不要选择空白窗口。');
  }

  async function cropExactlyToStage(videoTrack){
    if (!window.CropTarget || typeof window.CropTarget.fromElement !== 'function' || typeof videoTrack.cropTo !== 'function') {
      throw new Error('当前浏览器不支持精确区域录制。请使用最新版 Chrome / Edge。');
    }
    const target = await window.CropTarget.fromElement(stage);
    await videoTrack.cropTo(target);
  }

  async function resetPlayer(){
    pauseBtn?.click();
    if (scrub) {
      scrub.value = '0';
      scrub.dispatchEvent(new Event('input',{bubbles:true}));
      scrub.dispatchEvent(new Event('change',{bubbles:true}));
    }
    if (narration) { try { narration.pause(); narration.currentTime = 0; narration.muted = !soundEnabled; } catch(_){} }
    await nextFrame();
    await sleep(100);
  }

  async function finishDownload(){
    const elapsed = Math.max(1000, Date.now() - startedAt);
    const blob = chunks.length ? new Blob(chunks,{type:outputMime}) : null;
    if (!blob || blob.size < 16 * 1024) {
      resetTimer(); cleanup(); setRecordUI(false,'录制没有产生有效数据',true);
      alert('录制没有产生有效视频数据，请重试。');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project6-harness-v46-${new Date().toISOString().replace(/[:.]/g,'-')}.${outputExt}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    resetTimer(elapsed);
    if (status) status.textContent = `RECORDED ${outputExt.toUpperCase()} · ${formatClock(elapsed)} · ${(blob.size/1024/1024).toFixed(1)}MB`;
    cleanup();
    setRecordUI(false, `${outputExt.toUpperCase()} · LOCAL DOWNLOAD · ${soundEnabled ? 'SOUND ON' : 'MUTED'}`);
  }

  async function stopRecording(reason='manual'){
    if (phase === 'idle') return;
    phase = 'stopping';
    setRecordUI(true, `STOPPING · ${reason}`);
    pauseBtn?.click();
    stopObserver?.disconnect(); stopObserver = null;
    try {
      if (recorder && recorder.state !== 'inactive') {
        try { recorder.requestData(); } catch(_){}
        await sleep(80);
        if (recorder.state !== 'inactive') recorder.stop();
      } else {
        stopTracks(); cleanup(); resetTimer(); setRecordUI(false,'录制已停止');
      }
    } catch (err) {
      console.error(err);
      stopTracks(); cleanup(); resetTimer(); setRecordUI(false,'录制已强制停止',true);
    }
  }

  async function startRecording(){
    if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) {
      throw new Error('当前页面不允许屏幕录制。请使用 HTTPS 地址，并用最新版 Chrome / Edge。');
    }
    if (phase !== 'idle') return;
    phase = 'starting';
    setRecordUI(true, '正在打开浏览器录制选择器…');

    capture = await requestDisplay();
    const videoTrack = capture.getVideoTracks()[0];
    if (!videoTrack) throw new Error('没有获得视频轨道。');
    videoTrack.addEventListener('ended', () => stopRecording('浏览器停止共享'), {once:true});

    await cropExactlyToStage(videoTrack);
    await resetPlayer();

    const chosen = chooseMime();
    outputMime = chosen.mime || 'video/webm';
    outputExt = chosen.ext;
    chunks = [];
    const options = chosen.mime ? {mimeType:chosen.mime,videoBitsPerSecond:12_000_000,audioBitsPerSecond:192_000} : {videoBitsPerSecond:12_000_000};
    recorder = new MediaRecorder(capture, options);
    recorder.addEventListener('dataavailable', e => { if (e.data?.size) chunks.push(e.data); });
    recorder.addEventListener('stop', finishDownload, {once:true});
    recorder.addEventListener('error', e => { console.error('MediaRecorder error', e); stopRecording('Recorder Error'); });

    recorder.start();
    phase = 'recording';
    startedAt = Date.now();
    startTimer();
    setRecordUI(true, `${outputExt.toUpperCase()} · STAGE ONLY · ${soundEnabled && capture.getAudioTracks().length ? 'SOUND ON' : 'MUTED'} · 点击这里停止`);
    if (status) status.textContent = 'RECORDING · V46';
    playBtn?.click();

    if (status) {
      stopObserver = new MutationObserver(() => {
        if (status.textContent.trim() === 'END' && phase === 'recording') setTimeout(() => stopRecording('END'), 400);
      });
      stopObserver.observe(status,{childList:true,characterData:true,subtree:true});
    }
  }

  recordBtn.addEventListener('click', async () => {
    if (phase === 'recording' || phase === 'starting' || phase === 'stopping') { await stopRecording('手动停止'); return; }
    try {
      await startRecording();
    } catch (err) {
      console.error(err);
      stopTracks(); cleanup(); resetTimer(); setRecordUI(false,'录制未启动',true);
      if (status) status.textContent = err?.message || '录制失败';
      const msg = err?.message || '录制失败';
      alert(msg.includes('Could not start video source') ? '浏览器没有成功启动屏幕视频源。v46 已自动改用兼容模式；请再次点击录制，在弹窗里选择“当前标签页”。' : msg);
    }
  });

  window.addEventListener('beforeunload', stopTracks);
  resetTimer();
  setRecordUI(false, soundEnabled ? 'V46 READY · SOUND ON' : 'V46 READY · MUTED');
})();
