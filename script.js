/* =========================================================
   Muhammad Rizwan — Portfolio Script
   Loads data from portfolio.json & powers all interactivity
   ========================================================= */

document.addEventListener('DOMContentLoaded', async () => {

  // ---- Load portfolio data ----
  let data;
  try {
    const res = await fetch('portfolio.json');
    data = await res.json();
  } catch (err) {
    console.error('Failed to load portfolio.json', err);
    return;
  }

  // ---- Init Lucide icons ----
  if (window.lucide) lucide.createIcons();

  // =========== TYPED TEXT EFFECT ===========
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Financial Analyst',
    'Data Analyst',
    'Power BI Developer',
    'Excel Specialist',
    'Python Enthusiast'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1800);
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  // =========== ABOUT SECTION ===========
  document.getElementById('about-summary').textContent = data.about.summary;
  const hlContainer = document.getElementById('about-highlights');
  data.about.highlights.forEach(h => {
    hlContainer.innerHTML += `
      <div class="highlight-item">
        <span class="check">✓</span>
        <span>${h}</span>
      </div>`;
  });

  // =========== EXPERIENCE TIMELINE ===========
  const timeline = document.getElementById('timeline');
  data.experience.forEach(exp => {
    const achHTML = exp.achievements.map(a => `<li>${a}</li>`).join('');
    timeline.innerHTML += `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-period">${exp.period}</div>
          <div class="timeline-role">${exp.role}</div>
          <div class="timeline-company">${exp.company}</div>
          <p class="timeline-desc">${exp.description}</p>
          <ul class="timeline-achievements">${achHTML}</ul>
        </div>
      </div>`;
  });

  // =========== SKILLS ===========
  const skillsGrid = document.getElementById('skills-grid');
  data.skills.forEach(s => {
    skillsGrid.innerHTML += `
      <div class="skill-card">
        <div class="skill-header">
          <span class="skill-name">${s.name}</span>
          <span class="skill-category">${s.category}</span>
        </div>
        <div class="skill-header">
          <span></span>
          <span class="skill-percent">${s.level}%</span>
        </div>
        <div class="skill-bar-bg">
          <div class="skill-bar" data-level="${s.level}"></div>
        </div>
      </div>`;
  });

  // =========== SERVICES ===========
  const servicesGrid = document.getElementById('services-grid');
  data.services.forEach(s => {
    servicesGrid.innerHTML += `
      <div class="service-card reveal">
        <div class="service-icon">${s.icon}</div>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-desc">${s.description}</p>
      </div>`;
  });

  // =========== PROJECTS ===========
  const filterContainer = document.getElementById('projects-filter');
  const projectsGrid    = document.getElementById('projects-grid');

  // Gather unique categories
  const categories = ['All', ...new Set(data.projects.map(p => p.category))];
  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => filterProjects(cat, btn));
    filterContainer.appendChild(btn);
  });

  function renderProjects(list) {
    projectsGrid.innerHTML = '';
    list.forEach(p => {
      const tagsHTML = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
      projectsGrid.innerHTML += `
        <div class="project-card reveal">
          <div class="project-category">${p.category}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">${tagsHTML}</div>
        </div>`;
    });
    observeReveal(); // re-observe new cards
  }

  function filterProjects(cat, activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    const filtered = cat === 'All' ? data.projects : data.projects.filter(p => p.category === cat);
    renderProjects(filtered);
  }
  renderProjects(data.projects);

  // =========== CONTACT LINKS ===========
  const contactLinks = document.getElementById('contact-links');
  const links = [
    { icon: 'linkedin', label: 'LinkedIn', value: 'Muhammad Rizwan', href: data.linkedin },
    { icon: 'github',   label: 'GitHub',   value: 'Mrizwan0007',     href: data.github }
  ];
  links.forEach(l => {
    contactLinks.innerHTML += `
      <a href="${l.href}" class="contact-link" target="_blank" rel="noopener">
        <div class="contact-link-icon"><i data-lucide="${l.icon}" style="width:20px;height:20px"></i></div>
        <div class="contact-link-text">
          <div class="label">${l.label}</div>
          <div class="value">${l.value}</div>
        </div>
      </a>`;
  });

  // Re-init icons after dynamic content
  if (window.lucide) lucide.createIcons();

  // =========== NAVBAR SCROLL ===========
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // Scroll-to-top button
    document.getElementById('scrollTopBtn').classList.toggle('visible', window.scrollY > 500);
  });

  // =========== HAMBURGER ===========
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // =========== SCROLL TO TOP ===========
  document.getElementById('scrollTopBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========== STAT COUNTER ===========
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + '+';
      }, 40);
    });
  }

  // =========== SKILL BAR ANIMATION ===========
  function animateSkillBars() {
    document.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.width = bar.dataset.level + '%';
    });
  }

  // =========== SCROLL REVEAL (Intersection Observer) ===========
  function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Trigger counters when hero stats come in view
          if (entry.target.closest && entry.target.closest('.hero')) {
            animateCounters();
          }
          // Trigger skill bars
          if (entry.target.closest && entry.target.closest('#skills')) {
            animateSkillBars();
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  observeReveal();

  // Trigger hero counter immediately if already visible
  setTimeout(animateCounters, 600);
  setTimeout(animateSkillBars, 800);
});

// =========== FORM HANDLER ===========
function handleFormSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Mailto fallback (replace with your API endpoint if desired)
  const mailtoLink = `mailto:rizwan.analyst@outlook.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  window.open(mailtoLink, '_blank');

  // Visual feedback
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = '#36d399';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2500);
  e.target.reset();
}
