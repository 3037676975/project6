/* Project6 · Harness Engineering · v41 local recorder
 * Goal: record ONLY the 1920×1080 video stage + current tab audio.
 * Storage: browser download only. Nothing is uploaded to Project6 server.
 * Exact stage-only capture requires Chromium Region Capture (CropTarget + cropTo).
 */
(() => {
  const stage = document.getElementById('stage');
  const recordBtn = document.getElementById('recordBtn');
  const recordMeta = document.getElementById('recordMeta');
  const status = document.getElementById('status');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const scrub = document.getElementById('scrub');
  if (!stage || !recordBtn || !recordMeta || !window.MediaRecorder) return;

  let recorder = null;
  let capture = null;
  let chunks = [];
  let stopObserver = null;
  let startedAt = 0;

  const setRecordUI = (live, text) => {
    recordBtn.classList.toggle('live', live);
    recordMeta.classList.toggle('live', live);
    recordBtn.textContent = live ? '■ 停止录制' : '● 一键录制 1080P';
    recordMeta.textContent = text;
    stage.dataset.recording = live ? 'true' : 'false';
  };

  const cleanCapture = () => {
    stopObserver?.disconnect();
    stopObserver = null;
    capture?.getTracks().forEach(t => t.stop());
    capture = null;
    recorder = null;
    stage.dataset.recording = 'false';
  };

  function preferredMime() {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  }

  async function cropExactlyToStage(videoTrack) {
    if (!window.CropTarget || typeof window.CropTarget.fromElement !== 'function' || typeof videoTrack.cropTo !== 'function') {
      throw new Error('当前浏览器不支持精确区域录制。请使用最新版 Chrome / Edge，再录制；Project6 不会退化成录整个后台。');
    }
    const cropTarget = await window.CropTarget.fromElement(stage);
    await videoTrack.cropTo(cropTarget);
  }

  async function enforce1080p(videoTrack) {
    try {
      await videoTrack.applyConstraints({
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60, max: 60 }
      });
    } catch (_) {
      // The final settings check below is authoritative.
    }
    const settings = videoTrack.getSettings?.() || {};
    const width = Number(settings.width || 0);
    const height = Number(settings.height || 0);
    const fps = Math.round(Number(settings.frameRate || 0));
    if (width && height && (width < 1920 || height < 1080)) {
      throw new Error(`当前捕获只有 ${width}×${height}，低于 1080P。请把浏览器窗口放到 1920×1080 或更高分辨率后再录。`);
    }
    return { width: width || 1920, height: height || 1080, fps: fps || 60 };
  }

  async function startRecording() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) {
      throw new Error('录制需要 HTTPS 或 localhost 环境。');
    }
    setRecordUI(false, '等待你选择“当前标签页 + 分享标签页音频”');

    capture = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60, max: 60 }
      },
      audio: true,
      preferCurrentTab: true,
      selfBrowserSurface: 'include',
      surfaceSwitching: 'exclude',
      systemAudio: 'exclude'
    });

    const videoTrack = capture.getVideoTracks()[0];
    const audioTrack = capture.getAudioTracks()[0];
    if (!videoTrack) throw new Error('没有获得视频轨道。');
    if (!audioTrack) throw new Error('没有获得标签页音频。请重新录制并勾选“分享标签页音频”。');

    await cropExactlyToStage(videoTrack);
    const q = await enforce1080p(videoTrack);

    chunks = [];
    const mimeType = preferredMime();
    const options = {
      videoBitsPerSecond: 12_000_000,
      audioBitsPerSecond: 192_000
    };
    if (mimeType) options.mimeType = mimeType;

    recorder = new MediaRecorder(capture, options);
    recorder.addEventListener('dataavailable', e => { if (e.data?.size) chunks.push(e.data); });
    recorder.addEventListener('stop', finishDownload, { once: true });
    videoTrack.addEventListener('ended', () => {
      if (recorder?.state === 'recording') recorder.stop();
    }, { once: true });

    recorder.start(1000);
    startedAt = Date.now();
    setRecordUI(true, `${q.width}×${q.height} · ${q.fps}fps · VIDEO + TAB AUDIO · LOCAL`);
    if (status) status.textContent = 'RECORDING · STAGE ONLY';

    // One-click behavior: reset to Scene 001 and start the full video after capture is armed.
    if (scrub) {
      scrub.value = '0';
      scrub.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setTimeout(() => playBtn?.click(), 260);

    // Stop automatically when the player reaches END.
    if (status) {
      stopObserver = new MutationObserver(() => {
        if (status.textContent.trim() === 'END' && recorder?.state === 'recording') {
          setTimeout(() => recorder?.state === 'recording' && recorder.stop(), 350);
        }
      });
      stopObserver.observe(status, { childList: true, characterData: true, subtree: true });
    }
  }

  function finishDownload() {
    const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const mime = recorder?.mimeType || 'video/webm';
    const blob = new Blob(chunks, { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project6-harness-1080p-${new Date().toISOString().replace(/[:.]/g,'-')}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    if (status) status.textContent = `RECORDED · ${seconds}s · LOCAL DOWNLOAD`;
    setRecordUI(false, '1080P · 60FPS · STAGE ONLY · LOCAL DOWNLOAD');
    cleanCapture();
  }

  async function stopRecording() {
    if (recorder?.state === 'recording') {
      pauseBtn?.click();
      recorder.stop();
    }
  }

  recordBtn.addEventListener('click', async () => {
    if (recorder?.state === 'recording') {
      await stopRecording();
      return;
    }
    try {
      await startRecording();
    } catch (err) {
      console.error(err);
      cleanCapture();
      setRecordUI(false, '录制未启动');
      if (status) status.textContent = err?.message || '录制失败';
      alert(err?.message || '录制失败');
    }
  });

  setRecordUI(false, '1080P · 60FPS · STAGE ONLY · LOCAL DOWNLOAD');
})();
