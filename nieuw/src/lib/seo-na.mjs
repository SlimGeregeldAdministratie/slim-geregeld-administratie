// SEO-nabewerking van de gebouwde site (astro.config.mjs, astro:build:done).
// Zelfde eisen als scripts/seo-check.mjs van de oude site, zodat de overstap geen
// SEO verliest. Per pagina:
//  1. interne links: slash aan het eind en meteen naar het doel van een redirect
//     (geen extra 301 voor Google);
//  2. metadata: og:image (standaardbeeld), twitter:card, og:locale:alternate en
//     hreflang x-default;
//  3. JSON-LD: vaste knopen (organisatie, Kyle, website) gelijk aan entiteiten.mjs,
//     en waar ze ontbreken: organisatie, website, WebPage en BreadcrumbList;
//  4. dateModified: uit de pagina zelf, anders de laatste commit van het bronbestand.
// Daarna _redirects (doelen met slash) en llms.txt (links naar de echte pagina's).
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { B, ORG, SITE, kyle, normaliseerGraaf } from './entiteiten.mjs';

const LOCALE = { nl: 'nl_NL', en: 'en_US', ja: 'ja_JP' };
const STANDAARDBEELD = B + '/slim-geregeld-preview.jpg';

function alleHtml(map, root = map, uit = []) {
  for (const f of readdirSync(map)) {
    const p = join(map, f);
    if (statSync(p).isDirectory()) alleHtml(p, root, uit);
    else if (f.endsWith('.html')) uit.push(relative(root, p).split(sep).join('/'));
  }
  return uit;
}
const padVan = (f) => (f === 'index.html' ? '/' : f.endsWith('/index.html') ? '/' + f.slice(0, -10) : '/' + f.slice(0, -5));

function leesRedirects(dist) {
  const m = new Map();
  const p = join(dist, '_redirects');
  if (!existsSync(p)) return m;
  for (const r of readFileSync(p, 'utf8').split('\n')) {
    const t = r.trim(); if (!t || t.startsWith('#')) continue;
    const [van, naar, status] = t.split(/\s+/);
    if (/^30[12]/.test(status || '301') && van.startsWith('/') && !van.includes('*') && !van.includes(':')) m.set(van, naar);
  }
  return m;
}

// Laatste commitdatum van een bronbestand (JJJJ-MM-DD), of null.
const gitDatum = (bestanden) => {
  for (const f of bestanden) {
    if (!existsSync(f)) continue;
    try { const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', f], { encoding: 'utf8' }).trim(); if (d) return d; } catch (e) { /* geen git */ }
  }
  return null;
};
// Breedte en hoogte van een lokale png of jpg, voor img-tags zonder afmetingen
// (voorkomt verspringen tijdens het laden, Core Web Vitals).
function afmeting(bestand) {
  try {
    const b = readFileSync(bestand);
    if (b[0] === 0x89 && b[1] === 0x50) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch (e) { /* geen bestand */ }
  return null;
}
// Diensten met prijs op de Nederlandse dienstpagina's (de verdragspagina's hebben
// hun eigen Service-knoop al). Prijzen gelijk aan wat op de pagina staat.
const per = (bedrag, eenheid) => ({ '@type': 'Offer', priceCurrency: 'EUR', price: bedrag, ...(eenheid ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: bedrag, priceCurrency: 'EUR', unitCode: eenheid, valueAddedTaxIncluded: false } } : {}), availability: 'https://schema.org/InStock' });
const DIENSTEN = {
  '/boekhouding-eenmanszaak/': { name: 'Boekhouding eenmanszaak en vof', serviceType: 'Boekhouding', description: 'Boekhouding, btw-aangiftes en jaarcijfers voor een eenmanszaak of vof in Moneybird, met Slim op WhatsApp.', offers: per(95, 'MON') },
  '/boekhouding-bv/': { name: 'Boekhouding bv en holding', serviceType: 'Boekhouding', description: 'Boekhouding, btw, DGA-loon en jaarrekening voor een bv of holding, voor een vaste prijs die vooraf is afgesproken.' },
  '/aangifte-inkomstenbelasting/': { name: 'Aangifte inkomstenbelasting', serviceType: 'Belastingaangifte', description: 'Aangifte inkomstenbelasting voor ondernemers en particulieren, ingediend door een Becon-geregistreerd boekhouder.', offers: per(245) },
  '/slim/': { name: 'Slim, boekhoudassistent op WhatsApp', serviceType: 'Boekhoudsoftware via WhatsApp', description: 'Facturen en offertes maken, bonnetjes boeken en vragen over je cijfers via WhatsApp. Eerste halfjaar gratis, daarna €9,95 per maand.', offers: per(9.95, 'MON') },
  '/en/slim/': { name: 'Slim, bookkeeping assistant on WhatsApp', serviceType: 'Bookkeeping software via WhatsApp', description: 'Create invoices and quotes, book receipts and ask about your numbers via WhatsApp. First six months free, then EUR 9.95 a month.', offers: per(9.95, 'MON') },
  '/boekhouding-bouw/': { offers: per(95, 'MON'), name: 'Boekhouding bouw en installatie', serviceType: 'Boekhouding' },
  '/boekhouding-webshop/': { offers: per(95, 'MON'), name: 'Boekhouding webshops en bol.com', serviceType: 'Boekhouding' },
  '/boekhouding-creatief/': { offers: per(95, 'MON'), name: 'Boekhouding fotografen en creatieven', serviceType: 'Boekhouding' },
  '/boekhouding-persoonlijke-diensten/': { offers: per(95, 'MON'), name: 'Boekhouding coaches, kappers en trainers', serviceType: 'Boekhouding' },
  '/boekhouding-ict/': { offers: per(95, 'MON'), name: 'Boekhouding developers en IT-consultants', serviceType: 'Boekhouding' },
};
let headDatum = null;
const vandaag = () => headDatum || (headDatum = (() => { try { return execFileSync('git', ['log', '-1', '--format=%cs'], { encoding: 'utf8' }).trim(); } catch (e) { return new Date().toISOString().slice(0, 10); } })());

