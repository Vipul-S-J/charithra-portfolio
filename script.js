const menuBtn=document.querySelector('.menu-btn');const nav=document.querySelector('.nav');
menuBtn?.addEventListener('click',()=>{const open=nav.style.display==='flex';nav.style.display=open?'':'flex';nav.style.position='absolute';nav.style.right='4vw';nav.style.top='65px';nav.style.padding='18px';nav.style.background='var(--paper)';nav.style.border='1px solid var(--line)';nav.style.flexDirection='column';nav.style.gap='16px';});
document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>{if(window.innerWidth<=800)nav.style.display='';}));
