(function(){
  'use strict';

  // ---------- Reset scroll position on refresh ----------
  if('scrollRestoration' in history){
    history.scrollRestoration = 'manual';
  }
  if(!location.hash){
    window.scrollTo(0, 0);
  }

  // ---------- Sticky nav scroll state ----------
  const nav = document.getElementById('site-nav');
  if(nav){
    const setScrolled = () => {
      if(window.scrollY > 8){
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, {passive:true});
  }

  // ---------- Mobile menu toggle ----------
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(hamburger && mobileMenu){
    const close = () => {
      mobileMenu.classList.remove('is-open');
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded','false');
      hamburger.setAttribute('aria-label','Open menu');
    };
    const open = () => {
      mobileMenu.hidden = false;
      mobileMenu.classList.add('is-open');
      hamburger.setAttribute('aria-expanded','true');
      hamburger.setAttribute('aria-label','Close menu');
    };
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // ---------- Hero invoice cycling examples ----------
  const invoiceBody = document.getElementById('hv-invoice-body');
  const invoiceTotal = document.getElementById('hv-invoice-total');
  if(invoiceBody && invoiceTotal && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const examples = [
      {lines:[['Excavator — CAT 320','$148,000'],['Delivery & commissioning','$3,400'],['12-month service plan','$6,200']], total:'$157,600'},
      {lines:[['Annual platform licence (50 seats)','$84,000'],['Onboarding & migration','$8,500'],['Premium support','$7,200']], total:'$99,700'},
      {lines:[['Site fit-out — 1,200 m²','$112,500'],['Mechanical & electrical','$24,000'],['Project management','$9,800']], total:'$146,300'},
      {lines:[['Steel & framing materials','$68,400'],['Concrete & footings','$19,200'],['Specialised hardware','$12,300']], total:'$99,900'}
    ];
    let idx = 0;
    setInterval(() => {
      invoiceBody.classList.add('is-fading');
      invoiceTotal.classList.add('is-fading');
      setTimeout(() => {
        idx = (idx + 1) % examples.length;
        const ex = examples[idx];
        invoiceBody.innerHTML = ex.lines.map(([l,r]) => `<div class="hv-line"><span>${l}</span><span>${r}</span></div>`).join('');
        invoiceTotal.textContent = ex.total;
        invoiceBody.classList.remove('is-fading');
        invoiceTotal.classList.remove('is-fading');
      }, 400);
    }, 4000);
  }

  // ---------- Fill quote-tile grids (Stage 2 visualisation) ----------
  document.querySelectorAll('.iv-grid__tiles').forEach(grid => {
    const existing = grid.querySelectorAll('.iv-grid__tile').length;
    for(let i = existing; i < 100; i++){
      const tile = document.createElement('span');
      tile.className = 'iv-grid__tile';
      grid.appendChild(tile);
    }
  });

  // ---------- Reveal-on-scroll observer ----------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if(reduceMotion){
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {rootMargin:'-10% 0px -10% 0px', threshold:0.1});
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
})();

// ---------- Cookie consent bar ----------
(function(){
  const STORAGE_KEY = 'tf-connect-cookie-consent';
  const bar = document.getElementById('cookie-bar');
  if(!bar) return;

  let existing = null;
  try { existing = localStorage.getItem(STORAGE_KEY); } catch(e){}

  if(!existing){
    bar.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('is-visible')));
  }

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cookie-action]');
    if(!btn) return;
    const choice = btn.dataset.cookieAction;
    try { localStorage.setItem(STORAGE_KEY, choice); } catch(e){}
    bar.classList.remove('is-visible');
    setTimeout(() => { bar.hidden = true; }, 350);
    document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { choice } }));
  });
})();
