// Header scroll state
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open');
    document.body.style.overflow = mainNav.classList.contains('is-open') ? 'hidden' : '';
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    document.body.style.overflow = '';
  }));
}

// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

// Reels tabs
const reelsTabs = document.querySelectorAll('.reels-tab');
const reels = document.querySelectorAll('.reel');
reelsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    reelsTabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const cat = tab.dataset.cat;
    reels.forEach(r => {
      r.hidden = cat !== 'all' && r.dataset.cat !== cat;
    });
  });
});
document.querySelectorAll('.reel').forEach(reel => {
  const video = reel.querySelector('video');
  if (!video) return;
  reel.addEventListener('mouseenter', () => video.play().catch(() => {}));
  reel.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  reel.addEventListener('click', () => {
    if (video.paused) { video.play(); } else { video.pause(); }
  });
});

// Cookie banner
const cookieBanner = document.querySelector('.cookie-banner');
if (cookieBanner) {
  const KEY = 'rustam_cookie_consent';
  if (!localStorage.getItem(KEY)) {
    setTimeout(() => cookieBanner.classList.add('is-visible'), 900);
  }
  cookieBanner.querySelectorAll('[data-consent]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem(KEY, btn.dataset.consent);
      cookieBanner.classList.remove('is-visible');
    });
  });
}
