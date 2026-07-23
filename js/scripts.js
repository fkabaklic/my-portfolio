function initNavMenu() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.getElementById('navToggle');
  const dropdown = document.getElementById('navDropdown');

  if (!nav || !toggle || !dropdown) {
    return;
  }

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    dropdown.hidden = !open;
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  dropdown.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}

function initSectionReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const sections = document.querySelectorAll(
    '#main-content > section:not(.hero):not(.work-section):not(.services-section):not(.more-work):not(.contact-cta), .about-grid > section, .container'
  );

  if (sections.length === 0) {
    return;
  }

  sections.forEach((section) => section.classList.add('section-reveal'));

  const reveal = (target, observer) => {
    target.classList.add('is-visible');
    observer.unobserve(target);
  };

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target, observer);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

function observeScrollReveal(items, options) {
  if (items.length === 0) {
    return;
  }

  items.forEach((item) => item.classList.add('scroll-reveal'));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    options
  );

  items.forEach((item) => revealObserver.observe(item));
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  observeScrollReveal(
    document.querySelectorAll(
      '.services-section .services-list__item'
    ),
    {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px',
    }
  );

  observeScrollReveal(document.querySelectorAll('.more-work__item'), {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px',
  });

  observeScrollReveal(document.querySelectorAll('.contact-cta-main'), {
    threshold: 0.15,
    rootMargin: '0px 0px -6% 0px',
  });
}

function initNavScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const nav = document.querySelector('.site-nav');
  if (!nav) {
    return;
  }

  let lastScrollY = window.scrollY;
  let ticking = false;
  const scrollThreshold = 8;
  const topOffset = 64;

  const updateNav = () => {
    const currentScrollY = window.scrollY;

    if (document.body.classList.contains('menu-open')) {
      nav.classList.remove('site-nav--hidden');
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    if (currentScrollY <= topOffset) {
      nav.classList.remove('site-nav--hidden');
    } else if (currentScrollY > lastScrollY + scrollThreshold) {
      nav.classList.add('site-nav--hidden');
    } else if (currentScrollY < lastScrollY - scrollThreshold) {
      nav.classList.remove('site-nav--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true }
  );
}

function trackProjectView(projectName) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'project_view', {
      project_name: projectName,
      event_category: 'engagement',
      event_label: 'project_link_click',
    });
  }
}

function initFooterReveal() {
  const footer = document.querySelector('.site-footer');
  const shell = document.querySelector('.page-shell');
  if (!footer || !shell) return;

  const sync = () => {
    const height = Math.ceil(footer.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--footer-reveal', height + 'px');
  };

  sync();
  window.addEventListener('resize', sync, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(sync);
    ro.observe(footer);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sync);
  }
}

function initDynamicDates() {
  const now = new Date();
  const year = String(now.getFullYear());

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

function initFeaturedWork() {
  const root = document.querySelector('[data-featured-work]');
  if (!root) {
    return;
  }

  const slides = Array.from(root.querySelectorAll('.featured-work__slide'));
  const titleEl = root.querySelector('[data-featured-title]');
  const currentEl = root.querySelector('[data-featured-current]');
  const totalEl = root.querySelector('[data-featured-total]');
  const projectLink = root.querySelector('[data-featured-link]');
  const stage = root.querySelector('.featured-work__stage');
  const prevBtn = root.querySelector('[data-featured-prev]');
  const nextBtn = root.querySelector('[data-featured-next]');
  const total = slides.length;
  let index = 0;
  let timer = null;
  const AUTO_MS = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!total || !titleEl || !currentEl || !totalEl || !projectLink) {
    return;
  }

  totalEl.textContent = String(total);

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (reduceMotion || total < 2) {
      return;
    }
    stop();
    timer = window.setInterval(() => {
      show(index + 1);
    }, AUTO_MS);
  };

  const show = (nextIndex) => {
    index = ((nextIndex % total) + total) % total;

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.hidden = !active;
    });

    const activeSlide = slides[index];
    titleEl.textContent = activeSlide.dataset.title || '';
    projectLink.href = activeSlide.dataset.href || '#';
    projectLink.dataset.project = activeSlide.dataset.title || '';
    currentEl.textContent = String(index + 1);
  };

  const go = (nextIndex) => {
    show(nextIndex);
    start();
  };

  prevBtn?.addEventListener('click', () => go(index - 1));
  nextBtn?.addEventListener('click', () => go(index + 1));

  stage?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    }
  });

  let touchStartX = 0;
  stage?.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0]?.clientX || 0;
      stop();
    },
    { passive: true }
  );
  stage?.addEventListener(
    'touchend',
    (e) => {
      const delta = (e.changedTouches[0]?.clientX || 0) - touchStartX;
      if (Math.abs(delta) < 40) {
        start();
        return;
      }
      go(delta > 0 ? index - 1 : index + 1);
    },
    { passive: true }
  );

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) {
      start();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  show(0);
  start();
}

document.addEventListener('DOMContentLoaded', function () {
  initDynamicDates();
  initFooterReveal();
  initSectionReveal();
  initScrollReveal();
  initNavScroll();
  initNavMenu();
  initFeaturedWork();

  document.querySelectorAll('[data-project]').forEach((link) => {
    link.addEventListener('click', () => trackProjectView(link.dataset.project));
  });
});
