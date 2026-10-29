const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('.motion-toggle');
let paused = motionQuery.matches;
function applyMotion() {
  document.body.classList.toggle('motion-paused', paused);
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations');
  toggle.innerHTML = paused ? '<span aria-hidden="true">▷</span> Resume motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
  if (motionQuery.matches) { toggle.hidden = true; } else { toggle.hidden = false; }
  if (paused) document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-visible'));
}
toggle.addEventListener('click', () => { paused = !paused; applyMotion(); });
motionQuery.addEventListener('change', () => { paused = motionQuery.matches; applyMotion(); });
applyMotion();
if ('IntersectionObserver' in window && !motionQuery.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.section-head, .card, .social-row, .possibilities, .portrait-wrap, .creator-copy').forEach(el => {
    el.classList.add('reveal-ready'); observer.observe(el);
  });
}
const progress = document.querySelector('.reading-progress');
let scheduled = false;
function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = 'scaleX(' + (height > 0 ? Math.min(1, window.scrollY / height) : 0) + ')';
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused || motionQuery.matches) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--ry', ((event.clientX - box.left) / box.width - 0.5) * 5 + 'deg');
      card.style.setProperty('--rx', -((event.clientY - box.top) / box.height - 0.5) * 5 + 'deg');
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });
}

const mobileMenu = document.querySelector('.mobile-menu');
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.open = false; }));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobileMenu.open) { mobileMenu.open = false; mobileMenu.querySelector('summary').focus(); } });
document.addEventListener('click', event => { if (mobileMenu.open && !mobileMenu.contains(event.target)) mobileMenu.open = false; });
