// Shared HTML-escaping helper (Phase 7 §10.4 item 3) - extracted from
// connect/api/request-call.js so a fix doesn't need re-applying per
// handler.

export function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
