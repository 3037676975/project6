/* Project6 Harness Chapter 1 — continuous ambient motion layer
 * Purpose: keep relationships alive after narration-triggered GSAP reveals finish.
 * Rules: ambient motion never owns Step navigation, never changes layout, and stops immediately when a scene deactivates.
 * v9: no decorative emoji. Motion is expressed through paths, particles, status and hierarchy only.
 */
(() => {
  if (!window.gsap || !window.MotionPathPlugin) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sceneLoops = new Map();
  const ns = 'http://www.w3.org/2000/svg';

  function svgParticle(svg, cls, radius=5) {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', String(radius));
    c.setAttribute('class', `ambient-particle ${cls}`);
    svg.appendChild(c);
    return c;
  }

  function killScene(scene) {
    const loops = sceneLoops.get(scene) || [];
    loops.forEach(a => a?.kill?.());
    sceneLoops.delete(scene);
    scene.querySelectorAll('.ambient-particle').forEach(n => n.remove());
  }

  function register(scene, ...animations) {
    sceneLoops.set(scene, animations.filter(Boolean));
  }

  function scene0(scene) {
    const svg = scene.querySelector('.network svg');
    const path = scene.querySelector('#heroPath');
    if (!svg || !path || reduced) return;
    const p1 = svgParticle(svg, 'flow-a', 6);
    const p2 = svgParticle(svg, 'flow-b', 4);
    const flow = gsap.timeline({repeat:-1, repeatDelay:.45});
    flow.set([p1,p2],{opacity:0})
      .to(p1,{opacity:.92,duration:.12})
      .to(p1,{motionPath:{path:'#heroPath',align:'#heroPath',alignOrigin:[.5,.5]},duration:2.8,ease:'none'},'<')
      .to(p1,{opacity:0,duration:.18},'-=.16')
      .to(p2,{opacity:.56,duration:.12},'-=1.75')
      .to(p2,{motionPath:{path:'#heroPath',align:'#heroPath',alignOrigin:[.5,.5]},duration:2.8,ease:'none'},'<')
      .to(p2,{opacity:0,duration:.18},'-=.16');
    const pulse = gsap.to(scene.querySelectorAll('.js-dot'),{scale:1.09,transformOrigin:'50% 50%',duration:2.1,stagger:.32,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,flow,pulse);
  }

  function scene1(scene) {
    const svg = scene.querySelector('.fork-svg');
    if (!svg || reduced) return;
    const bad = svgParticle(svg,'fork-bad-flow',5);
    const good = svgParticle(svg,'fork-good-flow',5);
    const badTl = gsap.timeline({repeat:-1,repeatDelay:1.15}).set(bad,{fill:'#e56f78',opacity:0}).to(bad,{opacity:.62,duration:.12}).to(bad,{motionPath:{path:scene.querySelector('.js-bad-path'),align:scene.querySelector('.js-bad-path'),alignOrigin:[.5,.5]},duration:1.9,ease:'none'},'<').to(bad,{opacity:0,duration:.18},'-=.12');
    const goodTl = gsap.timeline({repeat:-1,repeatDelay:.9,delay:.55}).set(good,{fill:'#14b8a6',opacity:0}).to(good,{opacity:.78,duration:.12}).to(good,{motionPath:{path:scene.querySelector('.js-good-path'),align:scene.querySelector('.js-good-path'),alignOrigin:[.5,.5]},duration:1.9,ease:'none'},'<').to(good,{opacity:0,duration:.18},'-=.12');
    const goodBreath = gsap.to(scene.querySelector('.js-good'),{boxShadow:'0 26px 64px rgba(20,184,166,.14)',duration:2.5,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,badTl,goodTl,goodBreath);
  }

  function scene2(scene) {
    if (reduced) return;
    const core = scene.querySelector('.js-core');
    const lines = [...scene.querySelectorAll('.js-work-line')];
    const svg = scene.querySelector('.work-lines');
    if (!svg) return;
    const loops = [];
    lines.forEach((path,i)=>{
      const p=svgParticle(svg,`work-flow-${i}`,4);
      loops.push(gsap.timeline({repeat:-1,repeatDelay:.9,delay:i*.38}).set(p,{opacity:0}).to(p,{opacity:.68,duration:.1}).to(p,{motionPath:{path,align:path,alignOrigin:[.5,.5]},duration:1.75,ease:'none'},'<').to(p,{opacity:0,duration:.18},'-=.12'));
    });
    loops.push(gsap.to(core,{scale:1.025,duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    register(scene,...loops);
  }

  function scene3(scene) {
    if (reduced) return;
    const token=scene.querySelector('.js-prompt-token');
    const glow=gsap.to(scene.querySelector('.js-envbox'),{boxShadow:'0 28px 74px rgba(20,184,166,.13)',duration:2.7,yoyo:true,repeat:-1,ease:'sine.inOut'});
    const tokenPulse=token?gsap.to(token,{scale:.975,duration:1.5,yoyo:true,repeat:-1,ease:'sine.inOut'}):null;
    register(scene,glow,tokenPulse);
  }

  function scene4(scene) {
    if (reduced) return;
    const runner=scene.querySelector('.js-runner');
    const path=scene.querySelector('#loopPath');
    if (!runner || !path) return;
    const run=gsap.timeline({repeat:-1,repeatDelay:.7}).set(runner,{opacity:.88}).to(runner,{motionPath:{path,align:path,alignOrigin:[.5,.5],autoRotate:false},duration:4.5,ease:'none'}).to(runner,{opacity:.35,duration:.2});
    const companies=[...scene.querySelectorAll('.company')];
    const progress=gsap.timeline({repeat:-1,repeatDelay:1.25});
    companies.forEach((el,i)=>progress.to(el,{backgroundColor:'#e9f8f4',borderColor:'rgba(20,184,166,.28)',duration:.18,ease:'power2.out'},i===0?0:'<+.25'));
    progress.to(companies,{backgroundColor:'#fff',borderColor:'#e2d7bf',duration:.35,stagger:.03},'+=.9');
    register(scene,run,progress);
  }

  function scene5(scene) {
    if (reduced) return;
    const core=scene.querySelector('.js-reliable');
    const layers=scene.querySelectorAll('.js-layers .layer');
    const pulse=gsap.to(core,{scale:1.025,boxShadow:'0 20px 50px rgba(20,184,166,.24)',duration:2.5,yoyo:true,repeat:-1,ease:'sine.inOut'});
    const layerWave=gsap.to(layers,{y:-2,duration:2.1,stagger:.2,yoyo:true,repeat:-1,ease:'sine.inOut'});
    register(scene,pulse,layerWave);
  }

  const starters=[scene0,scene1,scene2,scene3,scene4,scene5];
  function activate(scene){killScene(scene);starters[Number(scene.dataset.step)]?.(scene)}
  const observer=new MutationObserver(records=>records.forEach(r=>{if(r.attributeName==='class'){const scene=r.target;scene.classList.contains('active')?activate(scene):killScene(scene)}}));
  document.querySelectorAll('.scene').forEach(scene=>observer.observe(scene,{attributes:true,attributeFilter:['class']}));
  const active=document.querySelector('.scene.active'); if(active) activate(active);
})();
