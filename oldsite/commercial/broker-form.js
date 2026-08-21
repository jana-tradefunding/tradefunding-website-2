// ============================================================
// Trade Funding Commercial — Broker Portal "Partner with us" form
// Posts to /api/broker-lead → Resend email + Slack notification.
// Mirrors connect/scripts/form.js's anti-abuse flow (plan.md 8.5) — same
// honeypot + signed form token + Turnstile pattern, since /api/broker-lead
// reuses the exact same server-side checks (_lib/turnstile.js,
// _lib/form-token.js) as /api/request-call.
// ============================================================
(function(){
  'use strict';

  const form = document.querySelector('.bp-form');
  if(!form) return;

  const successEl = document.getElementById('bp-form-success');
  const submitBtn = form.querySelector('.bp-form__submit');

  const FORM_ENDPOINT = '/api/broker-lead';
  const TOKEN_ENDPOINT = '/api/form-token';

  // Cloudflare Turnstile response token, read from the widget rendered in
  // this form. Sent as-is to both /api/form-token and /api/broker-lead per
  // their existing server-side checks (_lib/turnstile.js) — both endpoints
  // verify it independently, so if Cloudflare ever rejects it as
  // already-consumed on the second call, that's the thing to check first
  // during the 8.11 live-deploy pass (same open question flagged in
  // connect/scripts/form.js).
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

  // Pre-fetch on page load, same rationale as connect/scripts/form.js: the
  // token also enforces a minimum 3s age, so fetching early helps real users
  // and blocks instant-submit bots.
  fetchFormToken().catch(() => { /* surfaced at submit time */ });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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
      name: form.querySelector('#bp-name').value.trim(),
      business: form.querySelector('#bp-business').value.trim(),
      email: form.querySelector('#bp-email').value.trim(),
      phone: form.querySelector('#bp-phone').value.trim(),
      hp_token: form.querySelector('#bp-hp-token') ? form.querySelector('#bp-hp-token').value : '',
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
