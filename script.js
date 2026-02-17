/* ============================================================
   FRANKLYN MEDICAL CENTRE — Main JavaScript
   Author: Senior Frontend Developer
   Version: 1.0
   ============================================================ */

(function () {
  'use strict';

  /* ── PRELOADER ─────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero animation after preloader
      triggerHeroReveal();
    }, 4000); // 4-second spinner as requested
  });

  // Prevent scroll during preload
  document.body.style.overflow = 'hidden';

  function triggerHeroReveal() {
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
      // Re-trigger animations for the active slide
      const elements = activeSlide.querySelectorAll('.slide-eyebrow, .slide-title, .slide-desc, .slide-cta-group');
      elements.forEach((el) => {
        el.style.animation = 'none';
        el.offsetHeight; // reflow
        el.style.animation = '';
      });
    }
  }

  /* ── NAVBAR SCROLL BEHAVIOR ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function onScroll() {
    // Sticky shadow
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    const btt = document.getElementById('backToTop');
    if (window.scrollY > 400) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }

    // Active nav link based on section
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], .hero');
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* ── HAMBURGER MENU ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navLinksEl.classList.add('open');
    navOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinksEl.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close on nav link click
  navLinksEl.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── HERO SLIDER ───────────────────────────────────────── */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startSliderAuto() {
    sliderInterval = setInterval(nextSlide, 6000);
  }

  function resetSliderAuto() {
    clearInterval(sliderInterval);
    startSliderAuto();
  }

  document.getElementById('heroNext').addEventListener('click', () => {
    nextSlide();
    resetSliderAuto();
  });

  document.getElementById('heroPrev').addEventListener('click', () => {
    prevSlide();
    resetSliderAuto();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetSliderAuto();
    });
  });

  startSliderAuto();

  // Touch swipe on hero
  let touchStartX = 0;
  const heroSlider = document.getElementById('heroSlider');

  heroSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSlider.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { nextSlide(); } else { prevSlide(); }
      resetSliderAuto();
    }
  }, { passive: true });

  /* ── REVIEWS SLIDER ────────────────────────────────────── */
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewCards = reviewsTrack.querySelectorAll('.review-card');
  let revIndex = 0;
  let cardsVisible = window.innerWidth >= 768 ? 2 : 1;

  function updateReviews() {
    cardsVisible = window.innerWidth >= 768 ? 2 : 1;
    const maxIndex = Math.max(0, reviewCards.length - cardsVisible);
    if (revIndex > maxIndex) revIndex = maxIndex;
    const cardWidth = reviewCards[0].offsetWidth + 24; // 24 = gap
    reviewsTrack.style.transform = `translateX(-${revIndex * cardWidth}px)`;
  }

  document.getElementById('revNext').addEventListener('click', () => {
    const maxIndex = Math.max(0, reviewCards.length - cardsVisible);
    revIndex = revIndex < maxIndex ? revIndex + 1 : 0;
    updateReviews();
  });

  document.getElementById('revPrev').addEventListener('click', () => {
    const maxIndex = Math.max(0, reviewCards.length - cardsVisible);
    revIndex = revIndex > 0 ? revIndex - 1 : maxIndex;
    updateReviews();
  });

  window.addEventListener('resize', updateReviews, { passive: true });

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ── SMOOTH SCROLL ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 75;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── BACK TO TOP ───────────────────────────────────────── */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── CONTACT FORM ──────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach((field) => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e04a4a';
        valid = false;
      }
    });

    if (!valid) {
      // Shake invalid fields
      required.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add('shake');
          setTimeout(() => field.classList.remove('shake'), 500);
        }
      });
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    submitBtn.querySelector('.btn-icon').style.display = 'none';

    // Add spinner to button
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    spinner.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
           style="animation:spin 0.8s linear infinite">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.2"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>`;
    submitBtn.appendChild(spinner);

    // Simulate form submission (1.5s for UX)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      submitBtn.querySelector('.btn-icon').style.display = '';
      spinner.remove();

      // Show success modal
      successModal.classList.add('active');
      document.body.classList.add('no-scroll');

      // Reset form
      contactForm.reset();
    }, 1500);
  });

  modalClose.addEventListener('click', () => {
    successModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // ESC closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
      successModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  /* ── DYNAMIC SPINNER KEYFRAME ──────────────────────────── */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .shake {
      animation: shakeField 0.4s ease;
    }
    @keyframes shakeField {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
    .btn-spinner {
      display: flex;
      align-items: center;
    }
    .form-group input.error,
    .form-group textarea.error {
      border-color: #e04a4a;
    }
  `;
  document.head.appendChild(styleSheet);

  /* ── STATS COUNTER ANIMATION ───────────────────────────── */
  function animateCounter(el, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  // Observe stats section
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Simple: stats are text-based so we just add a class
          entry.target.classList.add('stats-visible');
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ── FORM FIELD FOCUS EFFECTS ──────────────────────────── */
  const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

  formInputs.forEach((input) => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
      if (this.value.trim()) {
        this.style.borderColor = 'var(--purple)';
      } else {
        this.style.borderColor = '';
      }
    });
  });

  /* ── NAVBAR ACTIVE LINK ON CLICK ───────────────────────── */
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      navLinks.forEach((l) => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

})();