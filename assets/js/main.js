// Trade Funding — shared site behaviour (vanilla JS, no framework/runtime dependency)
document.addEventListener('DOMContentLoaded', function () {

  // --- Generic accordion toggle: any [data-accordion-toggle] controls the
  // sibling [data-accordion-panel], flips aria-expanded and a chevron rotation.
  document.querySelectorAll('[data-accordion-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('[data-accordion-item]').querySelector('[data-accordion-panel]');
      var chevron = btn.querySelector('[data-chevron]');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var group = btn.getAttribute('data-accordion-toggle'); // group name, e.g. "faq" or "steps"

      if (group) {
        // Close other items in the same group (single-open accordion)
        document.querySelectorAll('[data-accordion-toggle="' + group + '"]').forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var op = other.closest('[data-accordion-item]').querySelector('[data-accordion-panel]');
            if (op) op.hidden = true;
            var oc = other.querySelector('[data-chevron]');
            if (oc) oc.style.transform = 'rotate(0deg)';
            other.closest('[data-accordion-item]').classList.remove('is-open');
          }
        });
      }

      btn.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.hidden = isOpen;
      if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      btn.closest('[data-accordion-item]').classList.toggle('is-open', !isOpen);
    });
  });

  // --- Pill selector groups (e.g. Personal & Property loan-type pills):
  // clicking a [data-pill-group] button marks it active within its group
  // and updates any [data-pill-output="GROUP"] targets from data-value.
  document.querySelectorAll('[data-pill-group]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.getAttribute('data-pill-group');
      document.querySelectorAll('[data-pill-group="' + group + '"]').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      document.dispatchEvent(new CustomEvent('tf:pill-change', { detail: { group: group, value: btn.getAttribute('data-value') } }));
    });
  });

  // --- Sliders: any input[type=range][data-slider] updates a paired
  // [data-slider-output] element with a formatted currency value, and
  // optionally a derived value via a simple formula in data-derive.
  function formatCurrency(n) { return '$' + Math.round(Number(n)).toLocaleString('en-AU'); }

  document.querySelectorAll('input[type="range"][data-slider]').forEach(function (input) {
    var outputId = input.getAttribute('data-slider-output');
    var output = outputId ? document.getElementById(outputId) : null;
    var deriveId = input.getAttribute('data-derive-output');
    var deriveFormula = input.getAttribute('data-derive-formula'); // 'repayment' | 'power'
    var deriveEl = deriveId ? document.getElementById(deriveId) : null;

    function update() {
      if (output) output.textContent = formatCurrency(input.value);
      if (deriveEl && deriveFormula === 'repayment') {
        deriveEl.textContent = formatCurrency(input.value * 0.0193);
      }
      if (deriveEl && deriveFormula === 'power') {
        deriveEl.textContent = formatCurrency(input.value * 3);
      }
    }
    input.addEventListener('input', update);
    update();
  });

  // --- Reveal on scroll ---
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-10% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Home page: channel-card hover detail reveal ---
  document.querySelectorAll('[data-hover-card]').forEach(function (card) {
    var detail = card.querySelector('[data-hover-detail]');
    if (!detail) return;
    card.addEventListener('mouseenter', function () { detail.classList.add('is-visible'); });
    card.addEventListener('mouseleave', function () { detail.classList.remove('is-visible'); });
    card.addEventListener('focus', function () { detail.classList.add('is-visible'); });
    card.addEventListener('blur', function () { detail.classList.remove('is-visible'); });
  });

  // --- Mobile nav toggle (subpages) ---
  var mobileToggle = document.querySelector('[data-mobile-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --- Personal & Property: sample-rate table swaps with loan-type pill ---
  var sampleData = {
    home: [
      { lender: 'Lender A', product: 'Full-doc • 80% LVR', rate: '6.49%' },
      { lender: 'Lender B', product: 'Alt-doc • 75% LVR', rate: '6.79%' },
      { lender: 'Lender C', product: 'Low-doc • 80% LVR', rate: '7.05%' }
    ],
    investment: [
      { lender: 'Lender A', product: 'Full-doc • 75% LVR', rate: '6.75%' },
      { lender: 'Lender B', product: 'Alt-doc • 70% LVR', rate: '7.10%' },
      { lender: 'Lender C', product: 'Low-doc • 75% LVR', rate: '7.35%' }
    ],
    commercial: [
      { lender: 'Lender A', product: 'Full-doc • 70% LVR', rate: '7.20%' },
      { lender: 'Lender B', product: 'Alt-doc • 65% LVR', rate: '7.55%' },
      { lender: 'Lender C', product: 'Low-doc • 70% LVR', rate: '7.90%' }
    ],
    construction: [
      { lender: 'Lender A', product: 'Progress draws • 80% LVR', rate: '7.05%' },
      { lender: 'Lender B', product: 'Progress draws • 75% LVR', rate: '7.40%' },
      { lender: 'Lender C', product: 'Progress draws • 70% LVR', rate: '7.75%' }
    ]
  };
  var loanTypeLabels = { home: 'home loan', investment: 'investment loan', commercial: 'commercial property loan', construction: 'construction loan' };

  document.addEventListener('tf:pill-change', function (e) {
    if (e.detail.group !== 'loan-type') return;
    var rows = sampleData[e.detail.value] || sampleData.home;
    var tbody = document.getElementById('pp-sample-rows');
    var label = document.getElementById('pp-loan-type-label');
    if (label) label.textContent = loanTypeLabels[e.detail.value] || 'home loan';
    if (tbody) {
      tbody.innerHTML = rows.map(function (r) {
        return '<div class="pp-sample-row">' +
          '<span class="pp-sample-lender">' + r.lender + '</span>' +
          '<span class="pp-sample-product">' + r.product + '</span>' +
          '<span class="pp-sample-rate">' + r.rate + '</span>' +
          '</div>';
      }).join('');
    }
  });

  // --- Connect: booking widget "This week" day selector (cosmetic only) ---
  document.querySelectorAll('[data-day-pill]').forEach(function (day) {
    day.addEventListener('click', function () {
      document.querySelectorAll('[data-day-pill]').forEach(function (d) { d.classList.remove('is-active'); });
      day.classList.add('is-active');
    });
  });

});
