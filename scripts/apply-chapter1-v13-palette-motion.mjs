import fs from 'node:fs/promises';

const base='presentations/harness-engineering';
const htmlPath=`${base}/index.html`;
const cssPath=`${base}/chapter1-redesign.css`;
const jsPath=`${base}/chapter1-redesign.js`;

let html=await fs.readFile(htmlPath,'utf8');
let css=await fs.readFile(cssPath,'utf8');
let js=await fs.readFile(jsPath,'utf8');

// Cache bust runtime assets.
html=html
  .replace(/chapter1-redesign\.css(?:\?v=\d+)?/g,'chapter1-redesign.css?v=13')
  .replace(/chapter1-redesign\.js(?:\?v=\d+)?/g,'chapter1-redesign.js?v=13');

// Replace Scene 2 timeline: reveal failure states in semantic order during the sentence,
// then reveal the stable system only when narration reaches the conclusion.
const s2=/if\(i===1\)\{[\s\S]*?\n    \}\n    if\(i===2\)\{/;
const s2New=`if(i===1){
      const badItems=[...s.querySelectorAll('.lane.bad .stack-item')];
      const goodItems=[...s.querySelectorAll('.lane.good .stack-item')];
      tl.addLabel('cue0',0)
        .to(s.querySelectorAll('.s2 .eyebrow,.s2 .headline'),{opacity:1,y:0,duration:.5,stagger:.08})
        .to(s.querySelector('.lane.bad'),{opacity:1,y:0,duration:.55},'<+.1')
        .addLabel('cue1')
        .to(s.querySelector('.vs-badge'),{opacity:1,y:0,scale:1,duration:.28,ease:'power2.out'})
        .addLabel('cue2')
        .to(badItems[0],{opacity:1,x:0,duration:.42,ease:'power3.out'})
        .to(badItems[0],{boxShadow:'0 10px 30px rgba(250,82,82,.12)',duration:.28},'<')
        .to(badItems[1],{opacity:1,x:0,duration:.42,ease:'power3.out'},'>-.04')
        .to(badItems[1],{boxShadow:'0 10px 30px rgba(250,82,82,.12)',duration:.28},'<')
        .to(badItems[2],{opacity:1,x:0,duration:.42,ease:'power3.out'},'>-.04')
        .to(badItems[2],{boxShadow:'0 10px 30px rgba(250,82,82,.12)',duration:.28},'<')
        .addLabel('cue3')
        .to(s.querySelector('.lane.good'),{opacity:1,y:0,duration:.58,ease:'power3.out'})
        .to(goodItems,{opacity:1,x:0,duration:.38,stagger:.075,ease:'power3.out'},'<+.12')
        .to(s.querySelectorAll('.lane'),{y:-2,duration:.34,ease:'sine.inOut'})
        .to(s.querySelectorAll('.lane'),{y:0,duration:.34,ease:'sine.inOut'});
    }
    if(i===2){`;
if(!s2.test(js)) throw new Error('Scene2 timeline pattern not found');
js=js.replace(s2,s2New);

// Replace Scene 3 timeline: build workbench in the narration's semantic order.
const s3=/if\(i===2\)\{[\s\S]*?\n    \}\n    if\(i===3\)\{/;
const s3New=`if(i===2){
      const resources=[...s.querySelectorAll('.resource')];
      const cards=[...s.querySelectorAll('.runtime-card')];
      const events=[...s.querySelectorAll('.event')];
      tl.addLabel('cue0',0)
        .to(s.querySelectorAll('.s3 .eyebrow,.s3 .headline'),{opacity:1,y:0,duration:.5,stagger:.08})
        .addLabel('cue1')
        .to(s.querySelector('.console'),{opacity:1,y:0,duration:.58,ease:'power3.out'})
        .to(s.querySelector('.rail'),{opacity:1,y:0,duration:.46},'<+.05')
        .to(s.querySelector('.activity'),{opacity:1,y:0,duration:.46},'<+.04')
        .to(resources[0],{opacity:1,y:0,duration:.34},'<+.08')
        .to(cards[0],{opacity:1,y:0,duration:.34},'<+.03')
        .to(events[0],{opacity:1,y:0,duration:.3},'<+.03')
        .to(resources[1],{opacity:1,y:0,duration:.34},'>-.05')
        .to(cards[1],{opacity:1,y:0,duration:.34},'<+.02')
        .to(events[1],{opacity:1,y:0,duration:.3},'<+.02')
        .to(resources[2],{opacity:1,y:0,duration:.34},'>-.05')
        .to(cards[2],{opacity:1,y:0,duration:.34},'<+.02')
        .to(events[2],{opacity:1,y:0,duration:.3},'<+.02')
        .to(resources[3],{opacity:1,y:0,duration:.34},'>-.05')
        .to(cards[3],{opacity:1,y:0,duration:.34},'<+.02')
        .to(events[3],{opacity:1,y:0,duration:.3},'<+.02')
        .addLabel('cue2')
        .to(s.querySelector('.core-ring'),{opacity:1,scale:1,duration:.48,ease:'power3.out'})
        .to(s.querySelectorAll('.runtime-card'),{borderColor:'rgba(34,139,230,.20)',duration:.45,stagger:.04},'<');
    }
    if(i===3){`;
if(!s3.test(js)) throw new Error('Scene3 timeline pattern not found');
js=js.replace(s3,s3New);

js=js.replace(/color:'#0f8f82'/g,"color:'#1c7ed6'");
await fs.writeFile(jsPath,js);

// Open Color + Radix-inspired light mint / sky blue system.
const marker='/* === Project6 Chapter1 v13 · Open Color + Radix Mint/Sky === */';
css=css.replace(/\/\* === Project6 Chapter1 v13 · Open Color \+ Radix Mint\/Sky === \*\/[\s\S]*$/,'').trimEnd();
css += `\n\n${marker}\n:root{
  --canvas:#f4fbff;--paper:#ffffff;--paper2:#f7fbff;
  --ink:#212529;--ink2:#495057;--muted:#74808b;
  --line:#dcebf5;--line2:#c8ddea;
  --mint:#38d9a9;--mint2:#0ca678;--mintSoft:#e6fcf5;
  --sky:#4dabf7;--sky2:#1c7ed6;--skySoft:#e7f5ff;
  --cyanSoft:#e3fafc;--coral:#fa5252;--coralSoft:#fff5f5;
  --navy:#ffffff;--navy2:#f4fbff;
  --shadow:0 24px 68px rgba(28,126,214,.09);--shadowSm:0 10px 28px rgba(28,126,214,.07);
}
html,body{background:linear-gradient(180deg,#f2fbff,#f8fffc);color:var(--ink)}
.stage{background:linear-gradient(180deg,#fff 0%,#fbfeff 100%);box-shadow:0 34px 100px rgba(28,126,214,.10),0 0 0 1px rgba(28,126,214,.05)}
.stage:before{background-image:linear-gradient(rgba(77,171,247,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(56,217,169,.045) 1px,transparent 1px)}
.stage:after{background:radial-gradient(circle,rgba(77,171,247,.12),rgba(56,217,169,.06) 38%,transparent 70%)}
.headline,.s1 .copy h1,.lane h2,.rail h3,.activity h3,.control-plane h2,.prompt-card h2,.board-top h2,.side-case h3{font-family:var(--font);color:#212529}
.eyebrow,.chapter{color:#1c7ed6}.chapter i{background:linear-gradient(90deg,#4dabf7,#38d9a9)}
.surface{background:rgba(255,255,255,.96);border-color:#dcebf5;box-shadow:var(--shadow)}
.soft-surface{background:#f7fbff;border-color:#dcebf5}
.dark-surface{background:linear-gradient(145deg,#ffffff,#eef8ff);color:#212529;border:1px solid #cfe7f6;box-shadow:0 24px 65px rgba(28,126,214,.11)}
.status{background:#e6fcf5;color:#0ca678;border-color:#c3fae8}.status:before{box-shadow:0 0 0 5px rgba(56,217,169,.10)}
.iconbox{background:linear-gradient(145deg,#e7f5ff,#e6fcf5);color:#1c7ed6;border-color:#cfe7f6}
.question-pill{background:#e7f5ff;border-color:#d0ebff;color:#1c5f9f}.cover-proof{color:#65727e}.cover-proof i{background:linear-gradient(90deg,#74c0fc,#63e6be)}
.system-card.harness-map{background:linear-gradient(150deg,#ffffff 0%,#f1f9ff 55%,#effcf8 100%);border-color:#d7eaf5;box-shadow:0 28px 76px rgba(28,126,214,.09)}
.system-card.harness-map:before{background:radial-gradient(circle at 55% 45%,rgba(77,171,247,.15),transparent 32%),radial-gradient(circle at 70% 62%,rgba(56,217,169,.10),transparent 36%)}
.system-card .model-core{background:linear-gradient(145deg,#228be6,#20c997);color:#fff;border:0;box-shadow:0 22px 54px rgba(34,139,230,.22)}
.model-core .chip,.model-core small{color:#fff}.sat{border-color:#d8eaf3;background:rgba(255,255,255,.97)}.orbit-line{stroke:rgba(34,139,230,.35)}.signal-dot{fill:#20c997}
.lane.bad{background:linear-gradient(180deg,#fff,#fff8f8)}.lane.good{background:linear-gradient(180deg,#fff,#f0fff9)}
.vs-badge{background:linear-gradient(145deg,#4dabf7,#38d9a9);color:#fff;box-shadow:0 14px 32px rgba(34,139,230,.16)}
.good .flow-rail i{background:linear-gradient(90deg,#4dabf7,#38d9a9)}
.s3 .workspace{grid-template-columns:350px 1fr 330px;gap:20px}.console{background:linear-gradient(145deg,#f1f9ff 0%,#eefcf8 100%);color:#212529;border:1px solid #cfe7f6;box-shadow:0 26px 70px rgba(28,126,214,.10)}
.console-title b{color:#1f4f78}.lights i:nth-child(1){background:#74c0fc}.lights i:nth-child(2){background:#63e6be}.lights i:nth-child(3){background:#99e9f2}
.runtime{background:rgba(255,255,255,.72);border-color:#d9ebf5}.runtime-card{background:rgba(255,255,255,.92);border-color:#dcebf5;box-shadow:0 8px 22px rgba(28,126,214,.05)}.runtime-card b{color:#1f4f78}.runtime-card small{color:#65727e}.runtime-card .mini{background:#e7f5ff}.runtime-card .mini i{background:linear-gradient(90deg,#4dabf7,#38d9a9)}
.core-ring{background:linear-gradient(145deg,#fff,#f2fbff);color:#1f4f78;border:1px solid #d0ebff;box-shadow:0 16px 42px rgba(28,126,214,.12)}
.event i{background:#38d9a9;box-shadow:0 0 0 5px rgba(56,217,169,.12)}
.prompt-orb{background:linear-gradient(145deg,#4dabf7,#38d9a9);box-shadow:0 14px 30px rgba(34,139,230,.18)}.arrow-path{stroke:#4dabf7}
.control-bottom{background:linear-gradient(100deg,#e7f5ff,#e6fcf5);color:#21445f;border:1px solid #cfe7f6}.control-bottom small{color:#647984}.cp-item .pill{color:#1c7ed6;background:#e7f5ff}
.pillar{border-color:#dcebf5}.merge{background:linear-gradient(90deg,#e7f5ff,#e6fcf5);color:#1f4f78}.reliable{background:linear-gradient(145deg,#4dabf7,#38d9a9);color:#fff;box-shadow:0 24px 54px rgba(34,139,230,.18)}
.toolbar{background:rgba(255,255,255,.96);border-color:#dcebf5;box-shadow:0 12px 34px rgba(28,126,214,.08)}
.stack-item,.resource,.cp-item,.row:not(.head){transition:none}
@media(prefers-reduced-motion:reduce){.stage:after{display:none}}
`;
await fs.writeFile(cssPath,css);
await fs.writeFile(htmlPath,html);
console.log('Applied Chapter1 v13 Open Color + Radix palette and semantic motion fixes.');
