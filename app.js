(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  const modalOverlay = $('#modal-overlay');
  const signupForm = $('#signup-form');
  const modalSuccess = $('#modal-success');
  const modalPlanText = $('#modal-plan-text');
  const submitButton = $('#modal-submit-btn');
  const planLabels = {
    starter: 'Starter plan · 14 days free · $197/month after trial',
    pro: 'Pro plan · 14 days free · $297/month after trial',
    agency: 'Agency plan · 14 days free · $597/month after trial',
  };

  let selectedPlan = 'pro';
  let lastFocusedElement = null;

  const setNavState = () => navbar?.classList.toggle('scrolled', window.scrollY > 20);
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  $$('#nav-links a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }));

  window.showMonthly = () => {
    $('#monthly-btn')?.classList.add('active');
    $('#annual-btn')?.classList.remove('active');
    $$('.price-num').forEach((price) => { price.textContent = price.dataset.monthly; });
    $$('.price-period').forEach((period) => { period.textContent = '/mo'; });
  };

  window.showAnnual = () => {
    $('#annual-btn')?.classList.add('active');
    $('#monthly-btn')?.classList.remove('active');
    $$('.price-num').forEach((price) => { price.textContent = price.dataset.annual; });
    $$('.price-period').forEach((period) => { period.textContent = '/mo'; });
  };

  window.openModal = (plan = 'pro') => {
    selectedPlan = plan;
    lastFocusedElement = document.activeElement;
    modalPlanText.textContent = planLabels[plan] || planLabels.pro;
    signupForm.style.display = 'flex';
    modalSuccess.style.display = 'none';
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => $('#first-name')?.focus(), 150);
    return false;
  };

  window.closeModal = () => {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement?.focus?.();
  };

  $$('.price-card a[href="#"], #cta-banner-btn').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay?.classList.contains('open')) window.closeModal();
  });

  window.handleSignup = (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    const profile = {
      firstName: $('#first-name').value.trim(),
      lastName: $('#last-name').value.trim(),
      businessName: $('#biz-name').value.trim(),
      email: $('#email').value.trim(),
      phone: $('#phone').value.trim(),
      industry: $('#industry').value,
      plan: selectedPlan,
      createdAt: new Date().toISOString(),
    };
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="button-spinner"></span> Activating your workspace…';
    window.setTimeout(() => {
      try { localStorage.setItem('receptai_profile', JSON.stringify(profile)); }
      catch (_) { /* The demo still works when storage is unavailable. */ }
      signupForm.style.display = 'none';
      modalSuccess.style.display = 'block';
      submitButton.disabled = false;
      submitButton.textContent = 'Activate My Free Trial →';
    }, 900);
  };

  const callTimer = $('#call-timer');
  if (callTimer) {
    let elapsedSeconds = 42;
    window.setInterval(() => {
      elapsedSeconds += 1;
      const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
      const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
      callTimer.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  const animatedElements = [...$$('.section-header'), ...$$('.feature-card'), ...$$('.step'), ...$$('.testimonial-card'), ...$$('.price-card')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animatedElements.forEach((element) => element.classList.add('fade-up'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    animatedElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
      observer.observe(element);
    });
  }
})();
