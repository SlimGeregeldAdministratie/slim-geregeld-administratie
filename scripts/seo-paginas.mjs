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
import { bouwBlog, nieuwsHtml, alineas, datumMooi, ONDERWERPEN } from './blog.mjs';
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
// /nieuws/ is een map met pagina's (/nieuws/2/, /nieuws/onderwerp/<c>/), zie bouwNieuws.
const eigenBestand = (p) => p.pad.split('/').length <= 2 && !p.nieuws;
const indexeerbaar = (p) => eigenBestand(p) && !p.noindex && !p.kopie_van && !p.canonical;
const gewijzigd = (p) => p.gewijzigd || cfg.gewijzigd;

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
  if (p.links) delen.push('<ul>' + p.links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('') + '</ul>');
  if (indexeerbaar(p)) delen.push(`<p><small>Bijgewerkt op <time datetime="${gewijzigd(p)}">${esc(datumMooi(gewijzigd(p), 'nl'))}</time></small></p>`);
  return `<main style="max-width:44rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">${delen.join('')}</main>`;
}

// Vult het React-sjabloon met head en kerntekst. React vervangt de kerntekst zodra de app laadt.
function vul({ pad, titel, omschrijving, canonical, robots, kopExtra = [], ld = null, kernHtml = null }) {
  let h = sjabloon;
  const zet = (re, naar) => { if (!re.test(h)) throw new Error('niet gevonden: ' + re + ' voor ' + pad); h = h.replace(re, naar); };
  zet(/<title>[^<]*<\/title>/, `<title>${esc(titel)}</title>`);
  zet(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(omschrijving)}" />`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):url" content=")[^"]*"/g, `$1${canonical}"`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):title" content=")[^"]*"/g, `$1${esc(titel)}"`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):description" content=")[^"]*"/g, `$1${esc(omschrijving)}"`);
  const kop = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${robots}" />`,
    '<meta property="og:locale" content="nl_NL" />',
    '<meta property="og:site_name" content="Slim Geregeld" />',
    ...kopExtra,
  ];
  if (ld) kop.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  zet(/<\/head>/, '    ' + kop.join('\n    ') + '\n  </head>');
  if (kernHtml != null) zet(/<div id="root"><\/div>/, `<div id="root">${kernHtml}</div>`);
  return h;
}

function schrijf(doel, html) {
  mkdirSync(dirname(doel), { recursive: true });
  writeFileSync(doel, html);
}

function bouw(p) {
  const bron = p.kopie_van ? { ...perPad[p.kopie_van], pad: p.pad } : p;
  const h = vul({
    pad: p.pad, titel: bron.titel, omschrijving: bron.omschrijving, canonical: url(p.canonical || p.pad),
    robots: bron.noindex ? 'noindex, follow' : 'index, follow',
    ld: !bron.noindex && !p.kopie_van ? graaf(bron) : null, kernHtml: p.kopie_van ? null : kern(bron),
  });
  schrijf(p.pad === '/' ? join(DIST, 'index.html') : join(DIST, p.pad.slice(1) + '.html'), h);
}

