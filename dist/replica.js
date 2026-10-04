(() => {
  const rich=[...document.querySelectorAll('[data-testid="richTextElement"]')];
  const about=rich.find(el=>el.querySelector('h2')&&el.textContent.includes('국혜조'));
  const people=document.querySelector('[aria-label="함께하는 사람들"][role="region"]')||rich.find(el=>el.textContent.replace(/[\u200B-\u200D\uFEFF]/g,'').trim()==='함께하는 사람들');
  const address=rich.find(el=>el.textContent.includes('서울특별시 마포구 백범로')&&el.textContent.includes('주차'));
  for(const [name,element] of Object.entries({about,people,location:address}))if(element&&!document.getElementById(name)){const anchor=document.createElement('span');anchor.id=name;anchor.style.cssText='display:block;position:absolute;top:0';element.prepend(anchor);}
  if(!address&&!document.getElementById('location')){const footer=document.getElementById('SITE_FOOTER');if(footer){const anchor=document.createElement('span');anchor.id='location';footer.prepend(anchor);}}
  document.querySelectorAll('a[href]').forEach(a=>{
    if(a.getAttribute('href').endsWith('&nbsp;'))a.href=a.getAttribute('href').replace(/&nbsp;$/,'');
    if(a.getAttribute('href').startsWith('http'))a.rel='noopener noreferrer';
  });
  if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}
  const postWidget=document.getElementById('TPAMultiSection_lhnffpt8');
  const postBody=postWidget?.querySelector('[data-hook="post-description"]');
  if(postBody) {
    const titleText=postWidget.querySelector('h1[data-hook="post-title"]')?.textContent.trim()||document.title;
    const content=postBody.cloneNode(true);
    content.querySelectorAll('script,style,button').forEach(el=>el.remove());
    [content,...content.querySelectorAll('*')].forEach(el=>{
      [...el.attributes].forEach(attr=>{if(!['href','src','alt','target','rel','width','height'].includes(attr.name))el.removeAttribute(attr.name);});
    });
    content.className='replica-post-content';
    const article=document.createElement('article');article.className='replica-post';
    const back=document.createElement('a');back.href=document.body.dataset.replicaMobile?'/m/blog/':'/blog/';back.className='replica-post-back';back.textContent='← SE 전문가 목록';
    const title=document.createElement('h1');title.textContent=titleText;
    const meta=document.createElement('p');meta.className='replica-post-meta';meta.textContent=['somaheartkorea',postWidget.querySelector('[data-hook="time-ago"]')?.textContent].filter(Boolean).join(' · ');
    article.append(back,title,meta,content);postWidget.replaceChildren(article);postWidget.style.height='auto';postWidget.style.minHeight='0';
  }
  const blogWidget=document.getElementById('TPASection_lhnffprk');
  if(blogWidget) {
    const cards=[...blogWidget.querySelectorAll('[data-hook="post-list-item"]')].map(card=>{
      const title=card.querySelector('a[href*="/post/"]');
      return title?{href:title.href,title:title.textContent.trim(),author:card.querySelector('[data-hook="user-name"]')?.textContent||'somaheartkorea',date:card.querySelector('[data-hook="time-ago"]')?.textContent||''}:null;
    }).filter(Boolean);
    if(cards.length) {
      const list=document.createElement('div');list.className='replica-consultation-list';
      cards.forEach(card=>{
        const link=document.createElement('a');link.href=card.href;link.className='replica-consultation-link';link.setAttribute('aria-label',card.title);
        const meta=document.createElement('span');meta.className='replica-consultation-meta';
        const author=document.createElement('span');author.textContent=card.author;
        const date=document.createElement('span');date.textContent=card.date;meta.append(author,date);
        const title=document.createElement('h2');title.textContent=card.title;link.append(meta,title);list.append(link);
      });
      blogWidget.replaceChildren(list);blogWidget.style.height='auto';blogWidget.style.minHeight='0';
    }
  }
  if(document.body.dataset.replicaMobile) {
    const links=[['Diverse Bodies','/m/'],['함께하는 사람들','/m/#people'],['상담 예약','/m/상담-예약/'],['교육','/m/교육/'],['SE 전문가','/m/blog/'],['워크샵','/m/워크샵/'],['활동 연혁','/m/활동-연혁/'],['도서','/m/저널/'],['오시는 길',location.pathname+'#location']];
    const menu=document.createElement('nav');menu.className='replica-mobile-menu';menu.setAttribute('aria-label','사이트 메뉴');
    menu.innerHTML='<button aria-label="메뉴 닫기">×</button>'+links.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
    document.body.append(menu);
    const close=()=>{menu.classList.remove('open');document.body.style.overflow='';};
    menu.querySelector('button').onclick=close;menu.querySelectorAll('a').forEach(a=>a.onclick=close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
    const trigger=document.querySelector('[data-testid="tinymenu-menubutton"]')||document.querySelector('[data-testid="hamburger-menu"]')||document.querySelector('[aria-label*="Open navigation"]')||document.querySelector('.wixui-menu-toggle');
    if(trigger){trigger.setAttribute('role','button');trigger.setAttribute('aria-label','메뉴 열기');trigger.tabIndex=0;const open=()=>{menu.classList.add('open');document.body.style.overflow='hidden';menu.querySelector('button').focus();};trigger.onclick=open;trigger.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};}
  }
})();
