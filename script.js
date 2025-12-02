function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.getElementById('blur-overlay');
  const content2 = document.getElementById('content2');
  const body = document.body;

  if (!menu || !toggle || !overlay) return;

  const isActive = menu.classList.toggle('active');
  toggle.classList.toggle('active');
  overlay.classList.toggle('active');
  if (body) {
    if (isActive) {
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
    }
  }

  if (isActive) {
    setTimeout(() => {
      if (content2) content2.style.opacity = '0';
    }, 200);
  } else if (content2) {
    content2.style.opacity = '1';
  }
}

document.getElementById('blur-overlay')?.addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  if (menu?.classList.contains('active')) {
    toggleMenu();
  }
});

function handleNavLinkClick() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;

  const shouldClose = window.matchMedia('(max-width: 768px)').matches && menu.classList.contains('active');
  if (shouldClose) {
    toggleMenu();
  }
}

function bindMenuAutoClose() {
  const navLinks = document.querySelectorAll('nav a[href]');
  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    link.removeEventListener('click', handleNavLinkClick);
    link.addEventListener('click', handleNavLinkClick);
  });
}

function reinitializeEffects() {
  const typingElement = document.querySelector('.typing');
  if (typingElement) {
    typingElement.classList.remove('typing-complete');
    typingElement.style.animation = 'none';
    setTimeout(() => {
      typingElement.style.animation = 'type 2s steps(9, end) 0s forwards, blinkCursor 1.2s step-end 3';
    }, 10);
    typingElement.addEventListener('animationend', (e) => {
      if (e.animationName === 'blinkCursor') {
        typingElement.classList.add('typing-complete');
      }
    });
  }

  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-load');
    setTimeout(() => {
      mainContent.classList.remove('page-load');
    }, 500);
  }
}

function hydrateNavigationInteractions() {
  bindMenuAutoClose();
}

document.addEventListener('partials:loaded', hydrateNavigationInteractions);
document.addEventListener('DOMContentLoaded', hydrateNavigationInteractions);

let estudosSpacingRaf = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function applyEstudosSpacing() {
  if (!document.body.classList.contains('page-estudos')) return;

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const rootStyles = getComputedStyle(document.documentElement);
  const headerHeight = parseFloat(rootStyles.getPropertyValue('--header-height')) || 0;
  const footerHeight = parseFloat(rootStyles.getPropertyValue('--footer-height')) || 0;
  const usableHeight = Math.max(viewportHeight - headerHeight - footerHeight, 360);

  const topGap = clamp(usableHeight * 0.075, 10, 30);
  const bottomGap = clamp(usableHeight * 0.11, 14, 40);

  document.documentElement.style.setProperty('--estudos-gap-top', `${topGap}px`);
  document.documentElement.style.setProperty('--estudos-gap-bottom', `${bottomGap}px`);
}

function scheduleEstudosSpacingUpdate() {
  if (estudosSpacingRaf) cancelAnimationFrame(estudosSpacingRaf);
  estudosSpacingRaf = requestAnimationFrame(() => {
    estudosSpacingRaf = null;
    applyEstudosSpacing();
  });
}

document.addEventListener('DOMContentLoaded', scheduleEstudosSpacingUpdate);
document.addEventListener('partials:loaded', scheduleEstudosSpacingUpdate);
window.addEventListener('resize', scheduleEstudosSpacingUpdate);

window.addEventListener('popstate', (event) => {
  if (event.state && event.state.url) {
    window.location.href = event.state.url;
  } else {
    window.location.reload();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const typingElement = document.querySelector('.typing');
  if (typingElement) {
    typingElement.addEventListener('animationend', (e) => {
      if (e.animationName === 'blinkCursor') {
        typingElement.classList.add('typing-complete');
      }
    });
  }

  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-load');
  }

  enhanceCodeBlocks();
});

