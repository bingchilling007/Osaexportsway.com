/* ── Smooth animations for page elements ── */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Navbar scroll behaviour ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    /* Close nav when a link is clicked */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ── Intersection Observer — fade-up elements ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length > 0) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Counter animation ── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + (el.dataset.suffix || '');
      }
    }, 16);
  }
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.count, 10), 1400);
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ── Active nav link highlighting ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Contact form submission (Formspree) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      const originalHTML = btn.innerHTML;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = new FormData(contactForm);

      try {
        const response = await fetch('https://formspree.io/f/xblybpll', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          const success = document.getElementById('formSuccess');
          if (success) success.style.display = 'block';
        } else {
          const json = await response.json().catch(() => ({}));
          const msg = (json.errors || []).map(function(err){ return err.message; }).join(', ')
                      || 'Submission failed. Please try again or email us directly.';
          alert(msg);
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
