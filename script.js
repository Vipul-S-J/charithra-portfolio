(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const loader=$('.site-loader');
  const hideLoader=()=>loader?.classList.add('is-hidden');
  window.addEventListener('load',()=>setTimeout(hideLoader,500)); setTimeout(hideLoader,1800);

  // Scroll reveal
  const revealEls=$$('.reveal,.image-reveal');
  const reveal=el=>el.classList.add('in-view');
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}}),{threshold:.05,rootMargin:'0px 0px -6%'}); revealEls.forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4*70,210)}ms`;io.observe(el)})}else revealEls.forEach(reveal);

  // Mobile menu
  const menu=$('.menu-toggle'),nav=$('.nav'); menu?.addEventListener('click',()=>{const open=menu.classList.toggle('open');nav?.classList.toggle('open',open);menu.setAttribute('aria-expanded',open)}); $$('.nav a').forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('open');nav?.classList.remove('open')}));

  // Reading progress
  const bar=$('.progress-bar'); const progress=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?scrollY/max*100:0)+'%'}; addEventListener('scroll',progress,{passive:true});progress();

  // Active section
  const links=$$('.nav a'), sections=$('main')?$$('main section[id]'):[]; if('IntersectionObserver' in window){const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>so.observe(s))}

  // Project filters
  $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;$$('.project').forEach(p=>p.classList.toggle('is-filtered',f!=='all'&&p.dataset.category!==f));}));

  // Lightbox with keyboard navigation
  const box=$('.lightbox'), boxImg=$('.lightbox img'), cap=$('.lightbox figcaption'); let gallery=[],index=0;
  function open(i){index=i;const im=gallery[index];boxImg.src=im.src;boxImg.alt=im.alt;cap.textContent=im.alt;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  function move(d){index=(index+d+gallery.length)%gallery.length;open(index)}
  function refresh(){gallery=$$('.project-pages img,.hero-image img').filter(im=>!im.closest('.project.is-filtered'));gallery.forEach((im,i)=>im.onclick=()=>open(i))} refresh();
  $('.lightbox-close')?.addEventListener('click',close); $('.lightbox-prev')?.addEventListener('click',()=>move(-1)); $('.lightbox-next')?.addEventListener('click',()=>move(1)); box?.addEventListener('click',e=>{if(e.target===box)close()}); addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)});

  // Cursor / image interaction
  const cursor=$('.cursor'),cursorText=cursor?.querySelector('span'); if(cursor&&matchMedia('(pointer:fine)').matches){let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});const tick=()=>{cx+=(mx-cx)*.16;cy+=(my-cy)*.16;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(tick)};tick();$$('img').forEach(im=>{im.addEventListener('mouseenter',()=>{cursorText.textContent='VIEW';cursor.classList.add('visible')});im.addEventListener('mouseleave',()=>cursor.classList.remove('visible'))})}

  // Subtle mouse parallax on hero
  const heroImg=$('.hero-image'); if(heroImg&&matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){heroImg.addEventListener('mousemove',e=>{const r=heroImg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroImg.querySelector('img').style.transform=`scale(1.035) translate(${x*8}px,${y*8}px)`});heroImg.addEventListener('mouseleave',()=>heroImg.querySelector('img').style.transform='')}

  // Magnetic links
  if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){$$('.scroll-link,.contact-row a,.brand').forEach(el=>{el.classList.add('magnetic');el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')})}
})();
