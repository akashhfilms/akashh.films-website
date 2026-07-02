const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');
const glow = document.querySelector('.cursor-glow');
const quoteForm = document.querySelector('[data-quote-form]');
const filterButtons = document.querySelectorAll('.filter');
const workCards = document.querySelectorAll('.work-card');
const revealEls = document.querySelectorAll('.reveal');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('mousemove', (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealEls.forEach((el) => revealObserver.observe(el));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    workCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.style.display = shouldShow ? 'block' : 'none';
    });
  });
});

function animateNumber(el, target) {
  const duration = 1400;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    if (target >= 1000) {
      el.textContent = `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K+`;
    } else {
      el.textContent = `${value}+`;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const statNumbers = entry.target.querySelectorAll('[data-count]');
    statNumbers.forEach((num) => animateNumber(num, Number(num.dataset.count)));
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statObserver.observe(statsGrid);

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  const name = formData.get('name');
  const project = formData.get('project');
  const date = formData.get('date') || 'Not fixed';
  const message = formData.get('message') || 'I want to discuss a shoot.';

  const subject = encodeURIComponent(`Project Enquiry - ${project}`);
  const body = encodeURIComponent(
    `Hi Akash,

My name/brand: ${name}
Project type: ${project}
Location/date: ${date}

Message:
${message}

Please share availability and package details.
`
  );

  window.location.href = `mailto:akashsamanta470@gmail.com?subject=${subject}&body=${body}`;
});
