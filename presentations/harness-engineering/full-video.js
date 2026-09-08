(() => {
  const data = window.P6_FULL_VIDEO;
  if (!data) return;
  const $ = s => document.querySelector(s);
  const stage = $('#stage'), sceneRoot = $('#sceneRoot'), chapterLabel = $('#chapterLabel'), countLabel = $('#countLabel');
  const prevBtn = $('#prevBtn'), nextBtn = $('#nextBtn'), playBtn = $('#playBtn'), pauseBtn = $('#pauseBtn'), fullscreenBtn = $('#fullscreenBtn');
  const scrub = $('#scrub'), status = $('#status'), chapterNav = $('#chapterNav'), narration = $('#narration');
  let current = 0, playing = false, paused = false, localAudio = {}, fallbackTimer = null, currentObjectUrl = null;

  function fit(){
    if (document.fullscreenElement === stage) return;
    const viewer = $('.viewer').getBoundingClientRect();
    stage.style.transform = `scale(${Math.min(viewer.width / 1920, viewer.height / 1080)})`;
  }
  addEventListener('resize', fit); fit();

  function chapterOf(scene){ return data.chapters.find(c => c.id === scene.chapter); }
  function escapeHtml(v=''){ return v.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  function visualMarkup(s){
    const p = s.points || [];
    const cards = p.slice(0,4).map((x,i)=>`<div class="card"><span>${String(i+1).padStart(2,'0')}</span><b>${escapeHtml(x)}</b><small>${i===0?'定义当前问题':i===1?'建立系统关系':i===2?'形成执行反馈':'进入稳定交付'}</small></div>`).join('');
    switch(s.type){
      case 'orbit': case 'workbench': case 'harness':
        return `<div class="center-core"><div><small>${escapeHtml(s.kicker)}</small><b>${escapeHtml(s.accent)}</b></div></div><div class="orbit-items">${p.slice(0,4).map(x=>`<div class="orbit-item">${escapeHtml(x)}</div>`).join('')}</div>`;
      case 'rail': case 'pipeline':
        return `<div class="rail"></div><div class="rail-nodes">${(p.length?p:['Input','Reason','Tool','Verify','Result']).slice(0,5).map((x,i)=>`<div class="rail-node"><i>${String(i+1).padStart(2,'0')}</i><b>${escapeHtml(x)}</b></div>`).join('')}</div>`;
      case 'layers': case 'layer': case 'drawer': case 'docs':
        return `<div class="stack">${p.slice(0,5).map((x,i)=>`<div class="layer"><span>${escapeHtml(x)}</span><strong>LAYER ${String(i+1).padStart(2,'0')}</strong></div>`).join('')}</div>`;
      case 'quadrant': case 'split': case 'guardrail': case 'diagnose':
        return `<div class="quad">${p.slice(0,4).map((x,i)=>`<div><b>${escapeHtml(x)}</b><small>${['输入边界','执行能力','持续状态','检查与恢复'][i]||'系统能力'}</small></div>`).join('')}</div>`;
      case 'timeline': case 'steps': case 'bridge': case 'beforeafter':
        return `<div class="timeline">${p.slice(0,5).map((x,i)=>`<div class="step ${i===0||i===p.length-1?'on':''}"><i>${i+1}</i><b>${escapeHtml(x)}</b></div>`).join('')}</div>`;
      case 'focus': case 'prompt': case 'probability': case 'wall': case 'contextmap': case 'case': case 'roles': case 'summarycard': case 'people':
        return `<div class="cards">${cards}</div>`;
      case 'rings':
        return `<div class="center-core"><div><small>INNER</small><b>${escapeHtml(p[0]||'Prompt')}</b></div></div><div style="position:absolute;width:390px;height:390px;border:3px solid var(--teal);border-radius:50%;opacity:.55"></div><div style="position:absolute;width:560px;height:560px;border:2px solid var(--line);border-radius:50%"></div>`;
      case 'loop':
        return `<div class="loop"><div class="center-core"><div><small>LOOP</small><b>${escapeHtml(s.accent)}</b></div></div><div class="loop-label a">${escapeHtml(p[0]||'理解')}</div><div class="loop-label b">${escapeHtml(p[1]||'执行')}</div><div class="loop-label c">${escapeHtml(p[2]||'检查')}</div><div class="loop-label d">${escapeHtml(p[3]||'修正')}</div></div>`;
      case 'meter': case 'decay':
        return `<div class="meter"><div class="bar"><div class="fill"></div></div><div class="ticks"><span>干净上下文</span><span>信息增加</span><span>注意力稀释</span></div></div>`;
      case 'browser':
        return `<div class="screen"><div class="browserbar"><i></i><i></i><i></i></div><div class="screenbody"><div class="pane"><b>RUN</b><p>执行真实任务<br>读取页面和工具反馈</p></div><div class="pane"><b>VERIFY</b><p>截图 · 日志 · 指标<br>发现问题以后继续修复</p></div></div></div>`;
      case 'equation':
        return `<div class="big-equation">${escapeHtml(p[0]||'Model')} <span>×</span> ${escapeHtml(p[1]||'Harness')} <span>=</span><br>${escapeHtml(p[2]||s.accent)}</div>`;
      case 'final':
        return `<div class="final-mark"><div class="ring"><b>RELIABLE<br><span style="color:var(--teal)">AI</span></b></div></div>`;
      default:
        return `<div class="cards">${cards}</div>`;
    }
  }

  function render(i){
    current = Math.max(0, Math.min(data.scenes.length - 1, i));
    const s = data.scenes[current], ch = chapterOf(s);
    clearTimeout(fallbackTimer); narration.pause(); narration.removeAttribute('src'); narration.load();
    sceneRoot.innerHTML = `<section class="scene"><div class="copy"><div class="kicker">${escapeHtml(s.kicker)}</div><h1 class="title">${escapeHtml(s.title)}<br><span class="accent">${escapeHtml(s.accent)}</span></h1><div class="summary">${escapeHtml(s.narration)}</div><div class="point-row">${(s.points||[]).map(x=>`<span class="point">${escapeHtml(x)}</span>`).join('')}</div></div><div class="visual"><div class="v-head"><div><b>${escapeHtml(ch?.title||'Harness Engineering')}</b><small>Scene ${s.id} · Garden warm-keynote</small></div><span class="badge">${escapeHtml(s.type.toUpperCase())}</span></div><div class="canvas">${visualMarkup(s)}</div></div></section>`;
    chapterLabel.innerHTML = `<i></i>${escapeHtml(ch?.id||'')} · ${escapeHtml(ch?.title||'')}`;
    countLabel.textContent = `${String(current+1).padStart(2,'0')} / ${String(data.scenes.length).padStart(2,'0')}`;
    scrub.value = current;
    chapterNav.textContent = ch ? `${ch.id} ${ch.title}` : '';
    if(window.gsap){ gsap.fromTo('.copy > *',{opacity:0,y:22},{opacity:1,y:0,duration:.55,stagger:.07,ease:'power3.out'}); gsap.fromTo('.visual',{opacity:0,y:26,scale:.985},{opacity:1,y:0,scale:1,duration:.72,ease:'power3.out'}); }
    status.textContent = localAudio[s.id] ? `LOCAL ${s.id}` : `SCENE ${s.id}`;
  }

  function audioForCurrent(){ return localAudio[data.scenes[current].id] || ''; }
  async function playCurrent(){
    const src = audioForCurrent();
    playing = true; paused = false; playBtn.classList.add('on'); pauseBtn.classList.remove('on');
    if(src){
      narration.src = src; narration.currentTime = 0;
      try{ await narration.play(); status.textContent = `LOCAL AUDIO · ${data.scenes[current].id}`; }
      catch(e){ status.textContent='点击播放以授权音频'; playing=false; }
    }else{
      status.textContent='无本地音频 · 画面预览';
      fallbackTimer = setTimeout(()=>advance(), 6500);
    }
  }
  function advance(){ if(current < data.scenes.length-1){ render(current+1); if(playing) setTimeout(playCurrent,180); } else { playing=false; playBtn.classList.remove('on'); status.textContent='END'; } }
  function pause(){ paused=true; playing=false; narration.pause(); clearTimeout(fallbackTimer); if(window.gsap) gsap.globalTimeline.pause(); pauseBtn.classList.add('on'); playBtn.classList.remove('on'); status.textContent='PAUSED'; }
  async function resume(){ if(window.gsap) gsap.globalTimeline.resume(); if(narration.src && narration.currentTime>0){ playing=true;paused=false;await narration.play().catch(()=>{}); } else playCurrent(); pauseBtn.classList.remove('on');playBtn.classList.add('on'); }
  narration.addEventListener('ended',()=>{ if(!paused) advance(); });

  prevBtn.addEventListener('click',()=>{render(current-1);});
  nextBtn.addEventListener('click',()=>{render(current+1);});
  playBtn.addEventListener('click',()=>paused?resume():playCurrent());
  pauseBtn.addEventListener('click',pause);
  scrub.addEventListener('input',e=>render(Number(e.target.value)));
  fullscreenBtn.addEventListener('click',async()=>{ try{ if(document.fullscreenElement) await document.exitFullscreen(); else await stage.requestFullscreen(); }catch(e){status.textContent='浏览器不支持全屏';} });
  document.addEventListener('fullscreenchange',()=>{ if(!document.fullscreenElement) fit(); });
  addEventListener('keydown',e=>{ if(e.code==='Space'){e.preventDefault(); playing?pause():resume();} if(e.key==='ArrowRight')render(current+1); if(e.key==='ArrowLeft')render(current-1); if(e.key.toLowerCase()==='f')fullscreenBtn.click(); });

  window.addEventListener('message', e => {
    if(e.origin !== location.origin) return;
    const msg=e.data||{};
    if(msg.type==='P6_LOCAL_AUDIO' && msg.files){ localAudio={...msg.files}; status.textContent=`LOCAL AUDIO ${Object.keys(localAudio).length}/${data.scenes.length}`; render(current); }
    if(msg.type==='P6_CLEAR_AUDIO'){ localAudio={}; render(current); }
  });

  scrub.max = data.scenes.length-1; render(0);
  if(window.parent && window.parent!==window) window.parent.postMessage({type:'P6_PLAYER_READY'}, location.origin);
})();
