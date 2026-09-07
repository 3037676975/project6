import { chapters, totalSteps, resolveGlobalStep } from './chapters/chapters.js';

const root = document.querySelector('#scene-root');
const stage = document.querySelector('#stage');
const progressFill = document.querySelector('#progress-fill');
const stepLabel = document.querySelector('#step-label');
const audioLabel = document.querySelector('#audio-label');
const narrationPreview = document.querySelector('#narration-preview');
const playButton = document.querySelector('#play-toggle');
const restartButton = document.querySelector('#restart');
const startGate = document.querySelector('#start-gate');
const startButton = document.querySelector('#start-auto');

const state = {
  step: 0,
  auto: false,
  audioMap: { status: 'pending', segments: {} },
  currentAudio: null,
  fallbackTimer: null,
  waitingForStartGesture: false
};

function fitStage() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function segmentKey(info) {
  return `${info.chapter.id}/${info.localStep + 1}`;
}

function stopPlayback() {
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  if (state.fallbackTimer) {
    window.clearTimeout(state.fallbackTimer);
    state.fallbackTimer = null;
  }
}

function updateChrome(info) {
  const percent = ((state.step + 1) / totalSteps) * 100;
  progressFill.style.width = `${percent}%`;
  stepLabel.textContent = `${String(state.step + 1).padStart(2, '0')} / ${String(totalSteps).padStart(2, '0')} · ${info.chapter.title}`;
  narrationPreview.textContent = info.narration;
  const key = segmentKey(info);
  const url = state.audioMap?.segments?.[key];
  audioLabel.textContent = url ? 'ETG1 READY' : 'ETG1 PENDING';
  playButton.textContent = state.auto ? '暂停自动播放' : '自动播放';
}

function render() {
  const info = resolveGlobalStep(state.step);
  root.innerHTML = info.chapter.render(info.localStep);
  updateChrome(info);
}

function nextStep({ fromAuto = false } = {}) {
  stopPlayback();
  if (state.step >= totalSteps - 1) {
    state.auto = false;
    document.body.classList.remove('auto');
    updateChrome(resolveGlobalStep(state.step));
    return false;
  }
  state.step += 1;
  render();
  if (state.auto && fromAuto) playCurrentStep();
  return true;
}

function previousStep() {
  stopPlayback();
  state.auto = false;
  document.body.classList.remove('auto');
  state.step = Math.max(0, state.step - 1);
  render();
}

function fallbackAdvance(info) {
  const estimatedMs = Math.min(12000, Math.max(3200, info.narration.length * 235));
  audioLabel.textContent = `TEXT TIMING · ${Math.round(estimatedMs / 1000)}s`;
  state.fallbackTimer = window.setTimeout(() => {
    state.fallbackTimer = null;
    if (state.auto) nextStep({ fromAuto: true });
  }, estimatedMs);
}

async function playCurrentStep() {
  stopPlayback();
  const info = resolveGlobalStep(state.step);
  const key = segmentKey(info);
  const url = state.audioMap?.segments?.[key];

  if (!state.auto) return;

  if (!url) {
    fallbackAdvance(info);
    return;
  }

  const audio = new Audio(url);
  audio.preload = 'auto';
  state.currentAudio = audio;
  audioLabel.textContent = 'ETG1 PLAYING';

  audio.addEventListener('ended', () => {
    state.currentAudio = null;
    if (state.auto) nextStep({ fromAuto: true });
  }, { once: true });

  audio.addEventListener('error', () => {
    state.currentAudio = null;
    audioLabel.textContent = 'AUDIO ERROR · TEXT FALLBACK';
    if (state.auto) fallbackAdvance(info);
  }, { once: true });

  try {
    await audio.play();
  } catch (error) {
    state.currentAudio = null;
    state.auto = false;
    document.body.classList.remove('auto');
    audioLabel.textContent = '需要点击“自动播放”授权声音';
    updateChrome(info);
  }
}

function startAuto() {
  stopPlayback();
  state.auto = true;
  document.body.classList.add('auto');
  startGate.hidden = true;
  render();
  playCurrentStep();
}

function toggleAuto() {
  if (state.auto) {
    state.auto = false;
    document.body.classList.remove('auto');
    stopPlayback();
    updateChrome(resolveGlobalStep(state.step));
    return;
  }
  startAuto();
}

function restart() {
  stopPlayback();
  state.auto = false;
  document.body.classList.remove('auto');
  state.step = 0;
  render();
}

async function loadAudioMap() {
  try {
    const response = await fetch('./audio-map.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`audio map ${response.status}`);
    state.audioMap = await response.json();
  } catch (error) {
    state.audioMap = { status: 'unavailable', segments: {} };
  }
}

function bindEvents() {
  window.addEventListener('resize', fitStage);
  stage.addEventListener('click', (event) => {
    if (event.target.closest('[data-no-advance]')) return;
    if (state.auto) return;
    nextStep();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && !state.auto) nextStep();
    if (event.key === 'ArrowLeft') previousStep();
    if (event.key === ' ') {
      event.preventDefault();
      toggleAuto();
    }
  });
  playButton.addEventListener('click', toggleAuto);
  restartButton.addEventListener('click', restart);
  startButton.addEventListener('click', startAuto);
}

async function init() {
  fitStage();
  bindEvents();
  await loadAudioMap();
  render();

  const wantsAuto = new URLSearchParams(window.location.search).get('auto') === '1';
  if (wantsAuto) {
    state.waitingForStartGesture = true;
    startGate.hidden = false;
  }
}

init();
