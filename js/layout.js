const PARTIAL_FALLBACKS = {
  header: {
    'pt-br': `
      <header>
        <a href="#" class="logo" data-nav-target="home">brandao.sn <span class="logo-badge">BETA</span></a>
        <button class="menu-toggle" type="button" aria-label="Abrir menu" onclick="toggleMenu()"><span></span></button>
        <nav id="mobile-menu" aria-label="Menu principal">
          <a href="#" data-nav-target="home">Início</a>
          <a href="#" data-nav-target="estudos">Estudos</a>
          <a href="#" data-nav-target="contato">Contato</a>
          <div class="language-toggle" data-lang-toggle aria-label="Alternar idioma">
            <a href="https://brandao.sn/" data-lang-option="pt" class="lang-link active">PT</a>
            <span class="language-toggle-divider" aria-hidden="true">/</span>
            <a href="https://brandao.sn/en/" data-lang-option="en" class="lang-link">EN</a>
          </div>
        </nav>
      </header>
    `,
    en: `
      <header>
        <a href="#" class="logo" data-nav-target="home">brandao.sn <span class="logo-badge">BETA</span></a>
        <button class="menu-toggle" type="button" aria-label="Open menu" onclick="toggleMenu()"><span></span></button>
        <nav id="mobile-menu" aria-label="Primary menu">
          <a href="#" data-nav-target="home">Home</a>
          <a href="#" data-nav-target="estudos">Studies</a>
          <a href="#" data-nav-target="contato">Contact</a>
          <div class="language-toggle" data-lang-toggle aria-label="Switch language">
            <a href="https://brandao.sn/" data-lang-option="pt" class="lang-link">PT</a>
            <span class="language-toggle-divider" aria-hidden="true">/</span>
            <a href="https://brandao.sn/en/" data-lang-option="en" class="lang-link active">EN</a>
          </div>
        </nav>
      </header>
    `
  },
  footer: {
    'pt-br': `
      <footer>
        &copy; 2025 brandao.sn — Todos os direitos reservados
      </footer>
    `,
    en: `
      <footer>
        &copy; 2025 brandao.sn — All rights reserved
      </footer>
    `
  }
};

function getDocumentLang() {
  return (document.documentElement.lang || 'pt-BR').toLowerCase();
}

function getFallbackMarkup(partialName) {
  const fallback = PARTIAL_FALLBACKS[partialName];
  if (!fallback) return null;
  if (typeof fallback === 'string') return fallback;
  const lang = getDocumentLang();
  return fallback[lang] || fallback['pt-br'] || Object.values(fallback)[0];
}

function getBasePath() {
  const baseAttr = document.body?.dataset.basePath || './';
  if (baseAttr === '/') return '/';
  return baseAttr.endsWith('/') ? baseAttr : `${baseAttr}/`;
}

function resolveRouteUrl(target = 'home') {
  const basePath = getBasePath();
  const isFileProtocol = window.location.protocol === 'file:';
  let resolved;

  if (isFileProtocol) {
    const fileSuffix = target === 'home' ? 'index.html' : `${target}/index.html`;
    resolved = `${basePath}${fileSuffix}`;
  } else {
    const pathSuffix = target === 'home' ? '' : `${target}/`;
    resolved = `${basePath}${pathSuffix}`;
  }

  return resolved.replace(/\\/g, '/');
}

function navigateToRoute(target = 'home') {
  const destination = resolveRouteUrl(target);
  window.location.href = destination;
}

function updateNavigationLinks() {
  const navLinks = document.querySelectorAll('[data-nav-target]');
  navLinks.forEach((link) => {
    const target = link.dataset.navTarget || 'home';
    const normalized = resolveRouteUrl(target);
    link.setAttribute('href', normalized);
  });
}

function renderMarkup(target, markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  target.replaceWith(template.content.cloneNode(true));
}

