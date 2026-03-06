(() => {
  'use strict';

  // ── Scroll-aware navigation ──
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ──
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    links.classList.toggle('nav__links--open');
    document.body.style.overflow = links.classList.contains('nav__links--open') ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    });
  });

  // ── Reveal-on-scroll ──
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('reveal--visible'));
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
