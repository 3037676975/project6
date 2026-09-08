import fs from 'node:fs/promises';
const root=new URL('../presentations/harness-engineering/',import.meta.url);
const indexUrl=new URL('index.html',root),jsUrl=new URL('chapter1-redesign.js',root);
let html=await fs.readFile(indexUrl,'utf8');
let js=await fs.readFile(jsUrl,'utf8');
html=html.replace(/chapter1-v17-recovery\.css\?v=\d+/,'chapter1-v17-recovery.css?v=19');
html=html.replace(/<script src="\.\/chapter1-v18-recording\.js[^>]*><\/script>/g,'');
if(!html.includes('vendor/html2canvas/html2canvas.min.js'))html=html.replace('<script src="./chapter1-redesign.js?v=17"></script>','<script src="./chapter1-redesign.js?v=19"></script><script src="../../vendor/html2canvas/html2canvas.min.js"></script><script src="./chapter1-v19-runtime.js?v=19"></script>');
else html=html.replace(/chapter1-redesign\.js\?v=\d+/,'chapter1-redesign.js?v=19');
// Do not deform the layout when replaying current narration: remove scale-down initial states.
js=js.replaceAll('scale:.988','scale:1').replaceAll('scale:.96','scale:1').replaceAll('scale:.97','scale:1');
await fs.writeFile(indexUrl,html);await fs.writeFile(jsUrl,js);
console.log('Applied chapter1 v19');