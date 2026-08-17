(function() {
  var COOKIE_NAME = 'blc_cookie_consent';
  if (document.cookie.indexOf(COOKIE_NAME + '=accepted') !== -1 || document.cookie.indexOf(COOKIE_NAME + '=declined') !== -1) {
    return;
  }
  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML =
    '<div class="cookie-banner__inner">' +
      '<p class="cookie-banner__text">We use cookies to improve your experience and analyse site traffic. By continuing to use this site, you consent to our use of cookies. <a href="privacy.html">Privacy Policy</a></p>' +
      '<div class="cookie-banner__actions">' +
        '<button class="cookie-banner__accept" id="cookie-accept">Accept</button>' +
        '<button class="cookie-banner__decline" id="cookie-decline">Decline</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(banner);
  document.getElementById('cookie-accept').addEventListener('click', function() {
    document.cookie = COOKIE_NAME + '=accepted;path=/;max-age=31536000;SameSite=Lax';
    banner.remove();
    if (typeof loadAnalytics === 'function') loadAnalytics();
  });
  document.getElementById('cookie-decline').addEventListener('click', function() {
    document.cookie = COOKIE_NAME + '=declined;path=/;max-age=31536000;SameSite=Lax';
    banner.remove();
  });
})();
