(() => {
  const loader = document.querySelector('.site-loader');
  const reveals = document.querySelectorAll('.reveal, .image-reveal');
  const cursor = document.querySelector('.cursor');
  const cursorText = cursor?.querySelector('span');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const hideLoader = () => loader?.classList.add('is-hidden');
  window.addEventListener('load', () => setTimeout(hideLoader, 700));
  setTimeout(hideLoader, 2200); // fallback so a slow/broken script cannot leave the page covered

  const show = el => el.classList.add('in-view');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { show(entry.target); observer.unobserve(entry.target); }
      });
    }, {threshold: 0.08, rootMargin: '0px 0px -5% 0px'});
    reveals.forEach((el, i) => { el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`; observer.observe(el); });
  } else reveals.forEach(show);

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.classList.toggle('open');
    nav?.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    menuToggle?.classList.remove('open'); nav?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), {rootMargin: '-35% 0px -55% 0px'});
    sections.forEach(section => sectionObserver.observe(section));
  }

  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const tick = () => { cx += (mx-cx)*.16; cy += (my-cy)*.16; cursor.style.left=`${cx}px`; cursor.style.top=`${cy}px`; requestAnimationFrame(tick); }; tick();
    document.querySelectorAll('img').forEach(el => {
      el.addEventListener('mouseenter', () => { if(cursorText) cursorText.textContent='VIEW'; cursor.classList.add('visible'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    });
  }
})();
