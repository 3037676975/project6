/* Project6 · Harness Engineering · v42 layout QA hotfix
 * 1) true 16:9 responsive stage frame (visual size == layout size)
 * 2) Harness Engineering as the Scene 001 hero title
 */
(() => {
  const stage = document.getElementById('stage');
  const viewer = document.querySelector('.viewer');
  const shell = document.querySelector('.shell');
  const root = document.getElementById('sceneRoot');
  if (!stage || !viewer || !root) return;

  function ensureFrame(){
    let frame = document.querySelector('.stage-frame');
    if (!frame) {
      frame = document.createElement('div');
      frame.className = 'stage-frame';
      stage.parentNode.insertBefore(frame, stage);
      frame.appendChild(stage);
    }
    return frame;
  }

  const frame = ensureFrame();

  function fitStage(){
    const rect = viewer.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scale = Math.min(rect.width / 1920, rect.height / 1080);
    const w = Math.round(1920 * scale * 1000) / 1000;
    const h = Math.round(1080 * scale * 1000) / 1000;

    frame.style.width = `${w}px`;
    frame.style.height = `${h}px`;
    frame.style.aspectRatio = '16 / 9';

    stage.style.position = 'absolute';
    stage.style.left = '0';
    stage.style.top = '0';
    stage.style.transformOrigin = '0 0';
    stage.style.transform = `scale(${scale})`;
    stage.dataset.scale = scale.toFixed(4);
  }

  let raf = 0;
  function requestFit(){
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitStage);
  }

  addEventListener('resize', requestFit, { passive:true });
  document.addEventListener('fullscreenchange', () => setTimeout(requestFit, 40));
  if (window.ResizeObserver) new ResizeObserver(requestFit).observe(viewer);
  requestFit();

  function patchCover(){
    const scene = root.querySelector('.s001');
    const copy = scene?.querySelector('.copy');
    if (!copy || copy.dataset.coverV42 === '1') return;
    copy.dataset.coverV42 = '1';

    const oldTitle = copy.querySelector(':scope > h1');
    if (oldTitle) oldTitle.classList.add('legacy-cover-question');

    const brand = document.createElement('div');
    brand.className = 'cover-brand-v42';
    brand.innerHTML = `
      <div class="cover-code">PROJECT6 · GARDEN VIDEO ESSAY</div>
      <h1><span>HARNESS</span><em>ENGINEERING</em></h1>
      <div class="cover-question-v42">为什么同一个模型，<br>结果会差这么多？</div>
    `;
    const eyebrow = copy.querySelector('.eyebrow');
    (eyebrow || copy.firstChild)?.after?.(brand);
    if (!brand.parentNode) copy.prepend(brand);

    if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(brand.querySelectorAll('.cover-code,.cover-brand-v42 h1 span,.cover-brand-v42 h1 em,.cover-question-v42'),
        { y:24, opacity:0 },
        { y:0, opacity:1, duration:.7, stagger:.10, ease:'power3.out', delay:.12 }
      );
    }
  }

  new MutationObserver(() => {
    patchCover();
    requestFit();
  }).observe(root, { childList:true, subtree:false });
  patchCover();
})();
