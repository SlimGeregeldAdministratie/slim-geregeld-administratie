// Draait na `vite build`. De React-site is één index.html; crawlers die geen
// JavaScript draaien (de meeste AI-crawlers) zien daardoor op elke URL dezelfde
// lege pagina met dezelfde titel. Dit script schrijft per route een eigen
// HTML-bestand (dist/<route>.html, Netlify serveert /bouw vanuit bouw.html) met
// titel, omschrijving, canonical, robots, structured data en de kerntekst van
// de pagina in #root. React vervangt die inhoud zodra de app laadt.
// De gegevens staan in src/seo/paginas.json, dat de app zelf ook gebruikt.
// Blog (/blog/, /en/blog/, /ja/blog/), de auteurspagina's, de 404-pagina en de
// posts op /nieuws komen uit content/, zie scripts/blog.mjs en content/README.md.
//
// Verder, allemaal hier zodat er één bron is:
// - de statische verdragspagina's (public/en, public/daft, public/djtt) krijgen bij
//   de build de vaste Organization-, Person- en WebSite-knopen uit entiteiten.mjs;
// - dist/sitemap.xml wordt hier geschreven: alle indexeerbare React-routes uit
//   paginas.json, de verdragspagina's uit "statisch" (lastmod = dateModified en
//   hreflang = de <link rel="alternate">-regels uit hun HTML) en de blog;
// - dist/_redirects krijgt de rewrites voor de React-subroutes (/bouw/faq serveert
//   bouw.html). Er is geen catch-all meer: een onbekende URL geeft een echte 404.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { bouwBlog, nieuwsHtml, alineas, datumMooi } from './blog.mjs';
import { ORG, SITE, kyle, normaliseerGraaf } from './entiteiten.mjs';

