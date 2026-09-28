(() => {
  const body = document.body;
  const loader = document.querySelector('.intro-loader');
  const counter = document.querySelector('#loaderCount');
  const line = document.querySelector('.loader-line i');
  const menuBtn = document.querySelector('.menu-btn');
  const menuPanel = document.querySelector('.menu-panel');
  const cursor = document.querySelector('.cursor');
  const preview = document.querySelector('.project-preview');
  const previewImg = preview?.querySelector('img');
  const rows = document.querySelectorAll('.project-row');

  body.classList.add('is-loading');
  let n = 0;
  const countTimer = setInterval(() => {
    n += Math.ceil((100 - n) / 8);
    if (n >= 100) { n = 100; clearInterval(countTimer); }
    if (counter) counter.textContent = String(n).padStart(2, '0');
    if (line) line.style.width = `${n}%`;
  }, 22);

  window.setTimeout(() => {
    loader?.classList.add('done');
    body.classList.remove('is-loading');
  }, 1850);

  const toggleMenu = (force) => {
    const open = typeof force === 'boolean' ? force : !menuPanel.classList.contains('open');
    menuPanel.classList.toggle('open', open);
    menuPanel.setAttribute('aria-hidden', String(!open));
    menuBtn?.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  menuBtn?.addEventListener('click', () => toggleMenu());
  menuPanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const src = row.dataset.image;
      if (previewImg && src) previewImg.src = src;
      preview?.classList.add('show');
    });
    row.addEventListener('mouseleave', () => preview?.classList.remove('show'));
  });

  if (cursor && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      cursor.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 180, fill: 'forwards' });
    });
    document.querySelectorAll('a,button,.project-row').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
