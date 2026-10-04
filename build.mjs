import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=import.meta.dirname;
const out=path.join(root,'dist');
await fs.mkdir(path.join(out,'assets'),{recursive:true});
await fs.copyFile(path.join(root,'assets/best-self-35-cover.jpg'),path.join(out,'assets/best-self-35-cover.jpg'));
const pages={index:'',counseling:'상담-예약',education:'교육',professionals:'blog',workshops:'워크샵',history:'활동-연혁',books:'저널','post-1':'post/se-중급레벨-그룹테이스-컨설테이션','post-2':'post/se-초급레벨-그룹케이스-컨설테이션'};
const assetMap=new Map();
const texts=[];
const inputs=Object.entries(pages).map(([name,route])=>({name,route,mobile:false}));
for(const [name,route] of Object.entries(pages)) {
  try {await fs.access(path.join(root,'source/mobile',name+'.html'));inputs.push({name,route:'m/'+route,mobile:true});}catch{}
}
for(const {name,route,mobile} of inputs) {
  let html=await fs.readFile(path.join(root,'source',mobile?'mobile':'',name+'.html'),'utf8');
  html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'');
  html=html.replace(/<link\b[^>]*(?:rel=["'](?:preload|prefetch|preconnect|dns-prefetch|canonical)["'])[^>]*>/gi,'');
  html=html.replace(/<meta\b[^>]*(?:name=["']generator|property=["']og:url)[^>]*>/gi,'');
  html=html.replace(/hidden-during-prewarmup/g,'');
  html=html.replace(/\s+srcset="[^"]*"/g,'');
  if(name==='books') {
    html=html.replace(/<img\b[^>]*id="img_comp-kcy7smp7"[^>]*>/g,tag=>tag
      .replace(/\bsrc="[^"]*"/,'src="/assets/best-self-35-cover.jpg"')
      .replace(/\balt="[^"]*"/,'alt="최고의 나를 찾는 심리전략 35 컬러 책 표지"')
      .replace(/object-fit:\s*cover/g,'object-fit:contain'));
  }
  html=html.replace(/(?:https?:)?\/\/www\.somaheart\.org\/?/g,mobile?'/m/':'/');
  html=html.replace(/<a\b[^>]*>/gi,tag=>{
    const anchor=tag.match(/data-anchor="([^"]+)"/);
    if(anchor) {const target=anchor[1]==='SCROLL_TO_BOTTOM'?'location':anchor[1]==='dataItem-kx4kyvdl'?'people':'about';tag=tag.replace(/href="[^"]*"/,`href="/${target==='location'&&route?route.replace(/\/$/,'')+'/':mobile?'m/':''}#${target}"`);}
    return tag;
  });
  html=html.replace(/href="(?:\/m)?\/(profile\/[^" ]+|blog-feed\.xml)"/g,'href="https://www.somaheart.org/$1"');
  // The original SSR uses deliberately blurred thumbnails. Restore the full
  // resolution crop while retaining the original image dimensions and position.
  html=html.replace(/<wow-image\b[^>]*>[\s\S]*?<\/wow-image>/gi,block=>{
    const info=block.match(/data-image-info="([^"]+)"/);
    if(!info)return block;
    try {
      const data=JSON.parse(info[1].replace(/&quot;/g,'"').replace(/&amp;/g,'&'));
      if(data.imageData?.uri && /<img[^>]+src="[^"]*blur_/.test(block)) {
        const width=data.targetWidth||data.imageData.width;
        const height=data.targetHeight||data.imageData.height;
        const url=`https://static.wixstatic.com/media/${data.imageData.uri}/v1/fill/w_${width},h_${height},al_c,q_90/${data.imageData.uri}`;
        block=block.replace(/(<img\b[^>]*\bsrc=")[^"]*/,'$1'+url).replace(/\s+srcset="[^"]*"/g,'');
      }
    }catch{}
    return block;
  });
  html=html.replace(/(["'(])\/\/static\./g,'$1https://static.');
  // Download image and font resources so the replica has its own assets.
  for(const match of html.matchAll(/https:\/\/(?:static\.wixstatic\.com\/media\/[^\s"'<>)]*|static\.parastorage\.com\/fonts\/[^"'<>)]*)/g)) {
    const url=match[0].replace(/&amp;/g,'&');
    if(!assetMap.has(url)) {
      const ext=path.extname(new URL(url).pathname)||'.jpg';
      assetMap.set(url,`/assets/${crypto.createHash('sha256').update(url).digest('hex').slice(0,18)}${ext}`);
    }
  }
  html=html.replace('<head>',`<head><script>if((matchMedia('(max-width: 600px)').matches||screen.width<=600)!==${mobile})location.replace((${mobile}?location.pathname.replace(/^\\/m\\//,'/'):'/m'+location.pathname)+location.search+location.hash);</script>`);
  html=html.replace('</head>','<link rel="stylesheet" href="/replica.css">\n</head>');
  if(mobile)html=html.replace('<body','<body data-replica-mobile="true"');
  html=html.replace('</body>','<script src="/replica.js" defer></script>\n</body>');
  texts.push({route,html});
}
let done=0;
const queue=[...assetMap];
async function worker(){
  while(queue.length){
    const [url,local]=queue.shift();const dest=path.join(out,local);
    try {await fs.access(dest);}
    catch {
      if(!process.argv.includes('--download'))throw new Error('Asset missing. Run node build.mjs --download first.');
      let result;for(let attempt=0;attempt<3;attempt++){try{result=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!result.ok)throw new Error(String(result.status));break;}catch(e){if(attempt===2)throw new Error(`Asset download failed: ${url}: ${e.message}`);}}
      await fs.writeFile(dest,Buffer.from(await result.arrayBuffer()));
    }
    done++;if(done%20===0)console.log(`${done}/${assetMap.size} assets ready`);
  }
}
await Promise.all(Array.from({length:5},worker));
for(let {route,html} of texts){
  for(const [url,local] of assetMap){html=html.split(url).join(local).split(url.replace(/&/g,'&amp;')).join(local);}
  const dir=path.join(out,route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),html);
}
for(const name of ['replica.css','replica.js'])await fs.copyFile(path.join(root,name),path.join(out,name));
await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log(`Built ${texts.length} pages with ${assetMap.size} local assets`);