// ---------- /nieuws/: 10 posts per pagina, nieuwste eerst, en per onderwerp een filterpagina.
// Elke pagina is een eigen bestand (dist/nieuws/index.html, dist/nieuws/2/index.html,
// dist/nieuws/onderwerp/<cluster>/index.html) met canonical naar zichzelf en rel prev/next.
// Een filterpagina met minder dan minIndex posts staat op noindex en niet in de sitemap.
// React (src/components/Nieuws.tsx) toont dezelfde lijst en voegt "Meest gelezen" toe.
function bouwNieuws(p) {
  const { perPagina, minIndex, clusters } = ONDERWERPEN;
  const lijsten = [{ basis: p.pad, items: NIEUWS, cluster: null },
    ...Object.keys(clusters).map((c) => ({ basis: `${p.pad}onderwerp/${c}/`, items: NIEUWS.filter((n) => n.cluster === c), cluster: c })).filter((l) => l.items.length)];
  const aanwezig = lijsten.filter((l) => l.cluster).map((l) => l.cluster);
  const sitemap = [];
  for (const l of lijsten) {
    const paginas = Math.max(1, Math.ceil(l.items.length / perPagina));
    const index = !l.cluster || l.items.length >= minIndex;
    const label = l.cluster ? clusters[l.cluster] : null;
    for (let n = 1; n <= paginas; n++) {
      const pad = n === 1 ? l.basis : `${l.basis}${n}/`;
      const u = url(pad);
      const deel = l.items.slice((n - 1) * perPagina, n * perPagina);
      const achter = n > 1 ? `, pagina ${n}` : '';
      const titel = label ? `${label}: nieuws en tips${achter} | Slim Geregeld` : (n === 1 ? p.titel : `Nieuws en belastingtips${achter} | Slim Geregeld`);
      const omschrijving = label
        ? `Posts van boekhouder Kyle Bouwmeester over ${label.toLowerCase()}${n > 1 ? ` (pagina ${n} van ${paginas})` : ''}: praktische tips voor ondernemers.`
        : (n === 1 ? p.omschrijving : `${p.omschrijving} Pagina ${n} van ${paginas}.`);
      const h1 = label ? `Nieuws over ${label.toLowerCase()}` : p.h1;
      const kruimelLijst = [[perPad['/'].kruimel, '/'], [perPad[p.ouder].kruimel, p.ouder], [p.kruimel, p.pad],
        ...(label ? [[label, l.basis]] : []), ...(n > 1 ? [[`Pagina ${n}`, pad]] : [])];
      const nieuwste = deel.reduce((m, x) => (x.datum > m ? x.datum : m), deel[0]?.datum || cfg.gewijzigd);
      const ld = { '@context': 'https://schema.org', '@graph': [ORG, KYLE, SITE,
        { '@type': 'CollectionPage', '@id': u + '#webpage', url: u, name: titel, description: omschrijving, inLanguage: 'nl', isPartOf: { '@id': B + '/#website' },
          publisher: { '@id': B + '/#org' }, breadcrumb: { '@id': u + '#breadcrumb' }, dateModified: nieuwste,
          mainEntity: { '@type': 'ItemList', itemListElement: deel.map((x, i) => ({ '@type': 'ListItem', position: (n - 1) * perPagina + i + 1, item: {
            '@type': 'SocialMediaPosting', headline: (x.titel || alineas(x.tekst)[0]).slice(0, 110), datePublished: x.datum, url: x.urlProfiel || x.urlPagina,
            author: { '@id': B + '/#kyle' }, publisher: { '@id': B + '/#org' }, inLanguage: x.taal || 'nl', about: clusters[x.cluster], ...(x.afbeelding ? { image: x.afbeelding } : {}) } })) } },
        { '@type': 'BreadcrumbList', '@id': u + '#breadcrumb', itemListElement: kruimelLijst.map(([naam, q], i) => ({ '@type': 'ListItem', position: i + 1, name: naam, item: url(q) })) }] };
      const vorige = n > 1 ? (n === 2 ? l.basis : `${l.basis}${n - 1}/`) : null;
      const volgende = n < paginas ? `${l.basis}${n + 1}/` : null;
      const kopExtra = [...(vorige ? [`<link rel="prev" href="${url(vorige)}" />`] : []), ...(volgende ? [`<link rel="next" href="${url(volgende)}" />`] : [])];
      const filters = `<nav aria-label="Onderwerp"><p>Onderwerp: ${[`<a href="${p.pad}">Alle onderwerpen</a>`, ...aanwezig.map((c) => `<a href="${p.pad}onderwerp/${c}/">${esc(clusters[c])}</a>`)].join(' · ')}</p></nav>`;
      const nav = paginas > 1 ? `<nav aria-label="Paginering"><p>${vorige ? `<a href="${vorige}" rel="prev">Vorige</a> · ` : ''}Pagina ${n} van ${paginas}${volgende ? ` · <a href="${volgende}" rel="next">Volgende</a>` : ''}</p></nav>` : '';
      const kernHtml = `<main style="max-width:44rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6"><h1>${esc(h1)}</h1><p>${esc(p.intro)}</p>${filters}${nieuwsHtml(deel, BLOGS)}${nav}<p><a href="/blog/">Lees ook de blog</a></p>${index ? `<p><small>Bijgewerkt op <time datetime="${nieuwste}">${esc(datumMooi(nieuwste, 'nl'))}</time></small></p>` : ''}</main>`;
      schrijf(join(DIST, pad.slice(1), 'index.html'), vul({ pad, titel, omschrijving, canonical: u, robots: index ? 'index, follow' : 'noindex, follow', kopExtra, ld, kernHtml }));
      if (index) sitemap.push({ loc: u, lastmod: nieuwste, alternates: [] });
    }
  }
  console.log(`seo-paginas: nieuws ${NIEUWS.length} posts, ${lijsten.length - 1} onderwerpen, ${sitemap.length} indexeerbare pagina's`);
  return sitemap;
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
const NIEUWS_SITEMAP = cfg.paginas.filter((p) => p.nieuws).flatMap(bouwNieuws);
console.log(`seo-paginas: ${cfg.paginas.filter(eigenBestand).length} pagina's geschreven`);

// ---------- sitemap
const regels = [
  ...cfg.paginas.filter(indexeerbaar).map((p) => ({ loc: url(p.pad), lastmod: gewijzigd(p), alternates: [] })),
  ...NIEUWS_SITEMAP,
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
const subroutes = cfg.paginas.filter((p) => !eigenBestand(p) && !p.nieuws).map((p) => `${p.pad}    /${(p.kopie_van || p.canonical).slice(1)}.html    200`);
const extra = (cfg.spa_rewrites || []).map(([van, naar]) => `${van}    ${naar}    200`);
writeFileSync(rPad, r.replace(SPA_MARKER, [SPA_MARKER, ...subroutes, ...extra].join('\n')));
