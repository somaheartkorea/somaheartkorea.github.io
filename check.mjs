import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.join(import.meta.dirname,'dist');
let pageCount=0;let imageCount=0;const failures=[];
async function walk(dir){for(const ent of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,ent.name);if(ent.isDirectory())await walk(file);else if(ent.name==='index.html'){
  pageCount++;const html=await fs.readFile(file,'utf8');
  if(!html.includes('한국소매틱심리연구소'))failures.push('Missing title: '+file);
  for(const m of html.matchAll(/<(a|img|script|link)\b[^>]*\b(?:href|src)="([^"#]+)"/g)){
    let url=m[2];if(!url.startsWith('/')||url.startsWith('//'))continue;
    url=decodeURIComponent(url.split(/[?#]/)[0]);if(m[1]==='img')imageCount++;
    const dest=path.join(root,url);try{const stat=await fs.stat(dest);if(stat.isDirectory())await fs.access(path.join(dest,'index.html'));}catch{failures.push(`${path.relative(root,file)}: missing ${m[1]} ${url}`);}
  }
}}}
await walk(root);
console.log(JSON.stringify({pages:pageCount,localImageReferences:imageCount,failures},null,2));
if(failures.length)process.exitCode=1;
