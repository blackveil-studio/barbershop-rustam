// Header scroll state + hero parallax
const header = document.querySelector('.site-header');
const heroImgs = document.querySelectorAll('.hero-media img');
let ticking = false;
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
  if (heroImgs.length && !ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      heroImgs.forEach(img => { img.style.transform = `translateY(${y * 0.1}px) scale(1.04)`; });
      ticking = false;
    });
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Hero headline: word-by-word entrance
const heroH1 = document.querySelector('.hero h1');
if (heroH1 && !heroH1.dataset.split) {
  heroH1.dataset.split = '1';
  const walk = (node) => {
    const out = [];
    node.childNodes.forEach(child => {
      if (child.nodeType === 3) {
        child.textContent.split(/( )/).forEach(w => {
          if (w.trim() === '') { out.push(document.createTextNode(w)); }
          else { const s = document.createElement('span'); s.className = 'word'; s.textContent = w; out.push(s); }
        });
      } else {
        const em = document.createElement('em');
        em.append(...walk(child));
        out.push(em);
      }
    });
    return out;
  };
  const words = walk(heroH1);
  heroH1.textContent = '';
  heroH1.append(...words);
  requestAnimationFrame(() => {
    heroH1.querySelectorAll('.word').forEach((w, i) => {
      w.style.transitionDelay = `${i * 0.045}s`;
      requestAnimationFrame(() => w.classList.add('is-in'));
    });
  });
}

// Magnetic buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

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
  const playIcon = document.createElement('div');
  playIcon.className = 'play-icon';
  playIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.35)"/><path d="M10 8l6 4-6 4V8z"/></svg>';
  reel.appendChild(playIcon);
  video.addEventListener('play', () => reel.classList.add('is-playing'));
  video.addEventListener('pause', () => reel.classList.remove('is-playing'));
  reel.addEventListener('mouseenter', () => video.play().catch(() => {}));
  reel.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  reel.addEventListener('click', (e) => {
    e.preventDefault();
    if (video.paused) { video.play().catch(() => {}); } else { video.pause(); }
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
