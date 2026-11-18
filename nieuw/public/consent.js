/*
 * Eigen cookiebanner met Google Consent Mode v2. Vervangt CookieScript.
 *
 * - Laadt synchroon in <head>, VOOR de GTM-snippet, zodat de standaard
 *   (alles geweigerd behalve noodzakelijk) al staat voordat er een tag vuurt.
 * - Taal volgt <html lang>: nl, en of ja.
 * - Keuze in localStorage ('sg_consent'), twaalf maanden geldig.
 * - Na een keuze: gtag('consent','update') plus dataLayer-event
 *   'sg_consent_update' met analytics en marketing ('granted'/'denied'),
 *   zodat GTM tags zonder ingebouwde consent-check (Dealfront) erop kan laten wachten.
 * - window.sgCookieInstellingen() opent de banner opnieuw (footerlink).
 * - Weigeren is net zo zichtbaar als accepteren (eis van de AP).
 */
(function () {
  var SLEUTEL = 'sg_consent';
  var GELDIG_MS = 365 * 24 * 60 * 60 * 1000;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function lees() {
    try {
      var k = JSON.parse(localStorage.getItem(SLEUTEL) || 'null');
      if (k && k.t && Date.now() - k.t < GELDIG_MS && (k.v === 'ja' || k.v === 'nee')) return k.v;
    } catch (e) {}
    return null;
  }
  function bewaar(v) {
    try { localStorage.setItem(SLEUTEL, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }
  function pasToe(v, bron) {
    var s = v === 'ja' ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: s,
      ad_storage: s,
      ad_user_data: s,
      ad_personalization: s,
      personalization_storage: s
    });
    window.dataLayer.push({ event: 'sg_consent_update', analytics: s, marketing: s, bron: bron });
  }

  var keuze = lees();
  if (keuze) pasToe(keuze, 'opgeslagen');

  var lang = (document.documentElement.getAttribute('lang') || 'nl').slice(0, 2).toLowerCase();
  var T = {
    nl: {
      titel: 'Mogen we cookies gebruiken?',
      tekst: 'We gebruiken analytische en marketingcookies om te zien hoe bezoekers de site gebruiken. Alleen als je daarmee akkoord gaat.',
      link: 'Privacybeleid', nee: 'Weigeren', ja: 'Accepteren', label: 'Cookiekeuze'
    },
    en: {
      titel: 'May we use cookies?',
      tekst: 'We use analytics and marketing cookies to see how visitors use this site. Only if you agree.',
      link: 'Privacy policy (in Dutch)', nee: 'Decline', ja: 'Accept', label: 'Cookie choice'
    },
    ja: {
      titel: 'Cookieの使用について',
      tekst: 'このサイトでは、訪問者の利用状況を把握するために分析用およびマーケティング用のCookieを使用します。同意いただいた場合のみ使用します。',
      link: 'プライバシーポリシー（オランダ語）', nee: '拒否する', ja: '同意する', label: 'Cookieの選択'
    }
  }[lang] || null;
  if (!T) T = { titel: 'May we use cookies?', tekst: 'We use analytics and marketing cookies to see how visitors use this site. Only if you agree.', link: 'Privacy policy (in Dutch)', nee: 'Decline', ja: 'Accept', label: 'Cookie choice' };

  var CSS =
    '#sg-consent{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:420px;' +
    'background:#fff;color:#0b1220;border:1px solid #e2e8f0;border-radius:14px;' +
    'box-shadow:0 12px 32px rgba(15,23,42,.18);padding:18px 18px 16px;' +
    'font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
    'font-size:15px;line-height:1.5;-webkit-text-size-adjust:100%}' +
    '#sg-consent h2{margin:0 0 6px;font-size:16px;font-weight:700;letter-spacing:-.01em;color:#0b1220}' +
    '#sg-consent p{margin:0 0 14px;color:#334155}' +
    '#sg-consent a{color:#1d4ed8;text-decoration:underline;text-underline-offset:2px}' +
    '#sg-consent .sg-knoppen{display:flex;gap:10px}' +
    '#sg-consent button{flex:1;min-height:44px;border-radius:10px;font:inherit;font-weight:650;cursor:pointer;' +
    'border:1.5px solid #2563eb;padding:10px 14px}' +
    '#sg-consent .sg-nee{background:#fff;color:#1d4ed8}' +
    '#sg-consent .sg-ja{background:#2563eb;color:#fff}' +
    '#sg-consent button:focus-visible{outline:3px solid #93c5fd;outline-offset:2px}' +
    '@media (min-width:640px){#sg-consent{right:auto;left:24px;bottom:24px}}';

  function toon() {
    if (document.getElementById('sg-consent')) return;
    if (!document.getElementById('sg-consent-css')) {
      var st = document.createElement('style');
      st.id = 'sg-consent-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    var d = document.createElement('div');
    d.id = 'sg-consent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', T.label);
    d.setAttribute('aria-live', 'polite');
    d.innerHTML =
      '<h2>' + T.titel + '</h2>' +
      '<p>' + T.tekst + ' <a href="/privacybeleid"' + (lang === 'nl' ? '' : ' hreflang="nl"') + '>' + T.link + '</a></p>' +
      '<div class="sg-knoppen"><button type="button" class="sg-nee">' + T.nee + '</button>' +
      '<button type="button" class="sg-ja">' + T.ja + '</button></div>';
    d.querySelector('.sg-nee').addEventListener('click', function () { kies('nee'); });
    d.querySelector('.sg-ja').addEventListener('click', function () { kies('ja'); });
    document.body.appendChild(d);
  }
  function kies(v) {
    bewaar(v);
    pasToe(v, 'banner');
    var d = document.getElementById('sg-consent');
    if (d) d.parentNode.removeChild(d);
  }

  window.sgCookieInstellingen = function () { toon(); };

  if (!keuze) {
    if (document.body) toon();
    else document.addEventListener('DOMContentLoaded', toon);
  }
})();
