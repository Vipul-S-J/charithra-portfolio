(() => {
  const loader = document.querySelector('.site-loader');
  const reveals = document.querySelectorAll('.reveal, .image-reveal');
  const cursor = document.querySelector('.cursor');
  const cursorText = cursor?.querySelector('span');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  window.addEventListener('load', () => setTimeout(() => loader?.classList.add('is-hidden'), 1050));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -7% 0px'});
  reveals.forEach((el, i) => { el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`; observer.observe(el); });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.classList.toggle('open'); nav?.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    menuToggle?.classList.remove('open'); nav?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), {rootMargin: '-35% 0px -55% 0px'});
  sections.forEach(section => sectionObserver.observe(section));

  if (cursor && matchMedia('(pointer:fine)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const tick = () => { cx += (mx-cx)*.16; cy += (my-cy)*.16; cursor.style.left=`${cx}px`; cursor.style.top=`${cy}px`; requestAnimationFrame(tick); }; tick();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { cursorText.textContent = el.dataset.cursor; cursor.classList.add('visible'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    });
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect(); el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.08}px,${(e.clientY-(r.top+r.height/2))*.08}px)`; });
      el.addEventListener('mouseleave', () => el.style.transform='');
    });
  }

  const images = document.querySelectorAll('.project-image img'); let ticking=false;
  const parallax=()=>{ const vh=innerHeight; images.forEach(img=>{const r=img.getBoundingClientRect(); if(r.bottom>0&&r.top<vh){const p=(r.top+r.height/2-vh/2)/vh; img.style.translate=`0 ${p*-10}px`;}}); ticking=false; };
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true;}},{passive:true});
})();
