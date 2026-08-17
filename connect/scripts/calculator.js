// ============================================================
// Trade Funding Connect Vendor Landing — ROI Calculator
// ============================================================

function compute({quotes, avgValue, currentConv, uplift}){
  // uplift = relative percentage lift in conversion (e.g. +10% means close rate × 1.10)
  const currentRate = currentConv / 100;
  const upliftMultiplier = 1 + (uplift / 100);
  const currentRevenue = quotes * currentRate * avgValue;
  const impactRevenue = currentRevenue * upliftMultiplier;
  const extraPerMonth = impactRevenue - currentRevenue;
  const annualUplift = extraPerMonth * 12;
  return {currentRevenue, impactRevenue, extraPerMonth, annualUplift};
}

function formatMoney(n){
  return '$' + Math.round(n).toLocaleString('en-AU');
}

function formatCompact(n){
  const v = Math.round(n);
  if(v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if(v >= 1000) return '$' + Math.round(v / 1000) + 'K';
  return '$' + v.toLocaleString('en-AU');
}

(function(){
  if(typeof document === 'undefined') return;
  const inputs = {
    quotes: document.getElementById('calc-quotes'),
    value: document.getElementById('calc-value'),
    conv: document.getElementById('calc-conv'),
    uplift: document.getElementById('calc-uplift')
  };
  if(!inputs.quotes) return;

  const labels = {
    quotes: document.getElementById('calc-quotes-val'),
    value: document.getElementById('calc-value-val'),
    conv: document.getElementById('calc-conv-val'),
    uplift: document.getElementById('calc-uplift-val')
  };
  const out = {
    currentRev: document.getElementById('calc-out-current-rev'),
    impactRev: document.getElementById('calc-out-impact-rev'),
    annual: document.getElementById('calc-out-annual'),
    narrAnnual: document.getElementById('calc-narr-annual'),
    narrExtra: document.getElementById('calc-narr-extra'),
    narrConv: document.getElementById('calc-narr-conv'),
    headlineAnnual: document.getElementById('calc-headline-annual'),
    headlineUplift: document.getElementById('calc-headline-uplift')
  };

  // Remove any legacy persisted values so refresh always returns to defaults
  try {
    sessionStorage.removeItem('tf-vl-calc-v1');
    sessionStorage.removeItem('tf-vl-calc-v2');
    sessionStorage.removeItem('tf-vl-calc-v3');
  } catch(e){}

  // Defaults — set explicitly so refresh always returns here
  const defaults = { quotes: 30, value: 20000, conv: 17, uplift: 10 };
  inputs.quotes.value = defaults.quotes;
  inputs.value.value = defaults.value;
  inputs.conv.value = defaults.conv;
  inputs.uplift.value = defaults.uplift;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tweens = new WeakMap();
  function tweenNumber(el, from, to, format, duration=400){
    if(!el) return;
    if(reduceMotion){
      el.textContent = format(to);
      return;
    }
    const existing = tweens.get(el);
    if(existing) cancelAnimationFrame(existing);
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (to - from) * eased;
      el.textContent = format(value);
      if(t < 1){
        tweens.set(el, requestAnimationFrame(frame));
      } else {
        tweens.delete(el);
      }
    }
    tweens.set(el, requestAnimationFrame(frame));
  }

  function readInputs(){
    return {
      quotes: parseInt(inputs.quotes.value, 10),
      avgValue: parseInt(inputs.value.value, 10),
      currentConv: parseInt(inputs.conv.value, 10),
      uplift: parseInt(inputs.uplift.value, 10)
    };
  }

  let lastResult = null;
  function render(){
    const vals = readInputs();
    const r = compute(vals);

    labels.quotes.textContent = vals.quotes;
    labels.value.textContent = formatMoney(vals.avgValue);
    labels.conv.textContent = `${vals.currentConv}%`;
    labels.uplift.textContent = `+${vals.uplift}%`;

    const fromCR = lastResult ? lastResult.currentRevenue : r.currentRevenue;
    const fromIR = lastResult ? lastResult.impactRevenue : r.impactRevenue;
    const fromAU = lastResult ? lastResult.annualUplift : r.annualUplift;

    tweenNumber(out.currentRev, fromCR, r.currentRevenue, formatCompact);
    tweenNumber(out.impactRev, fromIR, r.impactRevenue, formatCompact);
    tweenNumber(out.annual, fromAU, r.annualUplift, v => '~' + formatCompact(v));
    tweenNumber(out.narrAnnual, fromAU, r.annualUplift, v => '~' + formatCompact(v));
    tweenNumber(out.headlineAnnual, fromAU, r.annualUplift, v => '~' + formatCompact(v));

    if(out.narrExtra) out.narrExtra.textContent = `${vals.uplift}%`;
    if(out.narrConv) out.narrConv.textContent = `${vals.currentConv}%`;
    if(out.headlineUplift) out.headlineUplift.textContent = `${vals.uplift}%`;

    lastResult = r;
  }

  Object.values(inputs).forEach(el => el.addEventListener('input', render));
  render();
})();
