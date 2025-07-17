function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.getElementById('blur-overlay');
  const content1 = document.getElementById('content1');
  const content2 = document.getElementById('content2');

  const isActive = menu.classList.toggle('active');
  toggle.classList.toggle('active');
  overlay.classList.toggle('active');

  if (isActive) {
    setTimeout(() => {
      if (content1) content1.style.opacity = '0';
      if (content2) content2.style.opacity = '0';
    }, 200);
  } else {
    if (content1) content1.style.opacity = '1';
    if (content2) content2.style.opacity = '1';
  }
}

document.getElementById('blur-overlay')?.addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  if (menu.classList.contains('active')) {
    toggleMenu();
  }
});

const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalOk = document.getElementById('modal-ok');

function openModal() {
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

modalClose?.addEventListener('click', closeModal);
modalOk?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

function reinitializeEffects() {
  const typingElement = document.querySelector('.typing');
  if (typingElement) {
    typingElement.classList.remove('no-cursor');
    typingElement.style.animation = 'none';
    setTimeout(() => {
      typingElement.style.animation = 'type 2s steps(9, end) 0s forwards, blinkCursor 1.2s step-end 3';
    }, 10);
    typingElement.addEventListener('animationend', (e) => {
      if (e.animationName === 'blinkCursor') {
        typingElement.classList.add('no-cursor');
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

document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    if (href && (href.includes('contato.html') || href.includes('index.html'))) {
      return;
    }
    
    e.preventDefault();
    openModal();
    if (window.matchMedia('(max-width: 768px)').matches) toggleMenu();
  });
});

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
        typingElement.classList.add('no-cursor');
      }
    });
  }

  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-load');
  }

  const isContactPage = window.location.pathname.includes('contato.html');
  if (isContactPage) {
    document.body.classList.add('contact-page-theme');
  } else {
    document.body.classList.remove('contact-page-theme');
  }
});

// PARTICLE EFFECTS - Creates floating particles in the background
function createParticles() {
  const bg = document.getElementById('particles');
  if (!bg) return;

  const existingParticles = bg.children;
  const particleCount = Math.floor(window.innerWidth / 3);

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
  if (document.getElementById('particles')) {
    createParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createParticles();
      }, 200);
    });
  }
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
initializeSparks();
