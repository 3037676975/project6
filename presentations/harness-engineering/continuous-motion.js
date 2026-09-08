/* Project6 Harness Chapter 1 — continuous ambient motion layer
 * Purpose: keep relationships alive after narration-triggered GSAP reveals finish.
 * Rules: ambient motion never owns Step navigation, never changes layout, and stops immediately when a scene deactivates.
 */
(() => {
  if (!window.gsap || !window.MotionPathPlugin) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sceneLoops = new Map();
  const ns = 'http://www.w3.org/2000/svg';

  function addEmoji(root, text, cls, x, y) {
    if (root.querySelector('.' + cls)) return;
    const el = document.createElement('div');
    el.className = `ambient-emoji ${cls}`;
    el.textContent = text;
    el.style.left = x;
    el.style.top = y;
    root.appendChild(el);
  }

  function svgParticle(svg, cls) {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', '6');
    c.setAttribute('class', `ambient-particle ${cls}`);
    svg.appendChild(c);
    return c;
  }

  function killScene(scene) {
    const loops = sceneLoops.get(scene) || [];
    loops.forEach(a => a?.kill?.());
    sceneLoops.delete(scene);
    scene.querySelectorAll('.ambient-particle').forEach(n => n.remove());
    gsap.set(scene.querySelectorAll('.ambient-emoji'), {clearProps:'transform,opacity'});
  }

  function register(scene, ...animations) {
    sceneLoops.set(scene, animations.filter(Boolean));
  }

  function scene0(scene) {
    const svg = scene.querySelector('.network svg');
    const path = scene.querySelector('#heroPath');
    if (!svg || !path) return;
    addEmoji(scene, '🧠', 'emoji-brain', '22%', '58%');
    addEmoji(scene, '⚙️', 'emoji-gear', '74%', '58%');
    if (reduced) return;
    const p1 = svgParticle(svg, 'flow-a');
    const p2 = svgParticle(svg, 'flow-b');
    const flow = gsap.timeline({repeat:-1, repeatDelay:.35});
    flow.set([p1,p2],{opacity:0})
      .to(p1,{opacity:.9,duration:.15})
      .to(p1,{motionPath:{path:'#heroPath',align:'#heroPath',alignOrigin:[.5,.5]},duration:2.7,ease:'none'},'<')
      .to(p1,{opacity:0,duration:.2},'-=.18')
      .to(p2,{opacity:.7,duration:.15},'-=1.7')
      .to(p2,{motionPath:{path:'#heroPath',align:'#heroPath',alignOrigin:[.5,.5]},duration:2.7,ease:'none'},'<')
      .to(p2,{opacity:0,duration:.2},'-=.18');
    const pulse = gsap.to(scene.querySelectorAll('.js-dot'),{scale:1.12,transformOrigin:'50% 50%',duration:1.8,stagger:.35,yoyo:true,repeat:-1,ease:'sine.inOut'});
    const emojis = gsap.to(scene.querySelectorAll('.ambient-emoji'),{y:-5,duration:2.4,stagger:.4,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,flow,pulse,emojis);
  }

  function scene1(scene) {
    const svg = scene.querySelector('.fork-svg');
    if (!svg) return;
    addEmoji(scene, '💥', 'emoji-fail', '19%', '46%');
    addEmoji(scene, '✅', 'emoji-good', '78%', '46%');
    if (reduced) return;
    const bad = svgParticle(svg,'fork-bad-flow');
    const good = svgParticle(svg,'fork-good-flow');
    const badTl = gsap.timeline({repeat:-1,repeatDelay:1.0}).set(bad,{fill:'#fb7185',opacity:0}).to(bad,{opacity:.7,duration:.12}).to(bad,{motionPath:{path:scene.querySelector('.js-bad-path'),align:scene.querySelector('.js-bad-path'),alignOrigin:[.5,.5]},duration:1.8,ease:'none'},'<').to(bad,{opacity:0,duration:.18},'-=.12');
    const goodTl = gsap.timeline({repeat:-1,repeatDelay:.7,delay:.6}).set(good,{fill:'#14b8a6',opacity:0}).to(good,{opacity:.8,duration:.12}).to(good,{motionPath:{path:scene.querySelector('.js-good-path'),align:scene.querySelector('.js-good-path'),alignOrigin:[.5,.5]},duration:1.8,ease:'none'},'<').to(good,{opacity:0,duration:.18},'-=.12');
    const goodBreath = gsap.to(scene.querySelector('.js-good'),{boxShadow:'0 28px 66px rgba(20,184,166,.19)',duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,badTl,goodTl,goodBreath);
  }

  function scene2(scene) {
    addEmoji(scene, '📚', 'emoji-context', '16%', '29%');
    addEmoji(scene, '🔧', 'emoji-tools', '79%', '29%');
    addEmoji(scene, '🧭', 'emoji-state', '16%', '71%');
    addEmoji(scene, '🛟', 'emoji-recovery', '79%', '71%');
    if (reduced) return;
    const core = scene.querySelector('.js-core');
    const lines = [...scene.querySelectorAll('.js-work-line')];
    const svg = scene.querySelector('.work-lines');
    const loops = [];
    lines.forEach((path,i)=>{
      const p=svgParticle(svg,`work-flow-${i}`);
      loops.push(gsap.timeline({repeat:-1,repeatDelay:.7,delay:i*.42}).set(p,{opacity:0}).to(p,{opacity:.75,duration:.1}).to(p,{motionPath:{path,align:path,alignOrigin:[.5,.5]},duration:1.65,ease:'none'},'<').to(p,{opacity:0,duration:.18},'-=.12'));
    });
    loops.push(gsap.to(core,{scale:1.035,duration:1.9,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    register(scene,...loops);
  }

  function scene3(scene) {
    addEmoji(scene, '🧑‍💻', 'emoji-person', '18%', '42%');
    addEmoji(scene, '🏗️', 'emoji-env', '79%', '42%');
    if (reduced) return;
    const path=scene.querySelector('#promptPath');
    const token=scene.querySelector('.js-prompt-token');
    if (!path || !token) return;
    const glow=gsap.to(scene.querySelector('.js-envbox'),{boxShadow:'0 30px 78px rgba(20,184,166,.18)',duration:2.4,yoyo:true,repeat:-1,ease:'sine.inOut'});
    const tokenPulse=gsap.to(token,{scale:.96,duration:1.25,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,glow,tokenPulse);
  }

  function scene4(scene) {
    addEmoji(scene, '🔎', 'emoji-search', '11%', '44%');
    addEmoji(scene, '📝', 'emoji-note', '31%', '80%');
    if (reduced) return;
    const runner=scene.querySelector('.js-runner');
    const path=scene.querySelector('#loopPath');
    if (!runner || !path) return;
    const run=gsap.timeline({repeat:-1,repeatDelay:.55}).set(runner,{opacity:.92}).to(runner,{motionPath:{path,align:path,alignOrigin:[.5,.5],autoRotate:false},duration:4.2,ease:'none'}).to(runner,{opacity:.45,duration:.2});
    const companies=[...scene.querySelectorAll('.company')];
    const progress=gsap.timeline({repeat:-1,repeatDelay:1.1});
    companies.forEach((el,i)=>progress.to(el,{backgroundColor:'#e9fbf8',borderColor:'rgba(20,184,166,.32)',duration:.18,ease:'power2.out'},i===0?0:'<+.24'));
    progress.to(companies,{backgroundColor:'#fff',borderColor:'#e2d7bf',duration:.35,stagger:.03},'+=.8');
    register(scene,run,progress);
  }

  function scene5(scene) {
    addEmoji(scene, '✨', 'emoji-spark', '77%', '18%');
    if (reduced) return;
    const core=scene.querySelector('.js-reliable');
    const layers=scene.querySelectorAll('.js-layers .layer');
    const pulse=gsap.to(core,{scale:1.035,boxShadow:'0 22px 56px rgba(20,184,166,.32)',duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut'});
    const layerWave=gsap.to(layers,{y:-3,duration:1.8,stagger:.22,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,pulse,layerWave);
  }

  const starters=[scene0,scene1,scene2,scene3,scene4,scene5];
  function activate(scene){
    killScene(scene);
    const idx=Number(scene.dataset.step);
    starters[idx]?.(scene);
  }
  const observer=new MutationObserver(records=>{
    records.forEach(r=>{
      if(r.attributeName!=='class') return;
      const scene=r.target;
      if(scene.classList.contains('active')) activate(scene); else killScene(scene);
    });
  });
  document.querySelectorAll('.scene').forEach(scene=>observer.observe(scene,{attributes:true,attributeFilter:['class']}));
  const active=document.querySelector('.scene.active'); if(active) activate(active);
})();
