/* =============================================
   NFS CARWASH — JavaScript
   Interactivity: Nav, Scroll, Gallery Lightbox,
   Review Carousel, Reveal Animations
   ============================================= */

(function () {
  'use strict';

  /* ---- NAV: Scroll state + Burger Menu ---- */
  const navbar   = document.getElementById('navbar');
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-cta');

  function updateNav() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  burger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click (mobile)
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- HERO IMAGE: Ken Burns on load ---- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', function () {
        heroImg.classList.add('loaded');
      });
    }
  }

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70', 10);
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.service-card, .why-card, .review-card, .location-detail, .section-header'
  );

  // Add reveal class
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    // Stagger siblings
    const parent = el.parentElement;
    const siblings = Array.from(parent.children);
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx <= 4) {
      el.classList.add('reveal-delay-' + Math.min(idx, 4));
    }
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---- GALLERY LIGHTBOX ---- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const lightboxClose= document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCap.textContent = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () { lightboxImg.src = ''; }, 300);
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ---- REVIEWS: Touch/drag for carousel on mobile ---- */
  const track = document.getElementById('reviews-track');
  if (track) {
    let startX = 0;
    let isDragging = false;
    let startScrollLeft = 0;

    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX - track.offsetLeft;
      startScrollLeft = track.scrollLeft;
      track.style.animationPlayState = 'paused';
    });
    document.addEventListener('mouseup', function () {
      isDragging = false;
      track.style.animationPlayState = '';
    });
    track.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
    });

    // Touch
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].pageX;
      track.style.animationPlayState = 'paused';
    }, { passive: true });
    track.addEventListener('touchend', function () {
      track.style.animationPlayState = '';
    });
  }

  /* ---- ACTIVE NAV LINK on Scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const navOffset = 100;

  function updateActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - navOffset;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });
    navLinksAll.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ---- STATS COUNTER ANIMATION ---- */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statsAnimated = true;
      statNums.forEach(function (el) {
        const target = el.textContent;
        const isPlus = target.includes('+');
        const isStar = target.includes('★');
        const raw = parseFloat(target.replace(/[^0-9.]/g, ''));
        if (isNaN(raw)) return;
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = start + (raw - start) * eased;
          if (isStar) {
            el.textContent = current.toFixed(1) + '★';
          } else if (isPlus) {
            el.textContent = Math.floor(current).toLocaleString() + '+';
          } else {
            el.textContent = Math.floor(current);
          }
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }
  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats();

  /* ---- PARALLAX subtle on Hero ---- */
  const heroBg = document.querySelector('.hero-bg img');
  function onScroll() {
    if (!heroBg) return;
    const scrolled = window.scrollY;
    const rate = scrolled * 0.25;
    heroBg.style.transform = 'scale(1.05) translateY(' + rate + 'px)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- ACTIVE NAV LINK STYLE ---- */
  const style = document.createElement('style');
  style.textContent = '.nav-link.active { color: #fff !important; }';
  document.head.appendChild(style);

})();