export function seoNabewerking(dist) {
  const bestanden = alleHtml(dist);
  const bestaat = new Set(bestanden.map(padVan));
  const redirects = leesRedirects(dist);
  // Doel van een intern pad: volg redirects (max 3) en zet de slash erachter als
  // die pagina een map met index.html is.
  const normaal = (pad) => {
    let p = pad;
    for (let i = 0; i < 3 && redirects.has(p.replace(/#.*$/, '')); i++) {
      const [zonder, frag] = p.split('#');
      const doel = redirects.get(zonder);
      p = doel.includes('#') || !frag ? doel : doel + '#' + frag;
    }
    const [basis, rest = ''] = p.split(/(?=[#?])/);
    if (!basis.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(basis) && bestaat.has(basis + '/')) return basis + '/' + rest;
    return p;
  };
  const datums = {};
  for (const f of bestanden) {
    const pad = padVan(f);
    let html = readFileSync(join(dist, f), 'utf8');
    // 1. interne links
    html = html.replace(/(<a\b[^>]*?\shref=")(\/[^"]*)"/g, (m, a, href) => (href.startsWith('//') ? m : a + normaal(href) + '"'));
    html = html.replace(/(<link rel="alternate" hreflang="[a-z-]+" href=")https:\/\/slim-geregeld\.nl(\/[^"]*)"/g, (m, a, p) => a + B + normaal(p) + '"');
    html = html.replace(/<img\b(?![^>]*\bwidth=)([^>]*?)\ssrc="(\/[^"]+)"([^>]*)>/g, (m, a, src, c) => {
      const wh = afmeting(join(dist, decodeURIComponent(src.split(/[?#]/)[0])));
      return wh ? `<img${a} src="${src}" width="${wh[0]}" height="${wh[1]}"${c}>` : m;
    });
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
    const taal = (html.match(/<html lang="([a-z]{2})"/) || [])[1] || 'nl';
    const titel = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').trim();
    const oms = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    const extraHead = [];
    // 2. metadata
    if (!/property="og:image"/.test(html)) extraHead.push(`<meta property="og:image" content="${STANDAARDBEELD}">`);
    if (!/name="twitter:card"/.test(html)) extraHead.push('<meta name="twitter:card" content="summary_large_image">');
    const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"/g)];
    if (hreflangs.length) {
      const talen = hreflangs.map((h) => h[1]);
      if (!talen.includes('x-default')) {
        const d = hreflangs.find((h) => h[1] === 'nl') || hreflangs.find((h) => h[1] === 'en') || hreflangs[0];
        extraHead.push(`<link rel="alternate" hreflang="x-default" href="${d[2]}">`);
      }
      if (!/property="og:locale:alternate"/.test(html)) for (const t of talen) if (t !== taal && LOCALE[t]) extraHead.push(`<meta property="og:locale:alternate" content="${LOCALE[t]}">`);
    }
    // 3. JSON-LD
    const ids = new Set();
    let gewijzigd = null;
    html = html.replace(/(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (m, open, body, dicht) => {
      try {
        const j = JSON.parse(body);
        const n = Array.isArray(j) ? j.map((x) => normaliseerGraaf(x, taal)) : normaliseerGraaf(j, taal);
        const knopen = (Array.isArray(n) ? n : [n]).flatMap((x) => x['@graph'] || [x]);
        for (const k of knopen) { if (/WebPage|CollectionPage|ProfilePage|AboutPage/.test([].concat(k['@type']).join()) && !k.dateModified) k.dateModified = vandaag(); if (k['@id']) ids.add(k['@id']); if (k.dateModified && !gewijzigd) gewijzigd = String(k.dateModified).slice(0, 10); if (k['@type'] === 'BreadcrumbList') ids.add('#breadcrumb-aanwezig'); if ([].concat(k['@type']).includes('Service')) ids.add('#dienst-aanwezig'); }
        return open + JSON.stringify(n).replace(/</g, '\\u003c') + dicht;
      } catch (e) { return m; }
    });
    if (canon && !noindex) {
      if (!gewijzigd) {
        const rel = pad === '/' ? 'index' : pad.replace(/^\/|\/$/g, '');
        gewijzigd = gitDatum([`src/pages/${rel}.astro`, `src/pages/${rel}/index.astro`, `src/inhoud/${rel.split('/').pop()}.html`]) || vandaag();
      }
      const extra = [];
      if (!ids.has(ORG['@id'])) extra.push(ORG);
      if (!ids.has(SITE['@id'])) extra.push(SITE);
      if (!ids.has(B + '/#kyle')) extra.push(kyle(taal));
      if (!ids.has(canon + '#webpage')) {
        extra.push({ '@type': 'WebPage', '@id': canon + '#webpage', url: canon, name: titel.replace(/&amp;/g, '&'), description: oms.replace(/&amp;/g, '&').replace(/&quot;/g, '"'), inLanguage: taal,
          isPartOf: { '@id': SITE['@id'] }, about: { '@id': ORG['@id'] }, publisher: { '@id': ORG['@id'] }, dateModified: gewijzigd,
          ...(pad !== '/' && !ids.has('#breadcrumb-aanwezig') ? { breadcrumb: { '@id': canon + '#breadcrumb' } } : {}) });
      }
      const dienst = DIENSTEN[pad];
      if (dienst && !ids.has('#dienst-aanwezig')) {
        extra.push({ '@type': 'Service', '@id': canon + '#dienst', ...dienst, description: dienst.description || oms.replace(/&amp;/g, '&'), provider: { '@id': ORG['@id'] }, areaServed: { '@type': 'Country', name: 'Netherlands' }, inLanguage: taal,
          ...(dienst.offers ? { offers: dienst.offers } : {}), mainEntityOfPage: { '@id': canon + '#webpage' } });
      }
      if (pad !== '/' && !ids.has('#breadcrumb-aanwezig')) {
        const h1 = ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || titel.split('|')[0]).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        const home = taal === 'nl' ? B + '/' : taal === 'ja' ? B + '/djtt/ja/' : B + '/en/';
        extra.push({ '@type': 'BreadcrumbList', '@id': canon + '#breadcrumb', itemListElement: [
          { '@type': 'ListItem', position: 1, name: taal === 'ja' ? 'ホーム' : 'Home', item: home },
          { '@type': 'ListItem', position: 2, name: h1, item: canon }] });
      }
      if (extra.length) extraHead.push(`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': extra }).replace(/</g, '\\u003c')}</script>`);
      datums[canon] = gewijzigd;
    }
    if (extraHead.length) html = html.replace('</head>', extraHead.join('\n') + '\n</head>');
    writeFileSync(join(dist, f), html);
  }
  // _redirects: doelen met slash, zodat een oude URL in één stap aankomt.
  const rPad = join(dist, '_redirects');
  if (existsSync(rPad)) {
    writeFileSync(rPad, readFileSync(rPad, 'utf8').split('\n').map((r) => {
      const t = r.trim(); if (!t || t.startsWith('#')) return r;
      const d = r.split(/\s+/); if (d.length < 3 || !d[1].startsWith('/')) return r;
      const [basis, rest = ''] = d[1].split(/(?=[#?])/);
      if (!basis.endsWith('/') && !basis.includes(':') && !basis.includes('*') && bestaat.has(basis + '/')) d[1] = basis + '/' + rest;
      return d.join('    ');
    }).join('\n'));
  }
  // llms.txt: links naar de echte (indexeerbare) pagina's.
  const lPad = join(dist, 'llms.txt');
  if (existsSync(lPad)) {
    writeFileSync(lPad, readFileSync(lPad, 'utf8').replace(/\]\((https:\/\/slim-geregeld\.nl)(\/[^)\s]*)\)/g, (m, host, p) => '](' + host + normaal(p).replace(/#.*$/, '') + ')'));
  }
  return datums;
}