const DIST = 'dist';
const cfg = JSON.parse(readFileSync('src/seo/paginas.json', 'utf8'));
const B = cfg.basis;
const KYLE = kyle('nl');
const sjabloon = readFileSync(join(DIST, 'index.html'), 'utf8');
const perPad = Object.fromEntries(cfg.paginas.map((p) => [p.pad, p]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (pad) => B + (pad === '/' ? '/' : pad);
// Een route krijgt een eigen bestand als hij hooguit één niveau diep is (/bouw, niet /bouw/faq).
const eigenBestand = (p) => p.pad.split('/').length <= 2;
const indexeerbaar = (p) => eigenBestand(p) && !p.noindex && !p.kopie_van && !p.canonical;
const gewijzigd = (p) => (p.nieuws && NIEUWS.length ? NIEUWS[0].datum : p.gewijzigd || cfg.gewijzigd);

function kruimels(p) {
  const lijst = [];
  for (let q = p; q; q = q.ouder ? perPad[q.ouder] : (q.pad === '/' ? null : perPad['/'])) lijst.unshift(q);
  return { '@type': 'BreadcrumbList', '@id': url(p.pad) + '#breadcrumb', itemListElement: lijst.map((q, i) => ({ '@type': 'ListItem', position: i + 1, name: q.kruimel, item: url(q.pad) })) };
}

function graaf(p) {
  const u = url(p.pad);
  const pagina = {
    '@type': p.collectie ? 'CollectionPage' : (p.over ? 'AboutPage' : 'WebPage'), '@id': u + '#webpage', url: u,
    name: p.titel, description: p.omschrijving, inLanguage: 'nl', isPartOf: { '@id': B + '/#website' },
    publisher: { '@id': B + '/#org' }, breadcrumb: { '@id': u + '#breadcrumb' }, dateModified: gewijzigd(p),
  };
  const g = [ORG, KYLE, SITE, pagina, kruimels(p)];
  if (p.over) pagina.mainEntity = { '@id': B + '/#org' };
  if (p.pakketten) {
    g.push({
      '@type': 'Service', '@id': u + '#dienst', name: 'Boekhouding voor zzp\'ers en kleine ondernemers', provider: { '@id': B + '/#org' },
      areaServed: { '@type': 'Country', name: 'Netherlands' }, availableChannel: { '@type': 'ServiceChannel', serviceUrl: u, availableLanguage: ['nl', 'en'] },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Pakketten', itemListElement: [
        { '@type': 'Offer', name: 'Alleen Slim', description: 'WhatsApp-chatbot voor ondernemers die zelf hun administratie doen', priceSpecification: { '@type': 'UnitPriceSpecification', price: '75', priceCurrency: 'EUR', unitCode: 'MON' } },
        { '@type': 'Offer', name: 'Volledige Service', description: 'Boekhouding, btw-aangifte, jaarrekening en persoonlijk contact, introductieprijs (normaal €125)', priceSpecification: { '@type': 'UnitPriceSpecification', price: '95', priceCurrency: 'EUR', unitCode: 'MON' } },
        { '@type': 'Offer', name: 'Aangifte inkomstenbelasting', description: 'Vaste prijs voor de IB-aangifte van een ondernemer', price: '235', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Maatwerk', description: 'Voor BV\'s, VOF\'s en complexe administraties, prijs op aanvraag' },
      ] },
    });
    pagina.mainEntity = { '@id': u + '#dienst' };
  }
  if (p.dienst) {
    g.push({ '@type': 'Service', '@id': u + '#dienst', name: p.dienst.naam, description: p.omschrijving, provider: { '@id': B + '/#org' },
      areaServed: { '@type': 'Country', name: 'Netherlands' }, availableChannel: { '@type': 'ServiceChannel', serviceUrl: u, availableLanguage: ['nl'] }, audience: { '@type': 'Audience', audienceType: p.dienst.doelgroep },
      ...(p.dienst.prijs ? { offers: { '@type': 'Offer', priceSpecification: { '@type': 'UnitPriceSpecification', price: p.dienst.prijs, priceCurrency: 'EUR', unitCode: 'MON' } } } : {}) });
    pagina.mainEntity = { '@id': u + '#dienst' };
  }
  if (p.app) {
    g.push({ '@type': 'WebApplication', '@id': u + '#app', name: p.app.naam, applicationCategory: p.app.categorie, operatingSystem: 'Web',
      description: p.omschrijving, url: u, inLanguage: 'nl', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, provider: { '@id': B + '/#org' } });
    pagina.mainEntity = { '@id': u + '#app' };
  }
  if (p.nieuws && NIEUWS.length) {
    pagina.mainEntity = { '@type': 'ItemList', itemListElement: NIEUWS.map((n, i) => ({ '@type': 'ListItem', position: i + 1, item: {
      '@type': 'SocialMediaPosting', headline: (n.titel || alineas(n.tekst)[0]).slice(0, 110), datePublished: n.datum, url: n.urlProfiel || n.urlPagina,
      author: { '@id': B + '/#kyle' }, publisher: { '@id': B + '/#org' }, inLanguage: n.taal || 'nl', ...(n.afbeelding ? { image: n.afbeelding } : {}) } })) };
  }
  if (p.faq) {
    g.push({ '@type': 'FAQPage', '@id': u + '#faq', inLanguage: 'nl', isPartOf: { '@id': u + '#webpage' },
      mainEntity: cfg.faq_home.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  }
  return { '@context': 'https://schema.org', '@graph': g };
}

// De kerntekst in #root: zichtbaar en gelijk aan wat de app toont, alleen kaler.
function kern(p) {
  if (!p.h1) return '';
  const delen = [`<h1>${esc(p.h1)}</h1>`];
  if (p.intro) delen.push(`<p>${esc(p.intro)}</p>`);
  if (p.punten) delen.push('<ul>' + p.punten.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>');
  if (p.faq) delen.push('<h2>Veelgestelde vragen</h2>' + cfg.faq_home.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join(''));
  if (p.nieuws) delen.push(nieuwsHtml(NIEUWS, BLOGS));
  if (p.links) delen.push('<ul>' + p.links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('') + '</ul>');
  if (indexeerbaar(p)) delen.push(`<p><small>Bijgewerkt op <time datetime="${gewijzigd(p)}">${esc(datumMooi(gewijzigd(p), 'nl'))}</time></small></p>`);
  return `<main style="max-width:44rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">${delen.join('')}</main>`;
}

function bouw(p) {
  const bron = p.kopie_van ? { ...perPad[p.kopie_van], pad: p.pad } : p;
  const canonical = url(p.canonical || p.pad);
  const robots = bron.noindex ? 'noindex, follow' : 'index, follow';
  let h = sjabloon;
  const zet = (re, naar) => { if (!re.test(h)) throw new Error('niet gevonden: ' + re + ' voor ' + p.pad); h = h.replace(re, naar); };
  zet(/<title>[^<]*<\/title>/, `<title>${esc(bron.titel)}</title>`);
  zet(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(bron.omschrijving)}" />`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):url" content=")[^"]*"/g, `$1${canonical}"`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):title" content=")[^"]*"/g, `$1${esc(bron.titel)}"`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):description" content=")[^"]*"/g, `$1${esc(bron.omschrijving)}"`);
  const kop = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${robots}" />`,
    '<meta property="og:locale" content="nl_NL" />',
    '<meta property="og:site_name" content="Slim Geregeld" />',
  ];
  if (!bron.noindex && !p.kopie_van) kop.push(`<script type="application/ld+json">${JSON.stringify(graaf(bron)).replace(/</g, '\\u003c')}</script>`);
  zet(/<\/head>/, '    ' + kop.join('\n    ') + '\n  </head>');
  if (!p.kopie_van) zet(/<div id="root"><\/div>/, `<div id="root">${kern(bron)}</div>`);
  const doel = p.pad === '/' ? join(DIST, 'index.html') : join(DIST, p.pad.slice(1) + '.html');
  mkdirSync(dirname(doel), { recursive: true });
  writeFileSync(doel, h);
}

