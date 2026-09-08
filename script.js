const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const year = document.querySelector('[data-year]');
const emberField = document.querySelector('[data-embers]');

if (year) year.textContent = new Date().getFullYear();

// Load the image and responsive extension styles without a framework or build step.
const ensureStylesheet = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  document.head.appendChild(stylesheet);
};

ensureStylesheet('gallery.css');
ensureStylesheet('mobile.css');

// Bring Roisin's own ministry photographs and devotional artwork into the page.
const aboutSection = document.querySelector('#about');
if (aboutSection) {
  const aboutSplit = aboutSection.querySelector('.split-layout');
  if (aboutSplit) {
    aboutSplit.insertAdjacentHTML('afterend', `
      <figure class="about-photo reveal">
        <img src="assets/roisin-cfr-ministry.webp" alt="Roisin with a Franciscan Friar of the Renewal" loading="lazy" decoding="async">
        <figcaption class="image-caption">Years of friendship, formation and ministry alongside the Franciscan Friars of the Renewal.</figcaption>
      </figure>
    `);
  }
}

const journeySection = document.querySelector('#journey');
if (journeySection) {
  const journeyHeading = journeySection.querySelector('.section-heading-light');
  if (journeyHeading) {
    journeyHeading.insertAdjacentHTML('afterend', `
      <figure class="journey-photo reveal">
        <img src="assets/ministry-community.webp" alt="A prayer and formation group gathered together" loading="lazy" decoding="async">
        <figcaption>Prayer, formation and community have remained at the heart of the work.</figcaption>
      </figure>
    `);
  }
}

const storiesSection = document.querySelector('#stories');
if (storiesSection && !document.querySelector('#artwork')) {
  storiesSection.insertAdjacentHTML('beforebegin', `
    <section id="artwork" class="section artwork-section" aria-labelledby="artwork-title">
      <div class="wrap">
        <div class="artwork-intro reveal">
          <div class="section-heading">
            <p class="eyebrow dark">Sacred artwork</p>
            <h2 id="artwork-title">Prayer made visible.</h2>
          </div>
          <p>Alongside ministry, Roisin has painted commissioned devotional works for people in religious life and their families. The paintings are another expression of the same desire that animates the ministry: to draw the heart toward Christ, the saints and the life of prayer.</p>
        </div>

        <div class="artwork-grid">
          <figure class="art-card featured reveal">
            <div class="art-card-image">
              <img src="assets/art-st-michael.webp" alt="Roisin's devotional painting of St Michael the Archangel" loading="lazy" decoding="async">
            </div>
            <figcaption><strong>St Michael the Archangel</strong>A commissioned prayer painting now held in a Franciscan friary in the United States.</figcaption>
          </figure>

          <figure class="art-card reveal">
            <div class="art-card-image">
              <img src="assets/art-marian.webp" alt="A Marian devotional painting by Roisin" loading="lazy" decoding="async">
            </div>
            <figcaption><strong>Marian devotional work</strong>One of Roisin's commissioned religious paintings, created for people in religious life and their families.</figcaption>
          </figure>

          <figure class="art-card reveal">
            <div class="art-card-image">
              <img src="assets/art-st-john-paul-ii.webp" alt="Roisin's devotional painting of Saint John Paul II" loading="lazy" decoding="async">
            </div>
            <figcaption><strong>St John Paul II</strong>A commissioned devotional work from Roisin's archive of religious paintings.</figcaption>
          </figure>
        </div>
        <p class="art-note reveal">Selected from Roisin's own archive of commissioned religious artwork.</p>
      </div>
    </section>
  `);

  if (nav) {
    const storiesLink = nav.querySelector('a[href="#stories"]');
    if (storiesLink) storiesLink.insertAdjacentHTML('beforebegin', '<a href="#artwork">Artwork</a>');
  }
}

const ministrySection = document.querySelector('#ministry');
if (ministrySection && !document.querySelector('.prayer-image-section')) {
  ministrySection.insertAdjacentHTML('beforebegin', `
    <section class="prayer-image-section" aria-label="Christ at the centre">
      <div class="prayer-image-grid">
        <div class="prayer-image reveal">
          <img src="assets/crucifix-prayer.webp" alt="A large wooden crucifix set among trees" loading="lazy" decoding="async">
        </div>
        <div class="prayer-image-copy reveal">
          <p class="eyebrow">The centre of the ministry</p>
          <blockquote>“Keep Christ at the centre.”</blockquote>
          <p>Prayer, mission, healing and creativity only make sense when they lead beyond themselves to Jesus.</p>
        </div>
      </div>
    </section>
  `);
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (menuToggle && nav) {
  const menuLabel = menuToggle.querySelector('.sr-only');

  const setMenuState = (open, restoreFocus = false) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuLabel) menuLabel.textContent = open ? 'Close navigation' : 'Open navigation';
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);

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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuState(false, true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuState(false);
    }
  }, { passive: true });
}

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
