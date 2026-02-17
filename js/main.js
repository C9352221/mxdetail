/* ══════════════════════════════════════════════════ */
/* MX Detail — Main JavaScript                       */
/* ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Reduced Motion Check ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Mobile Detection ──
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  // ══════════════════════════════════════
  // NAVBAR SCROLL TRANSITION
  // ══════════════════════════════════════
  const navbar = document.querySelector('.navbar');
  const topBar = document.querySelector('.top-bar');

  function handleNavScroll() {
    if (!navbar) return;
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load

  // ══════════════════════════════════════
  // HAMBURGER MENU
  // ══════════════════════════════════════
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first link
    if (mobileLinks.length > 0) {
      setTimeout(function () { mobileLinks[0].focus(); }, 100);
    }
  }

  function closeMenu() {
    menuOpen = false;
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    navToggle.focus();
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) {
        closeMenu();
      }
    });

    // Close when clicking a link
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Focus trap
    document.addEventListener('keydown', function (e) {
      if (!menuOpen || e.key !== 'Tab') return;

      var focusable = mobileMenu.querySelectorAll('a, button');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ══════════════════════════════════════
  // SCROLL ANIMATIONS (IntersectionObserver)
  // ══════════════════════════════════════
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // If reduced motion or no IntersectionObserver, show everything
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ══════════════════════════════════════
  // PACKAGE ACCORDIONS
  // ══════════════════════════════════════
  document.querySelectorAll('.pkg-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var accordion = this.closest('.pkg-accordion');
      var isOpen = accordion.classList.contains('open');

      // Close all other accordions in the same category
      var category = accordion.closest('.pkg-category');
      if (category) {
        category.querySelectorAll('.pkg-accordion.open').forEach(function (openItem) {
          if (openItem !== accordion) {
            openItem.classList.remove('open');
            openItem.querySelector('.pkg-header').setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Toggle this one
      accordion.classList.toggle('open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // ══════════════════════════════════════
  // PARALLAX — MOBILE FALLBACK
  // ══════════════════════════════════════
  if (isMobile) {
    document.querySelectorAll('.hero, .parallax-cta').forEach(function (el) {
      el.style.backgroundAttachment = 'scroll';
    });
  }

  // ══════════════════════════════════════
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ══════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight + 20 : 20;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

})();