// Statische verdragspagina's: vaste knopen vervangen, lastmod en hreflang uitlezen.
const ldBlok = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
function statisch(s) {
  const bestand = join(DIST, s.pad.slice(1), 'index.html');
  let h = readFileSync(bestand, 'utf8');
  const taal = (h.match(/<html lang="([^"]+)"/) || [])[1] || 'en';
  let dateModified = null;
  h = h.replace(ldBlok, (_, json) => {
    const g = normaliseerGraaf(JSON.parse(json), taal);
    for (const k of g['@graph'] || [g]) if (k['@id'] === url(s.pad) + '#webpage') dateModified = k.dateModified;
    return `<script type="application/ld+json">${JSON.stringify(g, null, 1).replace(/</g, '\\u003c')}</script>`;
  });
  if (!dateModified) throw new Error(`statisch: ${s.pad} heeft geen WebPage met dateModified`);
  writeFileSync(bestand, h);
  const alternates = [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  return { loc: url(s.pad), lastmod: dateModified, alternates };
}

// Eerst de blog: die gebruikt het onbewerkte sjabloon en levert de nieuwsposts voor /nieuws.
const { stukken: BLOGS, nieuws: NIEUWS, sitemap: BLOG_SITEMAP } = bouwBlog({ sjabloon, dist: DIST, B });

for (const p of cfg.paginas) if (eigenBestand(p)) bouw(p);
console.log(`seo-paginas: ${cfg.paginas.filter(eigenBestand).length} pagina's geschreven`);

// ---------- sitemap
const regels = [
  ...cfg.paginas.filter(indexeerbaar).map((p) => ({ loc: url(p.pad), lastmod: gewijzigd(p), alternates: [] })),
  ...cfg.statisch.map(statisch),
  ...BLOG_SITEMAP,
];
const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- Geschreven door scripts/seo-paginas.mjs bij elke build. Alleen indexeerbare pagina's met status 200;
     hreflang staat hier en in de HTML-head, met dezelfde set (gecontroleerd door npm run test:blog). -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${regels.map((r) => `  <url>\n    <loc>${xmlEsc(r.loc)}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n${r.alternates.map(([hl, u]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${xmlEsc(u)}"/>\n`).join('')}  </url>`).join('\n')}
</urlset>
`);
console.log(`seo-paginas: sitemap met ${regels.length} URL's`);

// ---------- _redirects: React-subroutes serveren het bestand van hun hoofdroute
const SPA_MARKER = '# SPA: subroutes (scripts/seo-paginas.mjs vult dit aan)';
const rPad = join(DIST, '_redirects');
const r = readFileSync(rPad, 'utf8');
if (!r.includes(SPA_MARKER)) throw new Error('marker ontbreekt in public/_redirects: ' + SPA_MARKER);
const subroutes = cfg.paginas.filter((p) => !eigenBestand(p)).map((p) => `${p.pad}    /${(p.kopie_van || p.canonical).slice(1)}.html    200`);
const extra = (cfg.spa_rewrites || []).map(([van, naar]) => `${van}    ${naar}    200`);
writeFileSync(rPad, r.replace(SPA_MARKER, [SPA_MARKER, ...subroutes, ...extra].join('\n')));
