import fs from 'node:fs/promises';
const path=new URL('../presentations/harness-engineering/index.html',import.meta.url);
let html=await fs.readFile(path,'utf8');
html=html.replace('<link rel="stylesheet" href="./chapter1-redesign.css?v=13">','<link rel="stylesheet" href="./chapter1-redesign.css?v=14">\n<link rel="stylesheet" href="./chapter1-v14-polish.css?v=14">');
html=html.replace('<script src="./chapter1-redesign.js?v=13"></script>','<script src="./chapter1-redesign.js?v=14"></script>');
await fs.writeFile(path,html);
