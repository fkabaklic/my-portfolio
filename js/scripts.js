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

function updateDarkModeToggleLabels() {
  const isDark = document.body.classList.contains('dark-mode');
  const label = isDark ? 'Light Mode' : 'Dark Mode';
  document.querySelectorAll('.dark-toggle').forEach((btn) => {
    btn.textContent = label;
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  updateDarkModeToggleLabels();
}

function applyDarkModePreference() {
  const stored = localStorage.getItem('darkMode');
  if (stored === 'enabled') {
    document.body.classList.add('dark-mode');
  } else if (stored === 'disabled') {
    document.body.classList.remove('dark-mode');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }
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
