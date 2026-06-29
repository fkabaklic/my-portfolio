function toggleMenu() {
  const overlay = document.getElementById('menuOverlay');
  const hamburger = document.getElementById('hamburgerBtn');
  const isOpen = overlay.classList.toggle('active');
  document.body.classList.toggle('menu-open', isOpen);
  if (hamburger) {
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }
}

function isDarkTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.body.classList.toggle('dark-mode', isDark);
  updateDarkModeToggleLabels();
}

function updateDarkModeToggleLabels() {
  const isDark = isDarkTheme();

  document.querySelectorAll('.dark-toggle').forEach((btn) => {
    if (btn.classList.contains('menu-dark-toggle')) {
      btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      return;
    }

    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

    const moon = btn.querySelector('.theme-toggle__icon--moon');
    const sun = btn.querySelector('.theme-toggle__icon--sun');

    if (moon) {
      moon.hidden = isDark;
    }

    if (sun) {
      sun.hidden = !isDark;
    }
  });

  updateGithubButtonIcons();
}

function updateGithubButtonIcons() {
  document.querySelectorAll('.github-button img').forEach((img) => {
    img.src = isDarkTheme() ? 'img/github-light.svg' : 'img/github.svg';
  });
}

function toggleDarkMode() {
  applyTheme(!isDarkTheme());
  localStorage.setItem('darkMode', isDarkTheme() ? 'enabled' : 'disabled');
}

function applyDarkModePreference() {
  const stored = localStorage.getItem('darkMode');
  let isDark = false;

  if (stored === 'enabled') {
    isDark = true;
  } else if (stored === 'disabled') {
    isDark = false;
  } else {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme(isDark);
}

function initSectionReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const sections = document.querySelectorAll(
    '#main-content > section:not(.hero), #main-content > footer, main.about-grid > section, body > footer, .container'
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

  const footerObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target, observer);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px 120px 0px' }
  );

  sections.forEach((section) => {
    if (section.tagName === 'FOOTER') {
      footerObserver.observe(section);
    } else {
      sectionObserver.observe(section);
    }
  });
}

function initToolboxMarquee() {
  const track = document.querySelector('.toolbox-marquee-track');
  if (!track || track.dataset.marqueeReady === 'true') return;

  const template = track.querySelector('.toolbox-marquee-group');
  if (!template) return;

  const MARQUEE_STYLE_ID = 'toolbox-marquee-keyframes';
  const DURATION = 45;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cachedDistance = 0;
  let cachedViewportWidth = 0;
  let resizeTimer;

  const cloneGroup = () => {
    const clone = template.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('[alt]').forEach((el) => {
      if (el.getAttribute('alt')) {
        el.setAttribute('alt', '');
      }
    });
    return clone;
  };

  const measure = () => {
    const firstGroup = track.querySelector('.toolbox-marquee-group');
    if (!firstGroup) return 0;
    return Math.round(firstGroup.getBoundingClientRect().width);
  };

  const ensureGroups = () => {
    const minWidth = track.parentElement?.offsetWidth || window.innerWidth;

    while (track.scrollWidth < minWidth * 2) {
      track.appendChild(cloneGroup());
    }

    if (track.querySelectorAll('.toolbox-marquee-group').length < 2) {
      track.appendChild(cloneGroup());
    }
  };

  const rebuildGroups = () => {
    track.querySelectorAll('.toolbox-marquee-group:not(:first-child)').forEach((group) => {
      group.remove();
    });
    ensureGroups();
  };

  const applyAnimation = (distance) => {
    if (prefersReducedMotion || distance <= 0) return;
    if (distance === cachedDistance && track.dataset.marqueeAnimating === 'true') return;

    cachedDistance = distance;

    let styleEl = document.getElementById(MARQUEE_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = MARQUEE_STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @keyframes toolbox-marquee-scroll {
        from { transform: translate3d(0, 0, 0); }
        to { transform: translate3d(-${distance}px, 0, 0); }
      }
    `;

    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.animation = `toolbox-marquee-scroll ${DURATION}s linear infinite`;
    track.dataset.marqueeAnimating = 'true';
  };

  const sync = ({ rebuild = false } = {}) => {
    const viewportWidth = window.innerWidth;

    if (rebuild || viewportWidth !== cachedViewportWidth) {
      rebuildGroups();
      cachedViewportWidth = viewportWidth;
    }

    applyAnimation(measure());
  };

  const debouncedResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth;

      if (viewportWidth !== cachedViewportWidth) {
        sync({ rebuild: true });
        return;
      }

      const distance = measure();
      if (distance !== cachedDistance) {
        applyAnimation(distance);
      }
    }, 200);
  };

  sync({ rebuild: true });

  window.addEventListener('resize', debouncedResize, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      const distance = measure();
      if (distance !== cachedDistance) {
        applyAnimation(distance);
      }
    });
  }

  track.querySelectorAll('img').forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', () => {
        const distance = measure();
        if (distance !== cachedDistance) {
          applyAnimation(distance);
        }
      }, { once: true });
    }
  });

  track.dataset.marqueeReady = 'true';
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

document.addEventListener('DOMContentLoaded', function () {
  applyDarkModePreference();
  updateDarkModeToggleLabels();
  initSectionReveal();
  initToolboxMarquee();

  document.querySelectorAll('.dark-toggle').forEach((btn) => {
    btn.addEventListener('click', toggleDarkMode);
  });

  const hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  document.querySelectorAll('.menu-overlay a').forEach((link) => {
    link.addEventListener('click', () => {
      const overlay = document.getElementById('menuOverlay');
      if (overlay && overlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('menuOverlay');
      if (overlay && overlay.classList.contains('active')) {
        toggleMenu();
      }
    }
  });

  document.querySelectorAll('[data-project]').forEach((link) => {
    link.addEventListener('click', () => trackProjectView(link.dataset.project));
  });

  const words = document.querySelectorAll('.headline-word');
  words.forEach((word, i) => {
    setTimeout(() => word.classList.add('visible'), i * 200);
  });

  const texts = document.querySelectorAll('.cycling-text');
  if (texts.length > 0) {
    let currentIndex = 0;
    texts[0].classList.add('active');

    setInterval(() => {
      texts[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % texts.length;
      texts[currentIndex].classList.add('active');
    }, 3000);
  }
});
