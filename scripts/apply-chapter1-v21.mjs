import fs from 'node:fs';
const p='presentations/harness-engineering/index.html';
let s=fs.readFileSync(p,'utf8');
if(!s.includes('chapter1-v21-controls.css')){
  s=s.replace('</head>','<link rel="stylesheet" href="./chapter1-v21-controls.css?v=21"></head>');
}
// Recorder is intentionally removed from Project6. Users record externally.
s=s.replace(/<div class="right"><button class="btn record" id="recordBtn">[\s\S]*?<\/div><\/div><\/div>/,'</div></div>');
s=s.replace(/<script src="\.\.\/\.\.\/vendor\/html2canvas\/html2canvas\.min\.js"><\/script>/g,'');
s=s.replace(/<script src="\.\/chapter1-v19-runtime\.js\?v=20"><\/script>/g,'');
// Keep the design system available, but as a lightweight static link outside the video stage.
if(!s.includes('id="designSystemBtn"')){
  s=s.replace('<span class="stepinfo" id="stepInfo">01 / 06</span>','<span class="stepinfo" id="stepInfo">01 / 06</span><a class="btn" id="designSystemBtn" href="./design-system.html" target="_blank" rel="noopener">设计规范</a>');
}
fs.writeFileSync(p,s);
