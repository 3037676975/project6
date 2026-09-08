/* Project6 · Harness Engineering · Chapter 1 v22
 * Garden-aligned runtime.
 *
 * Synchronization contract:
 * 1) Garden Step owns one narration audio file.
 * 2) SentenceBoundary timings trigger only sentence-level visual phases.
 * 3) No guessed currentTime thresholds inside a sentence.
 * 4) GSAP never changes Garden Step.
 * 5) Auto advances only after narration ended + 200ms buffer.
 */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const scenes = $$('.scene');
  const stage = $('.stage');
  const viewer = $('.viewer');
  const narration = $('#narration');
  const bgm = $('#bgm');
  const modeManual = $('#modeManual');
  const modeAuto = $('#modeAuto');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const speakBtn = $('#speakBtn');
  const stepInfo = $('#stepInfo');
  const musicSelect = $('#musicSelect');
  const musicVolume = $('#musicVolume');
  const musicUpload = $('#musicUpload');
  const recordBtn = $('#recordBtn');
  const recordStatus = $('#recordStatus');

  if (!stage || !viewer || !narration || !window.gsap) return;
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
  if (window.DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audioKey = i => `01-harness-engineering/${i + 1}`;
  let current = 0;
  let mode = 'manual';
  let audioMap = null;
  let timings = null;
  let cueCursor = -1;
  let ambientTweens = [];
  let objectMusicUrl = null;
  let recorder = null;
  let capture = null;
  let chunks = [];

  function fit() {
    const r = viewer.getBoundingClientRect();
    const scale = Math.min(r.width / 1920, r.height / 1080);
    stage.style.transform = `scale(${scale})`;
  }
  addEventListener('resize', fit);
  fit();

  function setProgress() {
    scenes.forEach((scene, i) => {
      $$('.progress-dots span', scene).forEach((d, j) => d.classList.toggle('on', j === i));
    });
    if (stepInfo) stepInfo.textContent = `${String(current + 1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;
  }

  function killAmbient() {
    ambientTweens.forEach(t => t?.kill?.());
    ambientTweens = [];
  }

  function fadeIn(nodes, vars={}) {
    const list = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;
    if (!list || (Array.isArray(list) && !list.length)) return;
    gsap.to(list, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: reduced ? .01 : (vars.duration ?? .55),
      stagger: reduced ? 0 : (vars.stagger ?? .07),
      ease: vars.ease ?? 'power3.out',
      overwrite: 'auto'
    });
  }

  function setHidden(nodes, vars={}) {
    const list = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;
    if (!list || (Array.isArray(list) && !list.length)) return;
    gsap.set(list, {opacity:0, y:vars.y ?? 18, x:vars.x ?? 0, scale:vars.scale ?? 1});
  }

  function prepareScene(i) {
    const s = scenes[i];
    killAmbient();
    cueCursor = -1;

    if (i === 0) {
      setHidden($$('.copy .kicker,.copy .eyebrow,.copy .hero-title,.copy .hero-copy,.cover-proof', s));
      setHidden($('.runtime-shell', s), {y:24});
      setHidden($('.core', s), {scale:.94, y:0});
      setHidden($$('.port', s), {y:12});
      if (window.DrawSVGPlugin) gsap.set($$('.orbit path', s), {drawSVG:'0%'});
      else gsap.set($$('.orbit path', s), {opacity:.15});
      gsap.set($('.flow-dot', s), {opacity:0});
    }
    if (i === 1) {
      setHidden($$('.heading .eyebrow,.heading .hero-title', s));
      setHidden($('.breakdown', s), {y:22});
      setHidden($$('.exec-node', s), {y:14});
      gsap.set($('.exec-line .progress', s), {width:'0%'});
      setHidden($('.failure-note', s), {y:10});
    }
    if (i === 2) {
      setHidden($$('.heading .eyebrow,.heading .hero-title', s));
      setHidden($('.workbench-base', s), {scale:.985,y:10});
      setHidden($('.workbench-core', s), {scale:.95,y:0});
      setHidden($$('.module', s), {y:14});
      setHidden($('.workbench-label', s), {y:8});
      if (window.DrawSVGPlugin) gsap.set($$('.workbench-svg path', s), {drawSVG:'0%'});
      else gsap.set($$('.workbench-svg path', s), {opacity:.25});
    }
    if (i === 3) {
      setHidden($$('.heading .eyebrow,.heading .hero-title', s));
      setHidden($('.control-frame', s), {scale:.99,y:12});
      setHidden($('.prompt-ticket', s), {x:-18,y:0});
      setHidden($$('.env-item', s), {y:14});
      setHidden($('.frame-caption', s), {y:8});
    }
    if (i === 4) {
      setHidden($$('.heading .eyebrow,.heading .hero-title', s));
      setHidden($('.research-loop', s), {x:14,y:0});
      setHidden($('.prompt-only', s), {x:-14,y:0});
      setHidden($$('.company-dot', s), {y:9});
      setHidden($$('.loop-step', s), {scale:.97,y:8});
      setHidden($('.loop-message', s), {y:8});
      setHidden($('.straight-line', s), {y:8});
      if (window.DrawSVGPlugin) gsap.set($('.loop-svg path', s), {drawSVG:'0%'});
      else gsap.set($('.loop-svg path', s), {opacity:.25});
      gsap.set($('.loop-dot', s), {opacity:0});
    }
    if (i === 5) {
      setHidden($$('.summary .eyebrow,.summary .hero-title', s));
      setHidden($$('.eq-card,.operator', s), {y:15});
      setHidden($$('.foundation span,.foundation i', s), {y:8});
      setHidden($('.final-line', s), {y:9});
    }
  }

  function finishScene(i) {
    const s = scenes[i];
    gsap.set($$('*', s).filter(el => getComputedStyle(el).opacity === '0'), {opacity:1, x:0, y:0, scale:1});
    if (i === 0 || i === 2 || i === 4) {
      const paths = $$('svg path', s);
      if (window.DrawSVGPlugin && paths.length) gsap.set(paths, {drawSVG:'100%'});
    }
    if (i === 1) gsap.set($('.exec-line .progress', s), {width:'100%'});
  }

  function startAmbient(i) {
    killAmbient();
    if (reduced) return;
    const s = scenes[i];
    if (i === 0 && window.MotionPathPlugin) {
      const dot = $('.flow-dot', s);
      const path = $('.orbit path.hot', s);
      if (dot && path) {
        gsap.set(dot,{opacity:1});
        ambientTweens.push(gsap.to(dot,{duration:3.8,repeat:-1,ease:'none',motionPath:{path,align:path,alignOrigin:[.5,.5]}}));
      }
    }
    if (i === 2) {
      const core = $('.workbench-core', s);
      if (core) ambientTweens.push(gsap.to(core,{y:-3,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    }
    if (i === 4 && window.MotionPathPlugin) {
      const dot = $('.loop-dot', s);
      const path = $('.loop-svg path', s);
      if (dot && path) {
        gsap.set(dot,{opacity:1});
        ambientTweens.push(gsap.to(dot,{duration:4.6,repeat:-1,ease:'none',motionPath:{path,align:path,alignOrigin:[.5,.5]}}));
      }
    }
  }

  function fireCue(step, idx) {
    const s = scenes[step];
    if (!s) return;

    if (step === 0) {
      if (idx === 0) fadeIn($$('.copy .kicker,.copy .eyebrow,.copy .hero-title', s), {stagger:.08});
      if (idx === 1) { fadeIn($('.copy .hero-copy', s)); fadeIn($('.runtime-shell', s), {duration:.65}); fadeIn($('.core', s), {duration:.5}); }
      if (idx === 2) {
        const paths = $$('.orbit path', s);
        if (window.DrawSVGPlugin) gsap.to(paths,{drawSVG:'100%',duration:reduced?.01:.9,stagger:.08,ease:'power2.inOut'}); else gsap.to(paths,{opacity:1,duration:.4});
        fadeIn($$('.port', s), {stagger:.08,duration:.45});
      }
      if (idx === 3) { fadeIn($('.cover-proof', s)); startAmbient(step); }
    }

    if (step === 1) {
      if (idx === 0) { fadeIn($$('.heading .eyebrow,.heading .hero-title', s)); fadeIn($('.breakdown', s), {duration:.65}); }
      if (idx === 1) fadeIn($$('.exec-node', s), {stagger:.06});
      if (idx === 2) {
        gsap.to($('.exec-line .progress', s),{width:'100%',duration:reduced?.01:1.05,ease:'power2.inOut'});
        $$('.exec-node', s).forEach((node,n)=>node.classList.toggle('broken',n>0 && n<4));
      }
      if (idx === 3) fadeIn($('.failure-note', s));
    }

    if (step === 2) {
      if (idx === 0) fadeIn($$('.heading .eyebrow,.heading .hero-title', s));
      if (idx === 1) {
        fadeIn($('.workbench-base', s), {duration:.7});
        fadeIn($('.workbench-core', s), {duration:.55});
        const paths = $$('.workbench-svg path', s);
        if (window.DrawSVGPlugin) gsap.to(paths,{drawSVG:'100%',duration:reduced?.01:.9,stagger:.06,ease:'power2.inOut'});
        fadeIn($$('.module', s), {stagger:.07,duration:.48});
      }
      if (idx === 2) { fadeIn($('.workbench-label', s)); startAmbient(step); }
    }

    if (step === 3) {
      if (idx === 0) { fadeIn($$('.heading .eyebrow,.heading .hero-title', s)); fadeIn($('.control-frame', s), {duration:.7}); }
      if (idx === 1) fadeIn($('.prompt-ticket', s), {duration:.55});
      if (idx === 2) gsap.fromTo($('.control-frame', s),{boxShadow:'0 1px 2px rgba(67,48,43,.04),0 24px 60px rgba(67,48,43,.10)'},{boxShadow:'0 1px 2px rgba(67,48,43,.04),0 30px 70px rgba(20,184,166,.18)',duration:reduced?.01:.6,yoyo:true,repeat:1});
      if (idx === 3) fadeIn($$('.env-item', s), {stagger:.08,duration:.48});
      if (idx === 4) fadeIn($('.frame-caption', s));
    }

    if (step === 4) {
      if (idx === 0) fadeIn($$('.heading .eyebrow,.heading .hero-title', s));
      if (idx === 1) { fadeIn($('.prompt-only', s), {duration:.55}); fadeIn($$('.company-dot', s), {stagger:.035,duration:.34}); }
      if (idx === 2) fadeIn($('.straight-line', s));
      if (idx === 3) fadeIn($('.research-loop', s), {duration:.62});
      if (idx === 4) {
        fadeIn($$('.loop-step', s), {stagger:.07,duration:.43});
        const path = $('.loop-svg path', s);
        if (window.DrawSVGPlugin && path) gsap.to(path,{drawSVG:'100%',duration:reduced?.01:1.1,ease:'power2.inOut'});
        if (!window.DrawSVGPlugin && path) gsap.to(path,{opacity:1,duration:.5});
        startAmbient(step);
      }
      if (idx === 5) fadeIn($('.loop-message', s));
    }

    if (step === 5) {
      if (idx === 0) {
        fadeIn($$('.summary .eyebrow,.summary .hero-title', s));
        fadeIn($$('.eq-card,.operator', s), {stagger:.08,duration:.52});
        fadeIn($$('.foundation span,.foundation i', s), {stagger:.045,duration:.38});
      }
      if (idx === 1) fadeIn($('.final-line', s), {duration:.6});
    }
  }

  function cueData() {
    return timings?.segments?.[audioKey(current)]?.cues || [];
  }
  function audioSrc() {
    return audioMap?.segments?.[audioKey(current)] || '';
  }

  function showScene(i, {preview=false}={}) {
    const next = Math.max(0, Math.min(scenes.length - 1, i));
    narration.pause();
    narration.removeAttribute('src');
    narration.load();
    killAmbient();
    scenes.forEach((s,n)=>s.classList.toggle('active', n === next));
    current = next;
    setProgress();
    prepareScene(current);
    if (preview) {
      const cues = timings?.segments?.[audioKey(current)]?.cues || [];
      for (let i=0;i<cues.length;i++) fireCue(current,i);
      finishScene(current);
      startAmbient(current);
    }
  }

  async function playCurrent() {
    killAmbient();
    cueCursor = -1;
    prepareScene(current);
    const src = audioSrc();
    if (!src) {
      if (recordStatus) recordStatus.textContent = '当前旁白缺失';
      return;
    }
    narration.src = src;
    narration.currentTime = 0;
    fireCue(current,0);
    cueCursor = 0;
    try {
      await narration.play();
    } catch (err) {
      console.warn('Narration play blocked', err);
      if (recordStatus) recordStatus.textContent = '点击播放以授权音频';
    }
  }

  narration.addEventListener('timeupdate', () => {
    const cues = cueData();
    for (let i=cueCursor+1;i<cues.length;i++) {
      if (narration.currentTime >= Math.max(0, Number(cues[i].start || 0) - .04)) {
        fireCue(current,i);
        cueCursor = i;
      } else break;
    }
  });

  narration.addEventListener('ended', () => {
    finishScene(current);
    startAmbient(current);
    if (mode === 'auto' && current < scenes.length - 1) {
      setTimeout(() => {
        showScene(current + 1);
        requestAnimationFrame(playCurrent);
      }, 200);
    } else if (mode === 'auto' && current === scenes.length - 1) {
      fadeBgm();
      if (recorder?.state === 'recording') setTimeout(stopRecording, 350);
    }
  });

  narration.addEventListener('error', () => {
    if (recordStatus) recordStatus.textContent = '旁白加载失败';
  });

  function setMode(next) {
    mode = next;
    modeManual?.classList.toggle('on', mode === 'manual');
    modeAuto?.classList.toggle('on', mode === 'auto');
  }

  modeManual?.addEventListener('click',()=>setMode('manual'));
  modeAuto?.addEventListener('click',()=>setMode('auto'));
  prevBtn?.addEventListener('click',()=>showScene(current-1,{preview:true}));
  nextBtn?.addEventListener('click',()=>showScene(current+1,{preview:true}));
  speakBtn?.addEventListener('click',playCurrent);
  stage.addEventListener('click', e => {
    if (mode === 'manual' && !e.target.closest('[data-no-advance],button,input,select,a')) showScene(current+1,{preview:true});
  });
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') showScene(current+1,{preview:true});
    if (e.key === 'ArrowLeft') showScene(current-1,{preview:true});
  });

  const musicMap = {
    none:'',
    tech:'./public/audio/bgm/short-plingy-loop.ogg',
    calm:'./public/audio/bgm/calm-loop.mp3',
    other:'./public/audio/bgm/other-center.ogg'
  };
  function setMusic(src) {
    bgm.pause();
    bgm.currentTime = 0;
    if (!src) { bgm.removeAttribute('src'); bgm.load(); return; }
    bgm.src = src;
    bgm.loop = true;
    bgm.volume = Number(musicVolume?.value || 8) / 100;
    bgm.play().catch(()=>{});
  }
  musicSelect?.addEventListener('change',()=>{
    if (musicSelect.value === 'upload') { musicUpload?.click(); return; }
    setMusic(musicMap[musicSelect.value] || '');
  });
  musicUpload?.addEventListener('change',()=>{
    const f = musicUpload.files?.[0];
    if (!f) return;
    if (objectMusicUrl) URL.revokeObjectURL(objectMusicUrl);
    objectMusicUrl = URL.createObjectURL(f);
    musicSelect.value = 'upload';
    setMusic(objectMusicUrl);
  });
  musicVolume?.addEventListener('input',()=>bgm.volume = Number(musicVolume.value)/100);
  function fadeBgm() {
    if (!bgm.src || bgm.paused) return;
    const from = bgm.volume;
    const started = performance.now();
    const tick = now => {
      const p = Math.min(1,(now-started)/700);
      bgm.volume = from * (1-p);
      if (p<1) requestAnimationFrame(tick);
      else bgm.pause();
    };
    requestAnimationFrame(tick);
  }

  async function startRecording() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) {
      if (recordStatus) recordStatus.textContent = 'HTTPS 才能录制';
      return;
    }
    try {
      if (recordStatus) recordStatus.textContent = '等待屏幕授权';
      capture = await navigator.mediaDevices.getDisplayMedia({video:{frameRate:60},audio:true,preferCurrentTab:true});
      chunks = [];
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm';
      recorder = new MediaRecorder(capture,{mimeType:mime,videoBitsPerSecond:6500000});
      recorder.addEventListener('dataavailable',e=>e.data.size && chunks.push(e.data));
      recorder.addEventListener('stop',()=>{
        const blob = new Blob(chunks,{type:'video/webm'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project6-harness-chapter1-v22.webm';
        a.click();
        setTimeout(()=>URL.revokeObjectURL(url),1800);
        capture?.getTracks().forEach(t=>t.stop());
        recordBtn?.classList.remove('record-live');
        if (recordBtn) recordBtn.textContent = '● 一键录制';
        if (recordStatus) recordStatus.textContent = '已下载';
      });
      recorder.start(1000);
      recordBtn?.classList.add('record-live');
      if (recordBtn) recordBtn.textContent = '■ 停止并下载';
      if (recordStatus) recordStatus.textContent = '录制中';
      setMode('auto');
      showScene(0);
      setTimeout(playCurrent,280);
    } catch (err) {
      console.error(err);
      if (recordStatus) recordStatus.textContent = err?.name === 'NotAllowedError' ? '已取消' : '录制失败';
    }
  }
  function stopRecording() {
    if (recorder?.state === 'recording') recorder.stop();
  }
  recordBtn?.addEventListener('click',()=>recorder?.state === 'recording' ? stopRecording() : startRecording());

  async function loadData() {
    const [a,t] = await Promise.all([
      fetch('./audio-map.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('audio-map');return r.json()}),
      fetch('./timings.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('timings');return r.json()})
    ]);
    audioMap = a;
    timings = t;
  }

  loadData()
    .then(()=>showScene(0,{preview:true}))
    .catch(err=>{
      console.error(err);
      showScene(0,{preview:true});
      if (recordStatus) recordStatus.textContent = '同步数据加载失败';
    });
})();
