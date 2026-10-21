// Draait na `vite build`. De React-site is één index.html; crawlers die geen
// JavaScript draaien (de meeste AI-crawlers) zien daardoor op elke URL dezelfde
// lege pagina met dezelfde titel. Dit script schrijft per route een eigen
// HTML-bestand (dist/<route>.html, Netlify serveert /bouw vanuit bouw.html) met
// titel, omschrijving, canonical, robots, structured data en de kerntekst van
// de pagina in #root. React vervangt die inhoud zodra de app laadt.
// De gegevens staan in src/seo/paginas.json, dat de app zelf ook gebruikt.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DIST = 'dist';
const cfg = JSON.parse(readFileSync('src/seo/paginas.json', 'utf8'));
const B = cfg.basis;
const sjabloon = readFileSync(join(DIST, 'index.html'), 'utf8');
const perPad = Object.fromEntries(cfg.paginas.map((p) => [p.pad, p]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (pad) => B + (pad === '/' ? '/' : pad);

// Dezelfde @id's als op de statische verdragspagina's, zodat alles één organisatie is.
const ORG = {
  '@type': ['AccountingService', 'ProfessionalService'], '@id': B + '/#org',
  name: 'Slim Geregeld Administratie', alternateName: 'Slim Geregeld', url: B + '/',
  logo: B + '/Slim%20Geregeld%20Administratie%20-%20Pictogram%20logo%20transparant%20500x500.png',
  image: B + '/slim-geregeld-preview.jpg', email: 'kyle@slim-geregeld.nl', telephone: '+31621311043',
  address: { '@type': 'PostalAddress', addressLocality: 'Koog aan de Zaan', addressCountry: 'NL' },
  areaServed: { '@type': 'Country', name: 'Netherlands' }, knowsLanguage: ['nl', 'en'],
  identifier: { '@type': 'PropertyValue', propertyID: 'KVK', value: '92596991' }, vatID: 'NL004963420B24',
  founder: { '@id': B + '/#kyle' }, sameAs: ['https://www.moneybird.nl/experts/slim-geregeld-administratie/'],
};
const KYLE = {
  '@type': 'Person', '@id': B + '/#kyle', name: 'Kyle Bouwmeester', jobTitle: 'Becon-geregistreerd boekhouder',
  worksFor: { '@id': B + '/#org' }, image: B + '/Pofielfoto%20Kyle.jpg', knowsLanguage: ['nl', 'en'],
  hasCredential: { '@type': 'EducationalOccupationalCredential', name: 'Becon-registratie 781794', credentialCategory: 'Registratie als belastingintermediair', recognizedBy: { '@type': 'GovernmentOrganization', name: 'Belastingdienst' } },
};
const SITE = { '@type': 'WebSite', '@id': B + '/#website', url: B + '/', name: 'Slim Geregeld', inLanguage: 'nl', publisher: { '@id': B + '/#org' } };

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
    publisher: { '@id': B + '/#org' }, breadcrumb: { '@id': u + '#breadcrumb' }, dateModified: cfg.gewijzigd,
  };
  const g = [ORG, KYLE, SITE, pagina, kruimels(p)];
  if (p.over) pagina.mainEntity = { '@id': B + '/#org' };
  if (p.pakketten) {
    g.push({
      '@type': 'Service', '@id': u + '#dienst', name: 'Boekhouding voor zzp\'ers en kleine ondernemers', provider: { '@id': B + '/#org' },
      areaServed: { '@type': 'Country', name: 'Netherlands' }, availableLanguage: ['nl', 'en'],
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
      areaServed: { '@type': 'Country', name: 'Netherlands' }, audience: { '@type': 'Audience', audienceType: p.dienst.doelgroep } });
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
  if (!bron.noindex && !p.kopie_van) kop.push(`<script type="application/ld+json">${JSON.stringify(graaf(bron))}</script>`);
  zet(/<\/head>/, '    ' + kop.join('\n    ') + '\n  </head>');
  if (!p.kopie_van) zet(/<div id="root"><\/div>/, `<div id="root">${kern(bron)}</div>`);
  const doel = p.pad === '/' ? join(DIST, 'index.html') : join(DIST, p.pad.slice(1) + '.html');
  mkdirSync(dirname(doel), { recursive: true });
  writeFileSync(doel, h);
}

// Subroutes als /bouw/faq krijgen geen eigen bestand: een map dist/bouw/ naast
// bouw.html maakt onduidelijk wat /bouw serveert. De app zet daar zelf de
// canonical naar /bouw (src/seo/SeoRoute.tsx).
for (const p of cfg.paginas) if (p.pad.split('/').length <= 2) bouw(p);
console.log(`seo-paginas: ${cfg.paginas.filter((p) => p.pad.split('/').length <= 2).length} pagina's geschreven`);
