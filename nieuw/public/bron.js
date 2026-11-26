/*
 * Bron van een bezoeker, bewaard over bezoeken heen (90 dagen), zodat een
 * aanvraag of vraag in de sheet laat zien waar iemand vandaan kwam.
 *
 * - ?via=<naam> (partnerlink of advertentie, bijvoorbeeld ads-us) overschrijft altijd.
 * - Een gclid zonder via wordt 'ads'.
 * - Anders een verwijzing ('ref-google', 'ref-chatgpt', 'ref-linkedin', ...),
 *   uit de referrer of utm_source, alleen als er nog niets bewaard staat.
 * - Alleen een label en de landingspagina, geen ID. De gclid (advertentie-ID)
 *   wordt alleen bewaard als de bezoeker cookies heeft geaccepteerd.
 * - window.sgBron() geeft { via, landing, gclid } terug (of {}).
 */
(function () {
  var SLEUTEL = 'sg_bron';
  var GELDIG_MS = 90 * 24 * 60 * 60 * 1000;

  function toestemming() {
    try { var k = JSON.parse(localStorage.getItem('sg_consent') || 'null'); return !!(k && k.v === 'ja'); } catch (e) { return false; }
  }
  function lees() {
    try {
      var b = JSON.parse(localStorage.getItem(SLEUTEL) || 'null');
      if (b && b.t && Date.now() - b.t < GELDIG_MS && b.via) return b;
    } catch (e) {}
    try { var s = sessionStorage.getItem('sg_via'); if (s) return { via: s }; } catch (e) {}
    return null;
  }
  function bewaar(b) {
    b.t = Date.now();
    try { localStorage.setItem(SLEUTEL, JSON.stringify(b)); } catch (e) {}
    try { sessionStorage.setItem('sg_via', b.via); } catch (e) {}
  }
  function label(bron) {
    var h = String(bron || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (!h) return '';
    var vast = [
      [/chatgpt|openai/, 'chatgpt'], [/perplexity/, 'perplexity'], [/claude\.ai|anthropic/, 'claude'],
      [/gemini\.google/, 'gemini'], [/copilot/, 'copilot'], [/(^|\.)google\./, 'google'], [/bing\./, 'bing'],
      [/duckduckgo/, 'duckduckgo'], [/linkedin|lnkd\.in/, 'linkedin'], [/reddit/, 'reddit'],
      [/facebook|fb\.com|fb\.me/, 'facebook'], [/instagram/, 'instagram']
    ];
    for (var i = 0; i < vast.length; i++) if (vast[i][0].test(h)) return 'ref-' + vast[i][1];
    var naam = h.split('.').filter(function (x) { return x.length > 2 || h.split('.').length < 3; })[0] || h;
    return 'ref-' + naam.replace(/[^a-z0-9-]/g, '').slice(0, 26);
  }

  var oud = lees();
  try {
    var p = new URLSearchParams(location.search);
    var via = (p.get('via') || '').toLowerCase();
    var gclid = p.get('gclid') || p.get('gbraid') || p.get('wbraid') || '';
    var nieuw = null;
    if (/^[a-z0-9-]{2,30}$/.test(via)) nieuw = { via: via };
    else if (gclid) nieuw = { via: 'ads' };
    else if (p.get('utm_source')) nieuw = { via: label(p.get('utm_source')) };
    else if (document.referrer) {
      var r = new URL(document.referrer);
      if (r.hostname !== location.hostname) nieuw = { via: label(r.hostname) };
    }
    if (nieuw && nieuw.via && (nieuw.via.indexOf('ref-') !== 0 || !oud)) {
      nieuw.landing = location.pathname;
      if (gclid && toestemming()) nieuw.gclid = gclid.slice(0, 200);
      bewaar(nieuw);
      oud = nieuw;
    }
  } catch (e) {}

  window.sgBron = function () {
    var b = oud || {};
    return { via: b.via || '', landing: b.landing || '', gclid: b.gclid || '' };
  };
  // Een partner is een via die geen advertentie of verwijzing is.
  window.sgBronPartner = function () {
    var v = window.sgBron().via;
    return v && !/^(ads|ref-)/.test(v) ? v : '';
  };
})();
