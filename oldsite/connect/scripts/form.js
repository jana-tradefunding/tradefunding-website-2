// ============================================================
// Trade Funding Connect Vendor Landing — Request-a-call form
// Posts to /api/request-call → Resend email + Slack notification
// ============================================================
(function(){
  'use strict';

  const form = document.getElementById('request-call-form');
  if(!form) return;

  const successEl = document.getElementById('conv-form-success');
  const submitBtn = form.querySelector('.conv-form__submit');

  const FORM_ENDPOINT = '/api/request-call';
  const TOKEN_ENDPOINT = '/api/form-token';

  // Cloudflare Turnstile response token, read from the widget rendered in the
  // form (security-audit-report.md Finding 3 / plan.md 8.5). Sent as-is to
  // both /api/form-token and /api/request-call per their existing server-side
  // checks (_lib/turnstile.js) — both endpoints verify it independently, so
  // if Cloudflare ever rejects it as already-consumed on the second call,
  // that's the thing to check first during the 8.11 live-deploy pass.
  function getTurnstileToken(){
    return (window.turnstile && typeof window.turnstile.getResponse === 'function')
      ? (window.turnstile.getResponse() || '')
      : '';
  }

  let formToken = null;
  let tokenFetchPromise = null;
  function fetchFormToken(turnstileToken){
    if(formToken) return Promise.resolve(formToken);
    if(tokenFetchPromise) return tokenFetchPromise;
    const query = new URLSearchParams({ turnstile_token: turnstileToken || getTurnstileToken() });
    tokenFetchPromise = fetch(`${TOKEN_ENDPOINT}?${query}`, { credentials: 'same-origin' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('token_fetch_failed')))
      .then(data => {
        formToken = data.token;
        tokenFetchPromise = null;
        return formToken;
      })
      .catch(err => {
        tokenFetchPromise = null;
        throw err;
      });
    return tokenFetchPromise;
  }

  // Pre-fetch token on page load so it's ready when the user submits.
  // The token also enforces a minimum 3s age — fetching early helps real users
  // (who'll spend longer than 3s filling the form) and blocks instant-submit bots.
  fetchFormToken().catch(() => { /* surfaced at submit time */ });

  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your full name',
    business: v => v.trim().length >= 2 || 'Please enter your business name',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email',
    phone: v => /^[\d\s+()\-]{8,}$/.test(v.trim()) || 'Please enter a valid phone number',
    sell: v => v.trim().length >= 2 || 'Tell us briefly what you sell'
  };

  function setError(fieldName, message){
    const field = form.querySelector(`[name="${fieldName}"]`);
    if(!field) return;
    const wrap = field.closest('.conv-field');
    const err = form.querySelector(`.conv-field__error[data-for="${field.id}"]`);
    if(message){
      wrap.classList.add('is-error');
      if(err) err.textContent = message;
      field.setAttribute('aria-invalid','true');
    } else {
      wrap.classList.remove('is-error');
      if(err) err.textContent = '';
      field.removeAttribute('aria-invalid');
    }
  }

  function validateField(name){
    const field = form.querySelector(`[name="${name}"]`);
    if(!field) return true;
    const result = validators[name](field.value);
    if(result === true){
      setError(name, null);
      return true;
    }
    setError(name, result);
    return false;
  }

  function validateAll(){
    let ok = true;
    Object.keys(validators).forEach(name => {
      if(!validateField(name)) ok = false;
    });
    return ok;
  }

  Object.keys(validators).forEach(name => {
    const field = form.querySelector(`[name="${name}"]`);
    if(!field) return;
    field.addEventListener('input', () => {
      if(field.closest('.conv-field').classList.contains('is-error')){
        validateField(name);
      }
    });
    field.addEventListener('blur', () => validateField(name));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!validateAll()){
      const firstError = form.querySelector('.conv-field.is-error input, .conv-field.is-error select, .conv-field.is-error textarea');
      if(firstError) firstError.focus();
      return;
    }

    const turnstileToken = getTurnstileToken();
    if(!turnstileToken){
      alert('Please complete the verification challenge before submitting.');
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    let token;
    try {
      token = await fetchFormToken(turnstileToken);
    } catch(err){
      console.error('Token fetch failed', err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      alert('Sorry — something went wrong. Please email support@tradefunding.com.au directly.');
      return;
    }

    const payload = {
      name: form.querySelector('#rc-name').value.trim(),
      business: form.querySelector('#rc-business').value.trim(),
      email: form.querySelector('#rc-email').value.trim(),
      phone: form.querySelector('#rc-phone').value.trim(),
      sell: form.querySelector('#rc-sell').value.trim(),
      volume: form.querySelector('#rc-volume') ? form.querySelector('#rc-volume').value : '',
      message: form.querySelector('#rc-message').value.trim(),
      hp_token: form.querySelector('#rc-hp-token') ? form.querySelector('#rc-hp-token').value : '',
      form_token: token,
      turnstile_token: turnstileToken
    };

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      form.hidden = true;
      successEl.hidden = false;
      successEl.scrollIntoView({behavior: 'smooth', block: 'center'});
    } catch(err){
      console.error('Form submit failed', err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      alert('Sorry — something went wrong. Please email support@tradefunding.com.au directly.');
    }
  });
})();
