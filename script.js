/* Lavendra Kumar Rajput — Portfolio interactions (no dependencies)
   Contact form: Netlify Forms by default; posts to data-endpoint (Formspree) when set, e.g. on GitHub Pages. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Frosted nav border on scroll
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const menuBtn = $('#menuBtn'), links = $('#navLinks');
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('a', links).forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }));

  // Active section in nav
  const sections = $$('main section[id]');
  const navObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObs.observe(s));

  // Reveal on scroll (staggered within a group)
  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = $$('.reveal', e.target.parentElement);
    e.target.style.transitionDelay = reduce ? '0s' : Math.min(sibs.indexOf(e.target), 5) * 70 + 'ms';
    e.target.classList.add('in'); revObs.unobserve(e.target);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revObs.observe(el));

  // Count-up numbers
  const countObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
    countObs.unobserve(el);
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 4));
      el.textContent = v.toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => countObs.observe(el));

  // Segmented control for skills
  const seg = $('#seg'), thumb = $('.seg-thumb', seg), tabs = $$('.seg-btn', seg);
  const moveThumb = btn => { thumb.style.width = btn.offsetWidth + 'px'; thumb.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop - 4}px)`; };
  const select = btn => {
    tabs.forEach(t => t.setAttribute('aria-selected', t === btn));
    $$('.skill-panel').forEach(p => { p.hidden = p.id !== 'panel-' + btn.dataset.panel; });
    moveThumb(btn);
    if (seg.scrollWidth > seg.clientWidth) btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); }
    });
  });
  const current = () => tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  addEventListener('resize', () => moveThumb(current()));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveThumb(current()));

  // Expand older roles
  $$('.job.more .toggle').forEach(b => b.addEventListener('click', () => {
    const job = b.closest('.job'), open = job.classList.toggle('open');
    b.setAttribute('aria-expanded', open);
  }));

  // Contact form (Netlify Forms, with mailto fallback)
  const form = $('#contactForm'), note = $('#formNote');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('button[type=submit]', form); btn.disabled = true;
    note.className = 'form-note'; note.textContent = 'Sending…';
    try {
      const ep = form.dataset.endpoint;
      const res = ep
        ? await fetch(ep, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        : await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!res.ok) throw new Error(res.status);
      form.reset(); note.classList.add('ok'); note.textContent = 'Thanks — your message is on its way.';
    } catch {
      const d = new FormData(form);
      note.classList.add('err');
      note.innerHTML = `Couldn’t send right now. <a href="mailto:Lavendra.rajputc1@gmail.com?subject=${encodeURIComponent('Hello from ' + (d.get('name') || 'your portfolio'))}&body=${encodeURIComponent(d.get('message') || '')}">Email me instead</a>.`;
    } finally { btn.disabled = false; }
  });

  $('#year').textContent = new Date().getFullYear();
})();
