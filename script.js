// ================= FORMULARIO =================
function handleSubmit(event) {
  event.preventDefault();

  const nombre   = document.getElementById('nombre');
  const telefono = document.getElementById('telefono');
  const email    = document.getElementById('email');

  if (!nombre.value.trim())          { alert('Por favor, ingrese su nombre');   return; }
  if (!telefono.value.trim())        { alert('Por favor, ingrese su teléfono'); return; }
  if (!email.value.includes('@'))    { alert('Email no válido');                return; }

  alert('¡Gracias! Te contactaremos pronto.');
  document.querySelectorAll('.form-input, .form-select, .form-textarea')
    .forEach(el => el.value = '');
}


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