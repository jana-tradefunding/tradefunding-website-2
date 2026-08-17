(function () {
  'use strict';

  // ─── 1. Comparison Switcher ────────────────────────────────────────────────

  function initComparisonSwitcher() {
    var pills = document.querySelectorAll('.pc-compare__pill[data-alt]');
    var grid  = document.querySelector('.pc-compare__grid');

    if (!pills.length || !grid) return;

    var alternatives = (
      window.PAGE_DATA &&
      window.PAGE_DATA.comparison &&
      window.PAGE_DATA.comparison.alternatives
    ) ? window.PAGE_DATA.comparison.alternatives : [];

    function altByName(name) {
      for (var i = 0; i < alternatives.length; i++) {
        if (alternatives[i].name === name) return alternatives[i];
      }
      return null;
    }

    function applyAlt(alt) {
      if (!alt) return;

      grid.setAttribute('data-transitioning', '');

      setTimeout(function () {
        // Update named-row cells
        var rows = grid.querySelectorAll('[data-alt-row]');
        for (var i = 0; i < rows.length; i++) {
          var key = rows[i].getAttribute('data-alt-row');
          if (alt[key] !== undefined) rows[i].textContent = alt[key];
        }

        // Update name link
        var nameEl = grid.querySelector('[data-col="alt-name"]');
        var linkEl = grid.querySelector('[data-col="alt-link"]');
        if (nameEl) nameEl.textContent = alt.name;
        if (linkEl) {
          linkEl.textContent = alt.name;
          if (alt.href) linkEl.setAttribute('href', alt.href);
        }

        grid.removeAttribute('data-transitioning');
      }, 160);
    }

    function setActivePill(pill) {
      for (var i = 0; i < pills.length; i++) {
        pills[i].classList.remove('pc-compare__pill--active');
      }
      pill.classList.add('pc-compare__pill--active');
      applyAlt(altByName(pill.getAttribute('data-alt')));
    }

    for (var i = 0; i < pills.length; i++) {
      (function (p) {
        p.addEventListener('click', function () { setActivePill(p); });
      }(pills[i]));
    }

    // Auto-select first pill
    setActivePill(pills[0]);
  }

  // ─── 2. Calculator with APR / ASR Toggle ──────────────────────────────────

  function initCalculator() {
    var sliderEl   = document.getElementById('pcCalcAmount');
    var amountInput = document.getElementById('pcCalcAmountInput');
    var termEl     = document.getElementById('pcCalcTerm');
    var rateEl     = document.getElementById('pcCalcRate');
    var resultEl   = document.getElementById('pcCalcResult');
    var totalEl    = document.getElementById('pcCalcTotalRepaid');
    var interestEl = document.getElementById('pcCalcTotalInterest');

    if (!sliderEl || !termEl || !rateEl || !resultEl) return;

    var mode = 'APR';
    var toggleBtns = document.querySelectorAll('.pc-calc__rate-toggle-btn');

    function fmt(n) {
      return '$' + Math.round(n).toLocaleString('en-AU');
    }

    function fmtInput(n) {
      return Math.round(n).toLocaleString('en-AU');
    }

    function parseAmount(str) {
      var cleaned = str.replace(/[^0-9]/g, '');
      return parseInt(cleaned, 10) || 0;
    }

    function getAmount() {
      return parseFloat(sliderEl.value) || 0;
    }

    function updateSliderBg() {
      var min = parseFloat(sliderEl.min) || 0;
      var max = parseFloat(sliderEl.max) || 100;
      var val = parseFloat(sliderEl.value) || 0;
      var pct = ((val - min) / (max - min)) * 100;
      sliderEl.style.background = 'linear-gradient(to right, #54B4F6 ' + pct + '%, rgba(255,255,255,0.15) ' + pct + '%)';
    }

    function calcMonthly() {
      var P = getAmount();
      var annualRate = parseFloat(rateEl.value) || 0;
      var months = parseInt(termEl.value, 10) || 12;

      if (mode === 'APR') {
        var r = annualRate / 100 / 12;
        var n = months;
        var M;
        if (r === 0) {
          M = n > 0 ? P / n : 0;
        } else {
          M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }
        return { monthly: M, total: M * n, interest: M * n - P };
      } else {
        var R = annualRate / 100;
        var T = months / 12;
        var N = months;
        var total = P + P * R * T;
        var monthly = N > 0 ? total / N : 0;
        return { monthly: monthly, total: total, interest: total - P };
      }
    }

    function updateCalc() {
      updateSliderBg();
      var res = calcMonthly();
      resultEl.textContent = fmt(res.monthly) + '/mo';
      if (totalEl)    totalEl.textContent    = fmt(res.total);
      if (interestEl) interestEl.textContent = fmt(res.interest);
    }

    // Slider → update text input + recalc
    sliderEl.addEventListener('input', function () {
      if (amountInput) amountInput.value = fmtInput(parseFloat(sliderEl.value) || 0);
      updateCalc();
    });

    // Text input → update slider + recalc
    if (amountInput) {
      amountInput.addEventListener('input', function () {
        var val = parseAmount(amountInput.value);
        var min = parseFloat(sliderEl.min) || 0;
        var max = parseFloat(sliderEl.max) || 5000000;
        // Update slider to match (clamped to range)
        sliderEl.value = Math.min(Math.max(val, min), max);
        updateCalc();
      });

      amountInput.addEventListener('blur', function () {
        var val = parseAmount(amountInput.value);
        var min = parseFloat(sliderEl.min) || 0;
        var max = parseFloat(sliderEl.max) || 5000000;
        var clamped = Math.min(Math.max(val, min), max);
        sliderEl.value = clamped;
        amountInput.value = fmtInput(clamped);
        updateCalc();
      });
    }

    termEl.addEventListener('change', updateCalc);
    rateEl.addEventListener('input', updateCalc);

    for (var i = 0; i < toggleBtns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          mode = btn.getAttribute('data-mode') || 'APR';
          for (var j = 0; j < toggleBtns.length; j++) {
            toggleBtns[j].classList.remove('pc-calc__rate-toggle-btn--active');
          }
          btn.classList.add('pc-calc__rate-toggle-btn--active');
          updateCalc();
        });
      }(toggleBtns[i]));
    }

    for (var k = 0; k < toggleBtns.length; k++) {
      if (toggleBtns[k].getAttribute('data-mode') === mode) {
        toggleBtns[k].classList.add('pc-calc__rate-toggle-btn--active');
      }
    }

    updateCalc();
  }

  // ─── 3. Download Gate ─────────────────────────────────────────────────────

  function initDownloadGate() {
    var downloadBtn     = document.querySelector('.pc-calc__download-btn');
    var downloadForm    = document.querySelector('.pc-calc__download-form');
    var downloadSubmit  = document.querySelector('.pc-calc__download-submit');
    var downloadSuccess = document.querySelector('.pc-calc__download-success');

    if (!downloadBtn || !downloadForm) return;

    downloadBtn.addEventListener('click', function () {
      downloadBtn.style.display = 'none';
      downloadForm.classList.add('is-visible');
    });

    if (!downloadSubmit) return;

    downloadSubmit.addEventListener('click', function () {
      var emailInput = downloadForm.querySelector('input[type="email"], input[name="email"]');
      if (!emailInput) return;

      var email = emailInput.value.trim();
      if (email.indexOf('@') === -1) {
        emailInput.style.borderColor = '#FF5D5C';
        return;
      }

      // Valid email
      emailInput.style.borderColor = '';
      console.log('Download gate submission:', email);

      downloadForm.classList.remove('is-visible');
      if (downloadSuccess) {
        downloadSuccess.textContent = 'Sent to ' + email;
        downloadSuccess.classList.add('is-visible');
      }
    });
  }

  // ─── 4. FAQ Accordion ─────────────────────────────────────────────────────

  function initFaqAccordion() {
    var items = document.querySelectorAll('.pc-faq__item');
    if (!items.length) return;

    function closeItem(item) {
      var question = item.querySelector('.pc-faq__question');
      var answer   = item.querySelector('.pc-faq__answer');
      item.classList.remove('is-open');
      if (answer)   answer.style.maxHeight = null;
      if (question) question.setAttribute('aria-expanded', 'false');
    }

    function openItem(item) {
      var question = item.querySelector('.pc-faq__question');
      var answer   = item.querySelector('.pc-faq__answer');
      item.classList.add('is-open');
      if (answer)   answer.style.maxHeight = answer.scrollHeight + 'px';
      if (question) question.setAttribute('aria-expanded', 'true');
    }

    for (var i = 0; i < items.length; i++) {
      (function (item) {
        var question = item.querySelector('.pc-faq__question');
        if (!question) return;

        // Default aria state
        question.setAttribute('aria-expanded', 'false');

        question.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');

          // Close all
          for (var j = 0; j < items.length; j++) {
            closeItem(items[j]);
          }

          // Toggle clicked
          if (!isOpen) openItem(item);
        });
      }(items[i]));
    }

    // Open first by default
    openItem(items[0]);
  }

  // ─── Init ──────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initComparisonSwitcher();
    initCalculator();
    initDownloadGate();
    initFaqAccordion();
  });

}());
