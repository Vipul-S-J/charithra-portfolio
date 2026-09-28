(() => {
  const body=document.body, loader=document.querySelector('.loader'), count=document.querySelector('.loader-count');
  let n=0; const tick=setInterval(()=>{n+=4;if(n>100)n=100;if(count)count.textContent=String(n).padStart(2,'0');if(n===100){clearInterval(tick);setTimeout(()=>{loader.classList.add('hide');body.classList.remove('is-loading')},350)}},22);
  const menu=document.querySelector('.menu-overlay'), trigger=document.querySelector('.menu-trigger');
  const setMenu=open=>{menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));trigger.setAttribute('aria-expanded',String(open));document.body.classList.toggle('is-loading',open)};
  trigger.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  const cursor=document.querySelector('.cursor');
  if(cursor && matchMedia('(pointer:fine)').matches){document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('active')});document.querySelectorAll('a,button,.project-images img').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('big'));el.addEventListener('mouseleave',()=>cursor.classList.remove('big'))})}
  const items=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});items.forEach(x=>io.observe(x));
  const hero=document.querySelector('.hero-image');
  window.addEventListener('scroll',()=>{if(hero && !matchMedia('(prefers-reduced-motion: reduce)').matches){const y=Math.min(window.scrollY*.10,70);hero.style.transform=`translateY(${y}px)`}}, {passive:true});
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(!el)return;e.preventDefault();el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}));
})();
