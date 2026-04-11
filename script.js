

// ================= MENÚ HAMBURGUESA =================
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
  navMenu.classList.add('active');
  navOverlay.classList.add('active');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navMenu.classList.remove('active');
  navOverlay.classList.remove('active');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.contains('active') ? closeMenu() : openMenu();
  });
}

if (navOverlay) navOverlay.addEventListener('click', closeMenu);

// Cerrar al hacer clic en cualquier enlace
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});


// ================= SCROLL REVEAL =================
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));


// ================= NAV ACTIVO =================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top    = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) current = section.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.style.color = href === '#' + current ? 'var(--accent)' : '';
  });
});


// ================= PROGRESS BAR =================
window.addEventListener('scroll', () => {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  bar.style.width = scrolled + '%';
});


// ================= CARRUSEL HORIZONTAL =================
const track   = document.querySelector('.gallery-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track) {
  let index = 0;

  function getSlideWidth() {
    const img = track.querySelector('img');
    return img ? img.offsetWidth + 16 : 336;
  }

  function getMaxIndex() {
    const visible = Math.floor(track.parentElement.offsetWidth / getSlideWidth());
    return Math.max(0, track.children.length - visible);
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, getMaxIndex()));
    track.style.transform = 'translateX(-' + (index * getSlideWidth()) + 'px)';
  }

  let autoPlay = setInterval(() => {
    goTo(index >= getMaxIndex() ? 0 : index + 1);
  }, 3500);

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
      goTo(index >= getMaxIndex() ? 0 : index + 1);
    }, 3500);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); resetAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); resetAutoPlay(); });
  window.addEventListener('resize', () => goTo(index));
}


// ================= LIGHTBOX =================
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn    = document.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-track img').forEach(img => {
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
window.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });


// ================= CARRUSEL DE SERVICIOS (HERO) =================
(function () {
  const track    = document.getElementById('sliderTrack');
  const viewport = document.getElementById('sliderViewport');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn  = document.getElementById('sliderPrev');
  const nextBtn  = document.getElementById('sliderNext');
  const progBar  = document.getElementById('sliderProgressBar');

  if (!track || !viewport) return;

  const slides   = Array.from(track.querySelectorAll('.slide'));
  const PAUSE    = 4000;   // ms entre slides
  const GAP      = 12;     // px — debe coincidir con el gap del CSS

  let current    = 0;
  let timer      = null;
  let progTimer  = null;
  let startX     = 0;
  let isDragging = false;

  /* ── Calcular cuántos slides caben en pantalla ── */
  function visibleCount() {
    const vw = viewport.offsetWidth;
    const sw = slides[0] ? slides[0].offsetWidth + GAP : 300;
    return Math.max(1, Math.floor(vw / sw));
  }

  function maxIndex() {
    return Math.max(0, slides.length - visibleCount());
  }

  /* ── Crear dots ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  /* ── Mover el track ── */
  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const slideW = slides[0] ? slides[0].offsetWidth + GAP : 300;
    track.style.transform = 'translateX(-' + (current * slideW) + 'px)';
    updateDots();
  }

  /* ── Barra de progreso animada ── */
  function startProgress() {
    if (progBar) {
      progBar.style.transition = 'none';
      progBar.style.width = '0%';
      // Fuerza reflow para que la transición arranque desde 0
      void progBar.offsetWidth;
      progBar.style.transition = 'width ' + PAUSE + 'ms linear';
      progBar.style.width = '100%';
    }
  }

  /* ── Auto-avance ── */
  function resetTimer() {
    clearInterval(timer);
    clearTimeout(progTimer);
    startProgress();
    timer = setInterval(() => {
      goTo(current >= maxIndex() ? 0 : current + 1);
      startProgress();
    }, PAUSE);
  }

  /* ── Botones ── */
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  /* ── Swipe táctil y drag con mouse ── */
  viewport.addEventListener('mousedown',  e => { isDragging = true;  startX = e.clientX; });
  viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });

  viewport.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  });

  viewport.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  });

  /* ── Pausa al hover ── */
  viewport.addEventListener('mouseenter', () => { clearInterval(timer); if (progBar) progBar.style.animationPlayState = 'paused'; });
  viewport.addEventListener('mouseleave', () => resetTimer());

  /* ── Recalcular al cambiar tamaño ── */
  window.addEventListener('resize', () => { buildDots(); goTo(current); });

  /* ── Arrancar ── */
  buildDots();
  goTo(0);
  resetTimer();
})();
