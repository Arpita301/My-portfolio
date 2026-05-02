/* ============================================================
   PORTFOLIO JAVASCRIPT — Alex Rivera
   Sections: Loader → Cursor → Nav → Theme → Hamburger →
             Typewriter → Counters → Skill Bars → Tabs →
             Filters → Scroll Animations → Resume Upload → Form
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADER
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger home section animations after load
    document.querySelectorAll('.reveal-text').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
    startCounters();
  }, 1900);
});

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Hover effect on links/buttons
document.querySelectorAll('a, button, .project-card, .cert-card, .edu-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

/* ============================================================
   3. NAVBAR SCROLL BEHAVIOR
   ============================================================ */
const navbar      = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const backToTop   = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // Shrink nav on scroll
  navbar.style.backdropFilter = scrollTop > 50 ? 'blur(30px)' : 'blur(20px)';

  // Progress bar
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';

  // Back to top
  backToTop.classList.toggle('visible', scrollTop > 500);

  // Active nav link by section
  updateActiveNav();
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const dashLinks = document.querySelectorAll('.dash-nav-item');

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
  dashLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

/* ============================================================
   4. THEME TOGGLE (Dark / Light)
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* ============================================================
   5. HAMBURGER MENU
   ============================================================ */
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
});

// Close on mobile link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
mobileOverlay.addEventListener('click', (e) => {
  if (e.target === mobileOverlay) {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   6. TYPEWRITER EFFECT
   ============================================================ */
// ✏️ CHANGE: Your roles / phrases for the typewriter
const phrases = [
  'Full-Stack Developer',
  'UI/UX Designer',
  'Open Source Contributor',
  'Problem Solver',
  'Creative Technologist',
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
const typeTarget = document.getElementById('typewriter');

function typeWrite() {
  if (!typeTarget) return;
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typeTarget.textContent = current.substring(0, charIndex--);
  } else {
    typeTarget.textContent = current.substring(0, charIndex++);
  }

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex > current.length) {
    speed = 1800; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting  = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    charIndex   = 0;
    speed = 400;
  }

  setTimeout(typeWrite, speed);
}
setTimeout(typeWrite, 2200); // Start after loader

/* ============================================================
   7. COUNTERS (animated number increment)
   ============================================================ */
function startCounters() {
  document.querySelectorAll('.counter, .stat-num[data-target]').forEach(el => {
    animateCounter(el);
  });
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1500;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

/* ============================================================
   8. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
   ============================================================ */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate skill bars inside this section
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });

      // Animate learning bars
      entry.target.querySelectorAll('.lp-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });

      // Animate counters inside this section
      entry.target.querySelectorAll('.counter, .stat-num[data-target]').forEach(el => {
        if (el.textContent === '0' || el.textContent === '') animateCounter(el);
      });
    }
  });
}, observerOptions);

document.querySelectorAll('.section, .reveal-text, .reveal-stagger').forEach(el => {
  sectionObserver.observe(el);
});

/* ============================================================
   9. SKILLS TABS
   ============================================================ */
const skillTabs = document.querySelectorAll('.skill-tab');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update tab active state
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show correct panel
    document.querySelectorAll('.skills-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById('tab-' + target);
    if (targetPanel) {
      targetPanel.classList.add('active');
      // Animate bars in newly shown panel
      targetPanel.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 50);
      });
    }
  });
});

/* ============================================================
   10. PROJECTS FILTER
   ============================================================ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      const cat = card.dataset.cat;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ============================================================
   11. RESUME UPLOAD
   ============================================================ */
const resumeUploadInput = document.getElementById('resumeUploadInput');
const resumeUploadHint  = document.getElementById('resumeUploadHint');
const resumeDownloadBtn = document.getElementById('resumeDownloadBtn');

if (resumeUploadInput) {
  resumeUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const hint = resumeUploadHint;
    hint.textContent = `✓ "${file.name}" uploaded successfully!`;

    // Update download button to use the local file
    const url = URL.createObjectURL(file);
    resumeDownloadBtn.href     = url;
    resumeDownloadBtn.download = file.name;

    // Update resume placeholder display
    const placeholder = document.querySelector('.resume-placeholder p');
    if (placeholder) placeholder.textContent = file.name;
  });
}

/* ============================================================
   12. CONTACT FORM — Web3Forms integration
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // access_key is already in the HTML hidden input — do NOT append it again
    const formData = new FormData(contactForm);

    const originalHTML    = submitBtn.innerHTML;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;

    // Hide any previous messages
    if (formSuccess) formSuccess.style.display = 'none';
    const formError = document.getElementById('formError');
    if (formError) formError.style.display = 'none';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => { formSuccess.style.display = 'none'; }, 4000);
        }
      } else {
        if (formError) {
          formError.textContent = '✗ Error: ' + data.message;
          formError.style.display = 'block';
          setTimeout(() => { formError.style.display = 'none'; }, 4000);
        } else {
          alert('Error: ' + data.message);
        }
      }
    } catch (error) {
      if (formError) {
        formError.style.display = 'block';
        setTimeout(() => { formError.style.display = 'none'; }, 4000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }
  });
}

/* ============================================================
   13. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================================ */
document.getElementById('scrollHint').addEventListener('click', () => {
  const target = document.querySelector('#about'); // change ID
  const navHeight = document.getElementById('navbar')?.offsetHeight || 72;

  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  });
});
/* ============================================================
   14. PARALLAX EFFECT (subtle on hero)
   ============================================================ */
window.addEventListener('scroll', () => {
  const homeSection = document.querySelector('.home-section');
  if (!homeSection) return;
  const scrolled  = window.scrollY;
  const homePhoto = document.querySelector('.home-photo-wrap');
  if (homePhoto) homePhoto.style.transform = `translateY(${scrolled * 0.08}px)`;
});

/* ============================================================
   15. NAVBAR ACTIVE STATE ON MOBILE (smooth close)
   ============================================================ */
document.querySelectorAll('.dash-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ============================================================
   16. PROFILE PHOTO — Tilt effect on hover
   ============================================================ */
const homePhoto = document.querySelector('.home-photo');
if (homePhoto) {
  homePhoto.addEventListener('mousemove', (e) => {
    const rect = homePhoto.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    homePhoto.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  homePhoto.addEventListener('mouseleave', () => {
    homePhoto.style.transform = 'none';
  });
}

/* ============================================================
   17. KEYBOARD NAVIGATION — Escape closes mobile menu
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   18. TOOLTIP FOR TECH ICONS (optional enhancement)
   ============================================================ */
document.querySelectorAll('.tech-icon-item').forEach(icon => {
  icon.setAttribute('title', icon.querySelector('span')?.textContent || '');
});

/* ============================================================
   19. ACTIVE SECTION SIDEBAR HIGHLIGHT ON PAGE LOAD
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();

  // Stagger dashboard cards
  document.querySelectorAll('.dash-card').forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ${0.1 + i * 0.08}s, transform 0.5s ${0.1 + i * 0.08}s`;
    setTimeout(() => {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, 2000 + i * 80);
  });
});

/* ============================================================
   20. PREVENT FOUC (Flash of unstyled content) — Body ready
   ============================================================ */
document.body.style.visibility = 'visible';

console.log('%c Portfolio loaded! ✓', 'color: #00f5c4; font-size: 14px; font-weight: bold;');
// ✏️ CHANGE: Personalize the console message
console.log('%c Built by Alex Rivera — alex@example.com', 'color: #7b5cf5; font-size: 12px;');

