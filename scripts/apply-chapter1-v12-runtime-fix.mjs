import fs from 'node:fs/promises';

const htmlPath='presentations/harness-engineering/index.html';
const cssPath='presentations/harness-engineering/chapter1-redesign.css';
const jsPath='presentations/harness-engineering/chapter1-redesign.js';

let html=await fs.readFile(htmlPath,'utf8');
let css=await fs.readFile(cssPath,'utf8');
let js=await fs.readFile(jsPath,'utf8');

// 1) Remove the old runtime cover replacement entirely.
js=js.replace(/\n  function installHoneysCover\(\)\{[\s\S]*?\n  installHoneysCover\(\);\n/,'\n');

// 2) Rebind Step 1 ambient motion to the static Harness cover.
js=js.replace(/if\(i===0\)\{\n      const good=s\.querySelector\('\.cover-good'\), core=s\.querySelector\('\.demo-core'\);[\s\S]*?\n    \}/,
`if(i===0){
      const core=s.querySelector('.model-core'), map=s.querySelector('.system-card'), dot=s.querySelector('.signal-dot');
      if(map)a.push(gsap.to(map,{boxShadow:'0 30px 82px rgba(14,165,166,.13)',duration:2.8,yoyo:true,repeat:-1,ease:'sine.inOut'}));
      if(core)a.push(gsap.to(core,{y:-3,duration:2.4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
      if(dot)a.push(gsap.to(dot,{opacity:.35,duration:.8,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    }`);

// 3) Static Harness cover initial state.
js=js.replace(/if\(i===0\)\{\n      gsap\.set\(s\.querySelectorAll\('\.honeys-brand[\s\S]*?\n    \}/,
`if(i===0){
      gsap.set(s.querySelectorAll('.s1 .question-pill,.s1 .eyebrow,.s1 .cover-main,.s1 .cover-sub,.s1 .copy p,.s1 .cover-proof'),{opacity:0,y:20});
      gsap.set(s.querySelector('.s1 .system-card'),{opacity:0,y:24,scale:.988});
      gsap.set(s.querySelector('.s1 .model-core'),{opacity:0,scale:.97});
      gsap.set(s.querySelectorAll('.s1 .sat'),{opacity:0,y:14});
      gsap.set(s.querySelectorAll('.s1 .orbit-line'),{drawSVG:'0%'});
      gsap.set(s.querySelector('.s1 .signal-dot'),{opacity:0});
    }`);

// 4) Static Harness cover timeline. It stays inside Step 1 and uses the existing SentenceBoundary cue system.
js=js.replace(/if\(i===0\)\{\n      tl\.addLabel\('cue0',0\)[\s\S]*?\n    \}\n    if\(i===1\)/,
`if(i===0){
      tl.addLabel('cue0',0)
        .to(s.querySelectorAll('.s1 .question-pill,.s1 .eyebrow'),{opacity:1,y:0,duration:.42,stagger:.08})
        .to(s.querySelectorAll('.s1 .cover-main,.s1 .cover-sub'),{opacity:1,y:0,duration:.62,stagger:.08},'<+.08')
        .addLabel('cue1')
        .to(s.querySelector('.s1 .copy p'),{opacity:1,y:0,duration:.48})
        .to(s.querySelector('.s1 .system-card'),{opacity:1,y:0,scale:1,duration:.62},'<+.08')
        .to(s.querySelector('.s1 .model-core'),{opacity:1,scale:1,duration:.42},'<+.08')
        .addLabel('cue2')
        .to(s.querySelectorAll('.s1 .orbit-line'),{drawSVG:'100%',duration:.72,stagger:.06,ease:'power2.inOut'})
        .to(s.querySelectorAll('.s1 .sat'),{opacity:1,y:0,duration:.42,stagger:.08},'<+.18')
        .to(s.querySelector('.s1 .signal-dot'),{opacity:1,duration:.28},'<+.15')
        .addLabel('cue3')
        .to(s.querySelector('.s1 .cover-proof'),{opacity:1,y:0,duration:.46});
    }
    if(i===1)`);

// 5) Cache bust CSS / JS so server/browser cannot mix the old cover controller with the new HTML.
html=html.replace(/\.\/chapter1-redesign\.css(?:\?v=\d+)?/g,'./chapter1-redesign.css?v=12');
html=html.replace(/\.\/chapter1-redesign\.js(?:\?v=\d+)?/g,'./chapter1-redesign.js?v=12');

// 6) Replace the disliked deep green with graphite + cyan-teal while keeping warm white surfaces.
const marker='/* === Project6 Chapter1 v12 · graphite + aqua palette === */';
const override=`\n${marker}\n:root{--canvas:#f1eee8;--paper:#fcfbf8;--paper2:#f5f6f5;--ink:#20292d;--ink2:#48545a;--muted:#7b858a;--line:#e0e5e5;--line2:#d2d9da;--mint:#16b8b0;--mint2:#0e8f8a;--mintSoft:#e8f8f6;--navy:#263238;--navy2:#34434a;--shadow:0 22px 70px rgba(32,41,45,.09);--shadowSm:0 10px 30px rgba(32,41,45,.06)}\n.dark-surface{background:linear-gradient(150deg,#263238 0%,#2e3a40 58%,#39484f 100%);box-shadow:0 26px 72px rgba(32,41,45,.18)}\n.system-card .model-core{background:linear-gradient(145deg,#263238,#34434a)}\n.console{background:linear-gradient(150deg,#253137,#303d43 62%,#3a484e)}\n.runtime{background:rgba(15,23,27,.46)}\n.control-bottom{background:linear-gradient(135deg,#28353a,#37454b)}\n.vs-badge{background:#2b373d;box-shadow:0 14px 34px rgba(32,41,45,.15)}\n.s1 .copy h1 .cover-main{color:#20292d}.s1 .copy h1 .cover-sub{color:#16b8b0}.s1 .copy p strong{color:#20292d}\n.question-pill{background:#eef8f7;border-color:#d8ece9;color:#3c5e5b}\n.system-card.harness-map{background:linear-gradient(160deg,rgba(255,255,255,.98),rgba(240,249,248,.84));border-color:rgba(32,41,45,.07);box-shadow:0 28px 82px rgba(32,41,45,.09)}\n.model-core .chip{color:#8bdcd5}.model-core small{color:#d0dadd}.runtime-card small{color:#c6d1d4}.lights i{background:#64757c}\n.arrow-stage:before{background:linear-gradient(to bottom,transparent,#8bd9d2 20%,#8bd9d2 80%,transparent)}\n.prompt-orb{background:linear-gradient(145deg,#18bbb2,#0e8f8a);box-shadow:0 14px 34px rgba(14,143,138,.21)}\n.orbit-line{stroke:rgba(22,184,176,.32)}.orbit-line.bad{stroke:rgba(22,184,176,.32)}\n`;
css=css.replace(/\/\* === Project6 Chapter1 v12 · graphite \+ aqua palette === \*\/[\s\S]*$/,'').trimEnd()+override;

await Promise.all([
  fs.writeFile(htmlPath,html),
  fs.writeFile(cssPath,css),
  fs.writeFile(jsPath,js)
]);

console.log('Applied Chapter1 v12 runtime fix, cache bust, and graphite+aqua palette.');
