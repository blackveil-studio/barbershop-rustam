// Header scroll state + hero parallax + seam badge drift
const header = document.querySelector('.site-header');
const heroImgs = document.querySelectorAll('.hero-media img');
const seamInners = document.querySelectorAll('.seam-inner');
let ticking = false;
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      heroImgs.forEach(img => { img.style.transform = `translateY(${y * 0.1}px) scale(1.04)`; });
      const vh = window.innerHeight;
      seamInners.forEach(el => {
        const rect = el.parentElement.getBoundingClientRect();
        const progress = (rect.top - vh / 2) / (vh / 2);
        const clamped = Math.max(-1, Math.min(1, progress));
        el.style.transform = `translateY(-50%) translateX(${(clamped * -46).toFixed(1)}px)`;
      });
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
const videoLightbox = document.getElementById('videoLightbox');
const lightboxVideo = videoLightbox?.querySelector('.lightbox-video');
function closeLightbox() {
  if (!videoLightbox) return;
  videoLightbox.classList.remove('is-open');
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();
  document.body.style.overflow = '';
}
if (videoLightbox) {
  videoLightbox.addEventListener('click', (e) => {
    if (e.target === videoLightbox || e.target.closest('[data-lightbox-close]')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

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
    if (!videoLightbox) return;
    lightboxVideo.src = video.currentSrc || video.src;
    lightboxVideo.poster = video.poster;
    videoLightbox.classList.add('is-open');
    lightboxVideo.muted = false;
    lightboxVideo.play().catch(() => {});
    document.body.style.overflow = 'hidden';
  });
});

// Gallery: featured photo auto-rotates, click a rail thumb to feature it
const galleryMarquee = document.querySelector('.gallery-marquee');
if (galleryMarquee) {
  const featureImg = galleryMarquee.querySelector('.gallery-feature-img');
  const railThumbs = [...galleryMarquee.querySelectorAll('.gallery-col img')];
  const rotationPool = [...galleryMarquee.querySelectorAll('.gallery-col img:not(.is-dup)')];
  let rotationIndex = 0;
  let rotateTimer = null;

  function showFeature(src, alt) {
    featureImg.classList.add('is-fading');
    setTimeout(() => {
      featureImg.src = src;
      featureImg.alt = alt || '';
      featureImg.classList.remove('is-fading');
    }, 450);
  }

  function restartRotation() {
    if (rotateTimer) clearInterval(rotateTimer);
    rotateTimer = setInterval(() => {
      rotationIndex = (rotationIndex + 1) % rotationPool.length;
      showFeature(rotationPool[rotationIndex].src, rotationPool[rotationIndex].alt);
    }, 5000);
  }

  railThumbs.forEach(img => {
    img.addEventListener('click', () => {
      showFeature(img.src, img.alt);
      const poolIdx = rotationPool.findIndex(p => p.src === img.src);
      if (poolIdx !== -1) rotationIndex = poolIdx;
      restartRotation();
    });
  });

  if (rotationPool.length) restartRotation();
}

// Spotlight glow that follows the cursor on team + review cards
document.querySelectorAll('.team-card, .review-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
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
