console.log("main.js loaded");
//

// Section Add, Edit, Delete Functionality for About Section

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired');
  const aboutSection = document.getElementById('about');
  if (!aboutSection) { console.error('About section not found'); return; }
  const addBtn = aboutSection.querySelector('.add-section-btn');
  const editBtn = aboutSection.querySelector('.edit-section-btn');
  const deleteBtn = aboutSection.querySelector('.delete-section-btn');
  console.log('addBtn:', !!addBtn, 'editBtn:', !!editBtn, 'deleteBtn:', !!deleteBtn);

  // Modal elements
  const modal = document.getElementById('about-modal');
  const modalTitle = document.getElementById('about-modal-title');
  const modalText = document.getElementById('about-modal-text');
  const modalSave = document.getElementById('about-modal-save');
  const modalCancel = document.getElementById('about-modal-cancel');
  if (!modal || !modalTitle || !modalText || !modalSave || !modalCancel) {
    console.error('Modal elements missing');
    return;
  }
  let modalMode = null; // 'add' or 'edit'
  let aboutContent = aboutSection.querySelector('.about-text-col');
  let intro = aboutSection.querySelector('.about-intro');

  // --- Persistence helpers ---
  const ABOUT_STORAGE_KEY = 'about-section-content';
  function saveAboutToStorage() {
    if (!aboutContent) return;
    // Save only the HTML of about-text-col
    localStorage.setItem(ABOUT_STORAGE_KEY, aboutContent.innerHTML);
  }
  function loadAboutFromStorage() {
    if (!aboutContent) return;
    const html = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (html) {
      aboutContent.innerHTML = html;
    }
  }
  // On load, restore from storage
  loadAboutFromStorage();

  function openModal(mode, initialText = '') {
    modalMode = mode;
    modal.style.display = 'flex';
    modalTitle.textContent = mode === 'add' ? 'Add About Paragraph' : 'Edit About Intro';
    modalText.value = initialText;
    setTimeout(() => modalText.focus(), 100);
  }
  function closeModal() {
    modal.style.display = 'none';
    modalText.value = '';
    modalMode = null;
  }

  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openModal('add', '');
    });
  }
  if (editBtn) {
    editBtn.addEventListener('click', function() {
      if (!aboutContent) return;
      // Remove any previous edit/delete icons
      aboutContent.querySelectorAll('.edit-inline-btn, .delete-inline-btn').forEach(btn => btn.remove());
      // For each direct child (paragraph, div, etc.), add edit and delete icons
      Array.from(aboutContent.children).forEach(function(child) {
        // Only allow editing/deleting text blocks (p, div, blockquote, etc.)
        if (['P','DIV','BLOCKQUOTE','SPAN','LI'].includes(child.tagName)) {
          // Edit icon
          const editIcon = document.createElement('button');
          editIcon.type = 'button';
          editIcon.className = 'edit-inline-btn btn secondary-btn';
          editIcon.style.marginLeft = '8px';
          editIcon.innerHTML = '<i class="fa fa-edit"></i>';
          editIcon.title = 'Edit this content';
          editIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            openModal('edit-inline', child.textContent);
            // On save, update this child
            modalSave.onclick = function() {
              const value = modalText.value.trim();
              if (!value) return;
              child.textContent = value;
              closeModal();
              // Remove all edit/delete icons after editing
              aboutContent.querySelectorAll('.edit-inline-btn, .delete-inline-btn').forEach(btn => btn.remove());
              saveAboutToStorage();
            };
          });
          child.appendChild(editIcon);
          // Delete icon
          const deleteIcon = document.createElement('button');
          deleteIcon.type = 'button';
          deleteIcon.className = 'delete-inline-btn btn secondary-btn';
          deleteIcon.style.marginLeft = '4px';
          deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
          deleteIcon.title = 'Delete this content';
          deleteIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Delete this content?')) {
              child.remove();
              saveAboutToStorage();
            }
          });
          child.appendChild(deleteIcon);
        }
      });
    });
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete the About section?')) {
        aboutSection.remove();
        localStorage.removeItem(ABOUT_STORAGE_KEY);
      }
    });
  }
  if (modalCancel) {
    modalCancel.addEventListener('click', closeModal);
  }
  if (modalSave) {
    modalSave.addEventListener('click', function() {
      const value = modalText.value.trim();
      if (!value) return;
      if (modalMode === 'add') {
        if (!aboutContent) return;
        const p = document.createElement('p');
        p.textContent = value;
        // Ensure it looks like a normal paragraph (no special class)
        aboutContent.appendChild(p);
        saveAboutToStorage();
      } else if (modalMode === 'edit') {
        if (!intro) return;
        intro.textContent = value;
        saveAboutToStorage();
      }
      closeModal();
    });
  }
  // Close modal on Escape key
  if (modal) {
    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });
  }
});

// Section Add, Edit, Delete Functionality
// main.js - 10/10 version
// Accessibility, performance, and best practices maximized

// Theme Toggle with ARIA
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const THEME_KEY = 'vamsi-theme';
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode');
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
  }
}
function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved) setTheme(saved);
  else setTheme(prefersDark ? 'dark' : 'light');
}
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  initTheme();
}

