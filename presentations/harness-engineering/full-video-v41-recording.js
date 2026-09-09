/* Project6 · Harness Engineering · v44 local recorder
 * Goal: record ONLY the 1920×1080 video stage + current tab audio.
 * Output: MP4 only when browser supports native MediaRecorder MP4.
 * Storage: browser download only. Nothing is uploaded to Project6 server.
 */
(() => {
  const stage = document.getElementById('stage');
  const recordBtn = document.getElementById('recordBtn');
  const recordMeta = document.getElementById('recordMeta');
  const recordTimer = document.getElementById('recordTimer');
  const status = document.getElementById('status');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const scrub = document.getElementById('scrub');
  if (!stage || !recordBtn || !recordMeta || !window.MediaRecorder) return;

  const LOCAL_RECORD_URL = 'http://127.0.0.1:28444/presentations/harness-engineering/full-video.html?v=44';
  const HTTPS_RECORD_URL = 'https://video.smilechat.cn/presentations/harness-engineering/full-video.html?v=44';
  let recorder = null, capture = null, chunks = [], stopObserver = null, startedAt = 0, timerId = null;

  const formatClock = ms => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(total / 3600)).padStart(2,'0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2,'0');
    const s = String(total % 60).padStart(2,'0');
    return `${h}:${m}:${s}`;
  };

  const stopTimer = () => {
    if (timerId) clearInterval(timerId);
    timerId = null;
  };

  const startTimer = () => {
    stopTimer();
    if (recordTimer) {
      recordTimer.classList.add('live');
      recordTimer.textContent = 'REC 00:00:00';
    }
    timerId = setInterval(() => {
      if (recordTimer) recordTimer.textContent = `REC ${formatClock(Date.now() - startedAt)}`;
    }, 250);
  };

  const resetTimer = (seconds = 0) => {
    stopTimer();
    if (recordTimer) {
      recordTimer.classList.remove('live');
      recordTimer.textContent = seconds ? `DONE ${formatClock(seconds * 1000)}` : 'REC 00:00:00';
    }
  };

  const setRecordUI = (live, text, warn=false) => {
    recordBtn.classList.toggle('live', live);
    recordMeta.classList.toggle('live', live);
    recordMeta.classList.toggle('warn', warn);
    recordBtn.textContent = live ? '■ 停止录制' : '● 一键录制 MP4';
    recordMeta.textContent = text;
    stage.dataset.recording = live ? 'true' : 'false';
  };

  const cleanCapture = () => {
    stopObserver?.disconnect(); stopObserver = null;
    capture?.getTracks().forEach(t => t.stop()); capture = null; recorder = null;
    stage.dataset.recording = 'false';
    stopTimer();
  };

  function preferredMp4Mime() {
    const types = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4;codecs=h264,aac',
      'video/mp4'
    ];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  }

  async function cropExactlyToStage(videoTrack) {
    if (!window.CropTarget || typeof window.CropTarget.fromElement !== 'function' || typeof videoTrack.cropTo !== 'function') {
      throw new Error('当前浏览器不支持精确区域录制。请使用最新版 Chrome / Edge；Project6 不会退化成录整个后台。');
    }
    const cropTarget = await window.CropTarget.fromElement(stage);
    await videoTrack.cropTo(cropTarget);
  }

  async function enforce1080p(videoTrack) {
    try { await videoTrack.applyConstraints({width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:60,max:60}}); } catch (_) {}
    const settings = videoTrack.getSettings?.() || {};
    const width = Number(settings.width || 0), height = Number(settings.height || 0), fps = Math.round(Number(settings.frameRate || 0));
    if (width && height && (width < 1920 || height < 1080)) throw new Error(`当前捕获只有 ${width}×${height}，低于 1080P。请把浏览器窗口放到 1920×1080 或更高分辨率后再录。`);
    return { width: width || 1920, height: height || 1080, fps: fps || 60 };
  }

  function explainSecureContext(){
    const origin = location.origin;
    const protocol = location.protocol;
    const isDomain = location.hostname.toLowerCase() === 'video.smilechat.cn';
    setRecordUI(false, `当前环境不安全 · ${origin}`, true);
    if (status) status.textContent = `RECORDING BLOCKED · ${origin}`;
    const lines = [
      `当前页面：${origin}`,
      `浏览器安全上下文：${window.isSecureContext ? 'YES' : 'NO'}`,
      '',
      protocol === 'http:' ? '原因：当前实际协议仍然是 HTTP。仅仅绑定域名不会自动变成 HTTPS。' : '当前虽然是 HTTPS，但浏览器仍未把该页面判定为安全上下文，请检查证书是否有效。',
      '',
      isDomain ? `请直接打开：${HTTPS_RECORD_URL}` : '推荐使用 HTTPS 域名或 Project6 localhost 录制入口。',
      '',
      `备用 localhost：${LOCAL_RECORD_URL}`
    ];
    alert(lines.join('\n'));
  }

  async function startRecording() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) { explainSecureContext(); return; }

    const mimeType = preferredMp4Mime();
    if (!mimeType) {
      throw new Error('当前浏览器不支持原生 MP4 录制。Project6 不会再下载 WebM。请升级到最新版 Chrome / Edge 后重试。');
    }

    setRecordUI(false, `MP4 READY · ${location.origin} · 请选择当前标签页 + 分享标签页音频`);
    capture = await navigator.mediaDevices.getDisplayMedia({
      video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:60,max:60}},
      audio:true,
      preferCurrentTab:true,
      selfBrowserSurface:'include',
      surfaceSwitching:'exclude',
      systemAudio:'exclude'
    });
    const videoTrack = capture.getVideoTracks()[0];
    const audioTrack = capture.getAudioTracks()[0];
    if (!videoTrack) throw new Error('没有获得视频轨道。');
    if (!audioTrack) throw new Error('没有获得标签页音频。请重新录制并勾选“分享标签页音频”。');
    await cropExactlyToStage(videoTrack);
    const q = await enforce1080p(videoTrack);
    chunks = [];
    const options = {
      mimeType,
      videoBitsPerSecond:12_000_000,
      audioBitsPerSecond:192_000
    };
    recorder = new MediaRecorder(capture, options);
    recorder.addEventListener('dataavailable', e => { if (e.data?.size) chunks.push(e.data); });
    recorder.addEventListener('stop', finishDownload, {once:true});
    videoTrack.addEventListener('ended', () => { if (recorder?.state === 'recording') recorder.stop(); }, {once:true});
    recorder.start(1000);
    startedAt = Date.now();
    startTimer();
    setRecordUI(true, `${q.width}×${q.height} · ${q.fps}fps · MP4 · VIDEO + TAB AUDIO`);
    if (status) status.textContent = 'RECORDING MP4 · STAGE ONLY';
    if (scrub) { scrub.value='0'; scrub.dispatchEvent(new Event('input',{bubbles:true})); }
    setTimeout(() => playBtn?.click(), 260);
    if (status) {
      stopObserver = new MutationObserver(() => {
        if (status.textContent.trim() === 'END' && recorder?.state === 'recording') setTimeout(() => recorder?.state === 'recording' && recorder.stop(), 350);
      });
      stopObserver.observe(status,{childList:true,characterData:true,subtree:true});
    }
  }

  function finishDownload() {
    const seconds = Math.max(1, Math.round((Date.now()-startedAt)/1000));
    const blob = new Blob(chunks,{type:recorder?.mimeType || 'video/mp4'});
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href=url;
    a.download=`project6-harness-1080p-${new Date().toISOString().replace(/[:.]/g,'-')}.mp4`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),3000);
    resetTimer(seconds);
    if (status) status.textContent=`RECORDED MP4 · ${formatClock(seconds*1000)} · LOCAL DOWNLOAD`;
    setRecordUI(false, `MP4 · ${location.origin} · 1080P LOCAL DOWNLOAD`); cleanCapture();
  }

  async function stopRecording(){ if(recorder?.state==='recording'){ pauseBtn?.click(); recorder.stop(); } }

  recordBtn.addEventListener('click', async () => {
    if (recorder?.state === 'recording') { await stopRecording(); return; }
    try { await startRecording(); }
    catch (err) {
      console.error(err); cleanCapture(); resetTimer(); setRecordUI(false,'录制未启动',true);
      if(status) status.textContent=err?.message || '录制失败'; alert(err?.message || '录制失败');
    }
  });

  resetTimer();
  if (!window.isSecureContext) setRecordUI(false, `NOT SECURE · ${location.origin}`, true);
  else {
    const mp4 = preferredMp4Mime();
    setRecordUI(false, mp4 ? `SECURE · MP4 READY · ${location.origin}` : `SECURE · MP4 UNSUPPORTED · ${location.origin}`, !mp4);
  }
})();