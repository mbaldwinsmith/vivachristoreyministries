const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const year = document.querySelector('[data-year]');
const emberField = document.querySelector('[data-embers]');

// Dynamic footer copyright year
if (year) year.textContent = new Date().getFullYear();

// Header scroll elevation & flush scroll-padding synchronization
const updateScrollPadding = () => {
  if (!header) return;
  const isScrolled = header.classList.contains('scrolled');
  if (!isScrolled) header.classList.add('scrolled');
  const height = header.offsetHeight;
  if (!isScrolled) header.classList.remove('scrolled');
  if (height > 0) {
    // Target 1px under navbar so subpixel rendering never exposes a hairline gap
    document.documentElement.style.setProperty('--scroll-padding', `${height - 1}px`);
  }
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
};

setHeaderState();
updateScrollPadding();
window.addEventListener('scroll', setHeaderState, { passive: true });
window.addEventListener('resize', updateScrollPadding, { passive: true });

// Mobile Navigation Drawer with Focus Management
if (menuToggle && nav) {
  const menuLabel = menuToggle.querySelector('.sr-only');

  const setMenuState = (open, restoreFocus = false) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuLabel) menuLabel.textContent = open ? 'Close navigation' : 'Open navigation';
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (header) header.classList.toggle('menu-open', open);

    if (open) {
      window.requestAnimationFrame(() => nav.querySelector('a')?.focus());
    } else if (restoreFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    setMenuState(open);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  // Close when clicking directly on the nav overlay background
  nav.addEventListener('click', (event) => {
    if (event.target === nav) {
      setMenuState(false, true);
    }
  });

  // Accessible keyboard trap and Escape key handling
  document.addEventListener('keydown', (event) => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;

    if (event.key === 'Escape') {
      setMenuState(false, true);
      return;
    }

    if (event.key === 'Tab') {
      const focusable = [menuToggle, ...nav.querySelectorAll('a')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuState(false);
    }
  }, { passive: true });
}

// Sacred Artwork Modal Lightbox
const lightbox = document.querySelector('#artwork-lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('#lightbox-img');
  const lightboxTitle = lightbox.querySelector('#lightbox-title');
  const lightboxDesc = lightbox.querySelector('#lightbox-desc');
  const closeBtn = lightbox.querySelector('[data-lightbox-close]');
  let lastFocusedElement = null;

  const artworkTriggers = document.querySelectorAll('[data-artwork-trigger]');

  artworkTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      lastFocusedElement = btn;
      const title = btn.getAttribute('data-title') || '';
      const desc = btn.getAttribute('data-desc') || '';
      const img = btn.getAttribute('data-img') || '';
      const alt = btn.getAttribute('data-alt') || title;

      if (lightboxImg) {
        lightboxImg.src = img;
        lightboxImg.alt = alt;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
      closeBtn?.focus();
    });
  });

  const closeLightbox = () => {
    if (typeof lightbox.close === 'function') {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
    }
    lastFocusedElement?.focus();
  };

  closeBtn?.addEventListener('click', closeLightbox);

  // Close when clicking outside on dialog backdrop
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener('close', () => {
    lastFocusedElement?.focus();
  });
}

// Ember particle animation
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && emberField) {
  const count = Math.min(24, Math.max(12, Math.round(window.innerWidth / 70)));
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const ember = document.createElement('span');
    ember.className = 'ember';
    ember.style.left = `${Math.random() * 100}%`;
    ember.style.bottom = `${Math.random() * 28}%`;
    ember.style.animationDuration = `${7 + Math.random() * 10}s`;
    ember.style.animationDelay = `${Math.random() * -12}s`;
    ember.style.setProperty('--drift', `${-35 + Math.random() * 70}px`);
    const size = 1 + Math.random() * 2.5;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    fragment.appendChild(ember);
  }

  emberField.appendChild(fragment);
}

// Scroll reveal animations
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}