// Navbar Hamburger
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      const firstLink = navLinks.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Skip Link
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', function(e) {
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      setTimeout(() => main.removeAttribute('tabindex'), 1000);
    }
  });
}

// Contact Form with ARIA live
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
const formStatus = document.getElementById('form-status');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'Sending...';
    if (formStatus) formStatus.textContent = '';
    ['name', 'email', 'message'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.classList.remove('input-error');
      const err = document.getElementById(`${id}-error`);
      if (err) err.style.display = 'none';
    });
    let hasError = false;
    ['name', 'email', 'message'].forEach(id => {
      const input = document.getElementById(id);
      if (input && !input.value.trim()) {
        input.classList.add('input-error');
        const err = document.getElementById(`${id}-error`);
        if (err) err.style.display = 'block';
        if (!hasError) input.focus();
        hasError = true;
      }
    });
    if (hasError) {
      if (formStatus) {
        formStatus.textContent = 'Please fill all required fields.';
        formStatus.setAttribute('aria-live', 'assertive');
      }
      if (btnSpinner) btnSpinner.style.display = 'none';
      if (btnText) btnText.textContent = 'Send Message';
      return;
    }
    try {
      const data = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        if (formStatus) {
          formStatus.textContent = 'Message sent! Thank you.';
          formStatus.setAttribute('aria-live', 'polite');
        }
        contactForm.reset();
        formStatus && formStatus.focus && formStatus.focus();
      } else {
        if (formStatus) {
          formStatus.textContent = 'Error sending message. Try again.';
          formStatus.setAttribute('aria-live', 'assertive');
        }
      }
    } catch {
      if (formStatus) {
        formStatus.textContent = 'Network error. Try again.';
        formStatus.setAttribute('aria-live', 'assertive');
      }
    }
    if (btnSpinner) btnSpinner.style.display = 'none';
    if (btnText) btnText.textContent = 'Send Message';
  });
}

// Keyboard Accessibility for Project Cards
if (window.NodeList && NodeList.prototype.forEach) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const firstLink = card.querySelector('a');
        if (firstLink) firstLink.click();
      }
    });
  });
}

// Keyboard Navigation
let tabbing = false;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    tabbing = true;
    document.body.classList.add('user-is-tabbing');
  }
});
document.addEventListener('mousedown', () => {
  if (tabbing) {
    document.body.classList.remove('user-is-tabbing');
    tabbing = false;
  }
});

// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = progress + '%';
});

// Navbar Background on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Back to Top Button
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (backToTop) {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
});
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Typing Animation
const typedText = document.querySelector('.typed-text');
const cursor = document.querySelector('.cursor');
const phrases = [
  'Web Developer',
  'Machine Learning Enthusiast',
  'Data Science Student',
  'Problem Solver'
];
let phraseIndex = 0, letterIndex = 0, isDeleting = false;
function type() {
  if (!typedText) return;
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typedText.textContent = currentPhrase.substring(0, letterIndex--);
    if (letterIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, 50);
    }
  } else {
    typedText.textContent = currentPhrase.substring(0, letterIndex++);
    if (letterIndex > currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1200);
    } else {
      setTimeout(type, 100);
    }
  }
}
if (typedText) type();

// Live Clock in Footer
const footerClock = document.getElementById('footer-clock');
function updateClock() {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  if (footerClock) footerClock.textContent = `IST: ${now}`;
}
setInterval(updateClock, 1000);
updateClock();

// AOS Animation Init
window.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 800, once: true });
});

// Parallax Effect
const heroParallax = document.querySelector('.hero-parallax');
window.addEventListener('scroll', () => {
  if (heroParallax) {
    heroParallax.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }
});

// Staggered Skill Tag Animation
const skillTags = document.querySelectorAll('.skill-tags li');
skillTags.forEach((tag, i) => {
  tag.style.transitionDelay = `${i * 60}ms`;
});

// Intersection Observer for Fade-in and Stats Animation
const fadeEls = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// Stats Counter Animation with ARIA live
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  statNumbers.forEach(stat => {
    const target = +stat.getAttribute('data-count');
    let count = 0;
    function update() {
      count += Math.ceil(target / 40);
      if (count > target) count = target;
      stat.textContent = count;
      stat.setAttribute('aria-live', 'polite');
      if (count < target) requestAnimationFrame(update);
    }
    update();
  });
  statsAnimated = true;
}
const statsSection = document.getElementById('stats');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animateStats();
  }, { threshold: 0.3 });
  statsObs.observe(statsSection);
}

// Dynamic Year in Footer
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Konami Code Easter Egg
const konami = [38,38,40,40,37,39,37,39,66,65];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
  if (e.keyCode === konami[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konami.length) {
      document.getElementById('rainbow-easter-egg').classList.add('show');
      setTimeout(() => {
        document.getElementById('rainbow-easter-egg').classList.remove('show');
      }, 3000);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// Performance Monitoring
window.addEventListener('load', () => {
  const perf = window.performance.timing;
  const loadTime = (perf.loadEventEnd - perf.navigationStart) / 1000;
  console.log(`Page loaded in ${loadTime.toFixed(2)}s`);
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js', { scope: './' });
  });
}

//npm run devnpm run dev