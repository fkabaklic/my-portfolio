const HEROICONS_CDN = 'https://cdn.jsdelivr.net/npm/heroicons@2.2.0';
const SIMPLE_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons';

const ICON_SOURCES = {
  moon: `${HEROICONS_CDN}/24/outline/moon.svg`,
  sun: `${HEROICONS_CDN}/24/solid/sun.svg`,
  clock: `${HEROICONS_CDN}/24/outline/clock.svg`,
  envelope: `${HEROICONS_CDN}/24/outline/envelope.svg`,
  'document-text': `${HEROICONS_CDN}/24/outline/document-text.svg`,
  github: `${SIMPLE_ICONS_CDN}/github.svg`,
  linkedin: `${SIMPLE_ICONS_CDN}/linkedin.svg`,
};

const BRAND_ICONS = new Set(['github', 'linkedin']);
const iconCache = new Map();

function prepareSvg(svg, name) {
  svg.removeAttribute('data-slot');
  svg.removeAttribute('role');
  svg.removeAttribute('xmlns');

  const title = svg.querySelector('title');
  if (title) {
    title.remove();
  }

  svg.setAttribute('class', 'icon__svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  if (BRAND_ICONS.has(name)) {
    svg.setAttribute('fill', 'currentColor');
    svg.querySelectorAll('path').forEach((path) => {
      path.setAttribute('fill', 'currentColor');
    });
  }

  return svg;
}

async function fetchIcon(name) {
  if (iconCache.has(name)) {
    return iconCache.get(name);
  }

  const url = ICON_SOURCES[name];
  if (!url) {
    return null;
  }

  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) {
    return null;
  }

  const markup = prepareSvg(svg, name).outerHTML;
  iconCache.set(name, markup);
  return markup;
}

async function initHeroicons() {
  const elements = document.querySelectorAll('[data-icon]');

  await Promise.all(
    [...elements].map(async (element) => {
      const markup = await fetchIcon(element.dataset.icon);
      if (markup) {
        element.innerHTML = markup;
      }
    })
  );
}

document.addEventListener('DOMContentLoaded', initHeroicons);
