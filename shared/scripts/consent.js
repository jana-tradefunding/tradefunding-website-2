// Shared cookie-consent bar — one implementation, one cookie key, used by
// every channel (Phase 7 §10.4 item 4, architecture-review-report.md
// §2.2). Replaces two incompatible implementations:
//   - connect/scripts/main.js:      localStorage key tf-connect-cookie-consent
//   - commercial/cookie-consent.js: document.cookie key blc_cookie_consent
//     (legacy internal codename, retired along with the file itself)
// Cookie-based per the report's recommendation — server-readable if
// Phase 8's Next.js middleware ever needs it. One key means accepting on
// one channel is respected on the others, instead of re-prompting every
// time the ChannelSwitcher is used (CLAUDE.md rule 13).
//
// Builds its own markup at runtime rather than depending on static
// per-page HTML — connect/scripts/main.js's old #cookie-bar dependency
// had only been propagated to 3 of Connect's 8 pages; this can't have
// that problem since there's no per-page markup to forget.

(function () {
  'use strict';

  var COOKIE_NAME = 'tf_cookie_consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, seconds

  function readCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Share the cookie across every tradefunding.com.au subdomain (www,
  // connect, and eventually personal-and-property) - that cross-channel
  // sharing is the entire point of this consolidation
  // (architecture-review-report.md §2.2). Omit the domain attribute
  // outside that domain (localhost, Vercel preview URLs) since a
  // mismatched `domain=` value makes browsers silently refuse to set
  // the cookie at all rather than just ignoring the attribute.
  function cookieDomainAttr() {
    return /(^|\.)tradefunding\.com\.au$/.test(location.hostname) ? ';domain=.tradefunding.com.au' : '';
  }

  function writeCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;max-age=' + COOKIE_MAX_AGE + cookieDomainAttr() + ';SameSite=Lax';
  }

  // Link to the current channel's own privacy page; falls back to
  // Commercial's as the site's main one for anything else.
  function privacyHref() {
    if (location.pathname.indexOf('/connect/') === 0) return '/connect/privacy.html';
    if (location.pathname.indexOf('/personal-and-property/') === 0) return '/personal-and-property/privacy.html';
    return '/commercial/privacy.html';
  }

  if (readCookie(COOKIE_NAME)) return;

  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.setAttribute('aria-live', 'polite');
  bar.innerHTML =
    '<div class="cookie-bar__inner">' +
      '<div class="cookie-bar__text">' +
        '<strong>We use cookies to keep the site working and improve it.</strong>' +
        '<span>Essential cookies are always on. Analytics cookies (when accepted) help us understand how the site is used. See our <a href="' + privacyHref() + '">Privacy Policy</a>.</span>' +
      '</div>' +
      '<div class="cookie-bar__actions">' +
        '<button type="button" class="cookie-bar__btn cookie-bar__btn--ghost" data-cookie-action="essential">Essential only</button>' +
        '<button type="button" class="cookie-bar__btn cookie-bar__btn--primary" data-cookie-action="accept">Accept all</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(bar);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { bar.classList.add('is-visible'); });
  });

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cookie-action]');
    if (!btn) return;
    var choice = btn.dataset.cookieAction;
    writeCookie(COOKIE_NAME, choice);
    bar.classList.remove('is-visible');
    setTimeout(function () { bar.remove(); }, 350);
    document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { choice: choice } }));
    if (choice === 'accept' && typeof window.loadAnalytics === 'function') {
      window.loadAnalytics();
    }
  });
})();
