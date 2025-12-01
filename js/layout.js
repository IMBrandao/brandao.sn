const PARTIAL_FALLBACKS = {
  header: `
    <header>
      <a href="#" class="logo" data-nav-target="home">brandao.sn <span class="logo-badge">BETA</span></a>
      <button class="menu-toggle" type="button" aria-label="Abrir menu" onclick="toggleMenu()"><span></span></button>
      <nav id="mobile-menu" aria-label="Menu principal">
        <a href="#" data-nav-target="home">Início</a>
        <a href="#" data-nav-target="estudos">Estudos</a>
        <a href="#" data-nav-target="contato">Contato</a>
      </nav>
    </header>
  `,
  footer: `
    <footer>
      &copy; 2025 brandao.sn — Todos os direitos reservados
    </footer>
  `
};

function getBasePath() {
  const baseAttr = document.body?.dataset.basePath || './';
  if (baseAttr === '/') return '/';
  return baseAttr.endsWith('/') ? baseAttr : `${baseAttr}/`;
}

function updateNavigationLinks() {
  const basePath = getBasePath();
  const isFileProtocol = window.location.protocol === 'file:';
  const navLinks = document.querySelectorAll('[data-nav-target]');
  navLinks.forEach((link) => {
    const target = link.dataset.navTarget || 'home';
    let resolved;

    if (isFileProtocol) {
      const fileSuffix = target === 'home' ? 'index.html' : `${target}/index.html`;
      resolved = `${basePath}${fileSuffix}`;
    } else {
      const pathSuffix = target === 'home' ? '' : `${target}/`;
      resolved = `${basePath}${pathSuffix}`;
    }

    const normalized = resolved.replace(/\\/g, '/');
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

    const fallbackHtml = PARTIAL_FALLBACKS[partialName];

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

document.addEventListener('DOMContentLoaded', loadPartials);