// PARTICLE EFFECTS - Creates floating particles in the background
function createParticles() {
  const bg = document.getElementById('particles');
  if (!bg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    bg.innerHTML = '';
    return;
  }

  const existingParticles = bg.children;
  const isSmallScreen = window.matchMedia('(max-width: 600px)').matches;
  const baseCount = Math.floor(window.innerWidth / 3);
  const maxParticles = isSmallScreen ? 45 : 140;
  const particleCount = Math.max(20, Math.min(baseCount, maxParticles));

  for (let i = 0; i < particleCount; i++) {
    const particle = existingParticles[i] || document.createElement('div');
    const random = Math.random();
    let category, duration;

    if (random < 0.6) {
      category = 'particle-far';
      duration = 18;
    } else if (random < 0.85) {
      category = 'particle-medium';
      duration = 12;
    } else {
      category = 'particle-close';
      duration = 8;
    }

    particle.className = category;
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDelay = Math.random() * -duration + 's';
    particle.style.animationDuration = duration + 's';
    particle.style.setProperty('--start-y', (80 + Math.random() * 20) + 'vh');

    particle.addEventListener('animationiteration', () => {
      particle.style.left = Math.random() * 100 + 'vw';
    });

    if (!existingParticles[i]) bg.appendChild(particle);
  }

  while (bg.children.length > particleCount) {
    bg.removeChild(bg.lastChild);
  }
}

function initializeParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    container.innerHTML = '';
    return;
  }

  createParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      createParticles();
    }, 200);
  });
}

// SPARK EFFECTS - Creates particle effects on mouse click/touch
function spawnSpark(x, y) {
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'click-particle';
    const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 60;
    s.style.setProperty('--dx', Math.cos(a) * d);
    s.style.setProperty('--dy', Math.sin(a) * d);
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

function initializeSparks() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (prefersReducedMotion || isCoarsePointer) return;

  let sparkTimer = null, lastX = 0, lastY = 0;

  document.addEventListener('pointerdown', e => {
    lastX = e.clientX; lastY = e.clientY;
    spawnSpark(lastX, lastY);
    if (!sparkTimer) sparkTimer = setInterval(() => spawnSpark(lastX, lastY), 120);
  });

  document.addEventListener('pointermove', e => {
    lastX = e.clientX; lastY = e.clientY;
  });

  ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt =>
    document.addEventListener(evt, () => {
      clearInterval(sparkTimer);
      sparkTimer = null;
    })
  );
}

// Initialize effects
initializeParticles();
if (!document.body.classList.contains('glideajax-page')) {
  initializeSparks();
}

function updateScrollbarWidth() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

window.addEventListener('load', updateScrollbarWidth);
window.addEventListener('resize', updateScrollbarWidth);

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

function enhanceCodeBlocks() {
  if (!document.body.classList.contains('glideajax-page')) return;

  const wrappers = document.querySelectorAll('.glideajax-page .code-wrapper');
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    if (wrapper.dataset.enhanced === 'true') return;

    const codeElement = wrapper.querySelector('pre code');
    if (!codeElement) return;

    const rawHtml = codeElement.innerHTML.replace(/\r/g, '');
    const htmlLines = rawHtml.split('\n');
    const copyPayload = codeElement.textContent.replace(/\r/g, '');

    const formatted = htmlLines.map((line, index) => {
      const safeLine = line.length ? line : '&nbsp;';
      return `<span class="code-line"><span class="line-number">${index + 1}</span><span class="line-content">${safeLine}</span></span>`;
    }).join('');

    codeElement.innerHTML = formatted;

    const copyBtn = wrapper.querySelector('.code-copy-btn');
    if (copyBtn) {
      const label = copyBtn.querySelector('.copy-label');
      copyBtn.addEventListener('click', async () => {
        try {
          await copyToClipboard(copyPayload.trimEnd());
          copyBtn.classList.add('copied');
          if (label) label.textContent = 'Copiado!';
        } catch (error) {
          if (label) label.textContent = 'Erro ao copiar';
        }

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (label) label.textContent = 'Copiar código';
        }, 2000);
      });
    }

    wrapper.dataset.enhanced = 'true';
  });
}
