/* ================================================
   LUIS ALFONSO PÉREZ FUENTES — Intérprete LSC
   script.js | Interactividad accesible y ligera
   ================================================ */

(function () {
  'use strict';

  /* ---- 1. Año actual en footer ---- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- 2. Header: scroll → clase "scrolled" ---- */
  const header = document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // ejecutar al cargar

  /* ---- 3. Menú móvil (toggle) ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');

  function openNav() {
    mainNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.style.overflow = '';
  }

  function toggleNav() {
    const isOpen = mainNav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', toggleNav);

    // Cerrar al hacer click en un enlace
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Cerrar al hacer click fuera del nav (en overlay)
    document.addEventListener('click', function (e) {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });
  }

  /* ---- 4. Navegación suave: offset por header fijo ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 72;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Mover foco al destino para accesibilidad
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', function () {
        this.removeAttribute('tabindex');
      }, { once: true });
    });
  });

  /* ---- 5. Scroll Reveal (IntersectionObserver) ---- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .process-step, .about-grid, .stat, .section-header'
  );

  // Añadir clase reveal a los elementos
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  // Añadir delays escalonados a tarjetas dentro de grids
  document.querySelectorAll('.services-grid .service-card').forEach(function (card, i) {
    card.classList.add('reveal-delay-' + Math.min(i + 1, 4));
  });

  document.querySelectorAll('.process-step').forEach(function (step, i) {
    step.classList.add('reveal-delay-' + Math.min(i + 1, 4));
  });

  // Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: mostrar todo si no hay soporte
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- 6. Indicar enlace activo en la nav según sección visible ---- */
  const sections = document.querySelectorAll('main section[id], footer[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  function setActiveLink() {
    const headerH  = header ? header.offsetHeight : 72;
    const scrollY  = window.scrollY + headerH + 60;
    let activeSect = null;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) activeSect = section.id;
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('nav-active', href === activeSect);
      link.setAttribute('aria-current', href === activeSect ? 'true' : 'false');
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---- 7. Botón WhatsApp: confirmación accesible ---- */
  // El botón ya tiene target="_blank" y rel="noopener", sólo aseguramos
  // que el número se pueda actualizar desde un solo lugar si se desea.
  // Para cambiar el número: modificar el atributo href de los <a> de WhatsApp.

})();
