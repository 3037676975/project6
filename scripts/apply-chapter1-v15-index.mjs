import fs from 'node:fs/promises';
const path=new URL('../presentations/harness-engineering/index.html',import.meta.url);
let html=await fs.readFile(path,'utf8');
const tag='<link rel="stylesheet" href="./chapter1-v15-materials.css?v=15">';
if(!html.includes(tag)){
  html=html.replace('<link rel="stylesheet" href="./chapter1-v14-generated-art.css?v=14">', '<link rel="stylesheet" href="./chapter1-v14-generated-art.css?v=14">\n'+tag);
}
await fs.writeFile(path,html);
