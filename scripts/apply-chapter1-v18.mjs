import fs from 'node:fs/promises';
const file='presentations/harness-engineering/index.html';
let html=await fs.readFile(file,'utf8');
html=html.replace('./chapter1-v17-recovery.css?v=17','./chapter1-v17-recovery.css?v=18');
if(!html.includes('./chapter1-v18-recording.js?v=18')){
  html=html.replace('<script src="./chapter1-redesign.js?v=17"></script>','<script src="./chapter1-redesign.js?v=17"></script><script src="./chapter1-v18-recording.js?v=18"></script>');
}
await fs.writeFile(file,html);
