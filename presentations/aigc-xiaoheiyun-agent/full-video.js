(()=>{
  const DATA=window.P6_XIAOHEIYUN_LANGCHAIN;
  const anchors=DATA.scenes.slice(0,DATA.anchorScenes);
  const root=document.getElementById('sceneRoot');
  const chapterLabel=document.getElementById('chapterLabel');
  const countLabel=document.getElementById('countLabel');
  const scrub=document.getElementById('scrub');
  const status=document.getElementById('status');
  const chapterNav=document.getElementById('chapterNav');
  const narration=document.getElementById('narration');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const soundBtn=document.getElementById('soundBtn');
  const stage=document.getElementById('stage');
  let index=Math.max(0,Math.min(anchors.length-1,Number(new URLSearchParams(location.search).get('scene')||1)-1));
  let playing=false,paused=false,raf=0,sceneStarted=0,elapsed=0,currentAnimations=[];

  const mascot=()=>`<div class="mascot" aria-hidden="true"><i class="p p1"></i><i class="p p2"></i><i class="p p3"></i><i class="p base"></i><span class="eye e1"></span><span class="eye e2"></span><span class="scarf"></span></div>`;

  function scene001(s){return `<section class="scene s001"><div class="layout"><div class="copy"><div class="date">${s.points[0]} · ${s.kicker}</div><h1><span class="chatgpt">${s.accent}</span>AI 的大门，<br><em>第一次被推开。</em></h1><p>普通人第一次可以直接用自然语言调用大模型。不是实验室演示，而是每个人都能坐到 AI 面前。</p></div><div class="door-world"><div class="beam"></div><div class="door-frame"><div class="door-light"></div><div class="door-panel"></div></div><div class="tokens"><div class="token">“帮我解释这段代码”</div><div class="token">“替我写一封邮件”</div><div class="token">“把这个概念讲明白”</div></div>${mascot()}</div></div></section>`}
  function scene002(s){return `<section class="scene s002"><div class="topcopy"><div class="eyebrow">${s.kicker} · ${s.sourceTime}</div><h1>它会说很多，<br>却还<em>不会把事情做完。</em></h1></div><div class="cage-world"><div class="chat-cage"><div class="bars"></div><div class="bubble b1">写一首诗 ✓</div><div class="bubble b2">解释知识 ✓</div><div class="bubble b3">陪你聊天 ✓</div>${mascot()}</div><div class="gap"><strong>≠</strong><span>THE EXECUTION GAP</span></div><div class="action-side"><div class="action"><i>01</i><div><b>自己搜索</b><small>主动获取信息</small></div></div><div class="action"><i>02</i><div><b>调用工具</b><small>进入真实系统</small></div></div><div class="action"><i>03</i><div><b>完成任务</b><small>根据结果继续行动</small></div></div></div></div></section>`}
  function scene003(s){return `<section class="scene s003"><div class="headline"><div><div class="eyebrow">${s.kicker} · ${s.sourceTime}</div><h1>AI 开始从 <em>CHAT</em><br>走向 <em>ACT</em></h1></div>${mascot()}</div><div class="timeline"><div class="rail"></div><div class="flow-dot"></div><article class="event top e1"><div class="year">2023</div><b>AutoGPT</b><small>自动拆任务、循环执行</small></article><article class="event bottom e2"><div class="year">2024</div><b>Computer Use</b><small>看屏幕、点击、输入、操作软件</small></article><article class="event top e3"><div class="year">2025</div><b>Deep Research</b><small>多步骤搜索、分析与综合研究</small></article><article class="event bottom e4"><div class="year">2026</div><b>Long-running Agents</b><small>持续运行、工具协作、生产工作流</small></article></div><div class="caption">SCENE 003 · 技术时间线已按公开发布时间重新校准</div></section>`}
  function scene004(s){return `<section class="scene s004"><div class="headline"><div class="eyebrow">${s.kicker} · ${s.sourceTime}</div><h1>企业真正需要的，<br>是<em>会交付结果的 AI。</em></h1></div><div class="workmap"><svg viewBox="0 0 1690 585" preserveAspectRatio="none"><path class="signal" d="M845 293 C700 210 560 165 365 95"/><path class="signal" d="M845 293 C990 210 1130 165 1325 95"/><path class="signal" d="M845 293 C700 380 560 430 365 505"/><path class="signal orange" d="M845 293 C990 380 1130 430 1325 505"/></svg><div class="core">${mascot()}<b>AGENT</b><small>UNDERSTAND · DECIDE · ACT</small></div><article class="job j1"><b>自动化工作流</b><span>读取上下文 → 调 API → 判断结果 → 继续执行</span></article><article class="job j2"><b>AI 数据分析</b><span>收集数据、分析变化、输出决策线索</span></article><article class="job j3"><b>7 × 24 智能客服</b><span>知识 + 业务系统 + 工具执行，形成处理闭环</span></article><article class="job j4"><b>数字员工</b><span>企业不再只问“会不会说”，而是“能不能把事办完”</span></article></div></section>`}
  const renderers=[scene001,scene002,scene003,scene004];

  function cancelAnimations(){currentAnimations.forEach(a=>a.cancel());currentAnimations=[];}
  function animateScene(){
    cancelAnimations();
    const el=root.firstElementChild;if(!el)return;
    const items=el.querySelectorAll('h1,.eyebrow,.date,.token,.event,.job,.action,.mascot,.door-frame,.chat-cage,.flow-dot');
    items.forEach((node,i)=>currentAnimations.push(node.animate([{opacity:0,transform:`translateY(${i%2?18:26}px)`},{opacity:1,transform:'translateY(0)'}],{duration:520+Math.min(i,7)*55,delay:Math.min(i,8)*65,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'})));
    const dot=el.querySelector('.flow-dot');if(dot)currentAnimations.push(dot.animate([{left:'28px'},{left:'calc(100% - 58px)'}],{duration:3200,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'}));
  }
  function render(){
    const s=anchors[index];root.innerHTML=renderers[index](s);chapterLabel.innerHTML=`<i></i>${DATA.project.toUpperCase()}`;countLabel.textContent=`${String(index+1).padStart(2,'0')} / ${String(DATA.totalScenes).padStart(2,'0')} · ANCHOR`;scrub.value=index;status.textContent=`${s.id} · ${s.title}`;chapterNav.textContent=`${DATA.chapters.find(c=>c.id===s.chapter)?.title||'CHAPTER 1'} · ANCHOR`;animateScene();sceneStarted=performance.now();elapsed=0;
  }
  function show(n){
    const next=Math.max(0,Math.min(anchors.length-1,n));
    if(next===index&&n!==index)return;
    index=next;render();
  }
  function sceneDuration(){return Math.max(6500,Math.min(13500,(anchors[index].narration||'').length*105));}
  function tick(now){
    if(!playing||paused)return;
    if(now-sceneStarted+elapsed>=sceneDuration()){
      if(index<anchors.length-1){show(index+1);}else{playing=false;playBtn.textContent='播放';status.textContent='CHAPTER 1 · ANCHOR REVIEW COMPLETE';return;}
    }
    raf=requestAnimationFrame(tick);
  }
  function start(){if(playing&&!paused)return;playing=true;paused=false;playBtn.textContent='播放中';pauseBtn.textContent='暂停';sceneStarted=performance.now();raf=requestAnimationFrame(tick);}
  function togglePause(){
    if(!playing)return;
    if(!paused){paused=true;elapsed+=performance.now()-sceneStarted;cancelAnimationFrame(raf);currentAnimations.forEach(a=>a.pause());pauseBtn.textContent='继续';narration.pause();status.textContent='PAUSED';}
    else{paused=false;sceneStarted=performance.now();currentAnimations.forEach(a=>a.play());pauseBtn.textContent='暂停';if(narration.src)narration.play().catch(()=>{});raf=requestAnimationFrame(tick);}
  }
  document.getElementById('prevBtn').onclick=()=>{playing=false;cancelAnimationFrame(raf);playBtn.textContent='播放';show(index-1)};
  document.getElementById('nextBtn').onclick=()=>{playing=false;cancelAnimationFrame(raf);playBtn.textContent='播放';if(index<anchors.length-1)show(index+1);else status.textContent='LOCKED · 先验收 Chapter 1'};
  playBtn.onclick=start;pauseBtn.onclick=togglePause;
  document.getElementById('fullscreenBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.querySelector('.shell').requestFullscreen?.();
  document.getElementById('recordBtn').onclick=()=>window.open('./record.html?v=64-p2a3','_blank');
  soundBtn.onclick=()=>{narration.muted=!narration.muted;soundBtn.textContent=narration.muted?'声音关':'声音开';soundBtn.setAttribute('aria-pressed',String(!narration.muted));};
  scrub.max=anchors.length-1;scrub.oninput=e=>{playing=false;cancelAnimationFrame(raf);playBtn.textContent='播放';show(Number(e.target.value))};
  stage.addEventListener('click',e=>{if(e.target.closest('[data-no-advance]'))return;if(index<anchors.length-1)document.getElementById('nextBtn').click();});
  addEventListener('keydown',e=>{if(e.key==='ArrowRight')document.getElementById('nextBtn').click();if(e.key==='ArrowLeft')document.getElementById('prevBtn').click();if(e.key===' '){e.preventDefault();togglePause();}});
  function fit(){const frame=document.querySelector('.stage-frame'),viewer=document.querySelector('.viewer');const scale=Math.min(viewer.clientWidth/1920,viewer.clientHeight/1080);frame.style.transform=`scale(${scale})`;frame.style.width=`${1920*scale}px`;frame.style.height=`${1080*scale}px`;}
  addEventListener('resize',fit);fit();render();
})();