async function loadPartials() {
  const includeTargets = document.querySelectorAll('[data-include]');
  const basePath = getBasePath();
  if (!includeTargets.length) {
    updateNavigationLinks();
    highlightActiveNavigation();
    document.dispatchEvent(new CustomEvent('partials:loaded'));
    return;
  }

  const isFileProtocol = window.location.protocol === 'file:';

  const loaders = Array.from(includeTargets).map(async (placeholder) => {
    const partialName = placeholder.dataset.include;
    if (!partialName) return;

    const fallbackHtml = getFallbackMarkup(partialName);

    if (isFileProtocol && fallbackHtml) {
      renderMarkup(placeholder, fallbackHtml);
      return;
    }

    try {
      const partialUrl = basePath === '/'
        ? `/partials/${partialName}.html`
        : `${basePath}partials/${partialName}.html`;
      const response = await fetch(partialUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Falha ao carregar ${partialName}`);

      const html = await response.text();
      renderMarkup(placeholder, html);
    } catch (error) {
      console.error(`[partials] Não foi possível renderizar ${partialName}:`, error);
      if (fallbackHtml) {
        console.warn(`[partials] Usando fallback inline para ${partialName}.`);
        renderMarkup(placeholder, fallbackHtml);
      }
    }
  });

  await Promise.all(loaders);
  updateNavigationLinks();
  highlightActiveNavigation();
  document.dispatchEvent(new CustomEvent('partials:loaded'));
}

function highlightActiveNavigation() {
  const currentRoute = document.body?.dataset.route || 'home';
  const navLinks = document.querySelectorAll('nav a[data-nav-target]');

  navLinks.forEach((link) => {
    const target = link.dataset.navTarget || 'home';
    const isActive = target === currentRoute || (currentRoute === 'home' && target === 'home');

    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

function normalizeLanguageSlug(rawSlug = '') {
  if (!rawSlug || rawSlug === '/') return '/';
  let slug = rawSlug.trim();
  if (!slug.startsWith('/')) slug = `/${slug}`;
  slug = slug.replace(/\\/g, '/');
  slug = slug.replace(/\/{2,}/g, '/');
  const isFile = slug.includes('.');
  if (!isFile && !slug.endsWith('/')) slug = `${slug}/`;
  return slug === '//' ? '/' : slug;
}

function getPreferredOrigin() {
  const { origin, protocol } = window.location;
  if (origin && protocol && protocol.startsWith('http')) return origin;
  return 'https://brandao.sn';
}

function buildLanguageUrl(targetLang = 'en') {
  const slug = normalizeLanguageSlug(document.body?.dataset.langSlug || '');
  let path;
  if ((targetLang === 'en' || targetLang === 'en-us' || targetLang === 'en-gb')) {
    path = slug === '/' ? '/en/' : `/en${slug}`;
  } else {
    path = slug;
  }

  if (path !== '/' && path.endsWith('//')) {
    path = path.replace(/\/{2,}$/, '/');
  }

  return `${getPreferredOrigin()}${path}`;
}

function updateLanguageToggleLinks() {
  const toggles = document.querySelectorAll('[data-lang-toggle]');
  if (!toggles.length) return;

  const currentLang = getDocumentLang();
  const isPt = currentLang.startsWith('pt');
  const ptUrl = buildLanguageUrl('pt-br');
  const enUrl = buildLanguageUrl('en');

  toggles.forEach((toggle) => {
    const ptLink = toggle.querySelector('[data-lang-option="pt"]');
    const enLink = toggle.querySelector('[data-lang-option="en"]');

    if (ptLink) {
      ptLink.href = ptUrl;
      ptLink.classList.toggle('active', isPt);
      if (isPt) {
        ptLink.setAttribute('aria-current', 'page');
      } else {
        ptLink.removeAttribute('aria-current');
      }
    }

    if (enLink) {
      enLink.href = enUrl;
      enLink.classList.toggle('active', !isPt);
      if (!isPt) {
        enLink.setAttribute('aria-current', 'page');
      } else {
        enLink.removeAttribute('aria-current');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', loadPartials);
document.addEventListener('DOMContentLoaded', updateLanguageToggleLinks);
document.addEventListener('partials:loaded', updateLanguageToggleLinks);
