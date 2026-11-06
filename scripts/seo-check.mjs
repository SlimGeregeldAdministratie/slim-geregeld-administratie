// Technische SEO-controle op de gebouwde site (dist/), zonder netwerk.
// Gebruikt door npm run test:blog (op de testinhoud) en los via npm run seo:check
// (op de echte build). Controleert per pagina: canonical, robots, title en
// description, Open Graph, één H1, hreflang (wederkerig, zelfverwijzend,
// x-default, alleen naar indexeerbare pagina's), JSON-LD (parse, @id-verwijzingen,
// verplichte velden, FAQ zichtbaar), afbeeldingen (alt, width/height) en interne
// links (bestaat, geen redirect, geen http). Daarna de sitemap (zelfde URL's als de
// indexeerbare pagina's, zelfde hreflang als de HTML), robots.txt, llms.txt en _redirects.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const B = 'https://slim-geregeld.nl';
const TALEN = ['nl', 'en', 'ja'];
const LOCALE = { nl: 'nl_NL', en: 'en_US', ja: 'ja_JP' };
const decode = (s) => String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

function alleHtml(dir, root = dir, uit = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) alleHtml(p, root, uit);
    else if (f.endsWith('.html')) uit.push(relative(root, p).split(sep).join('/'));
  }
  return uit;
}

// dist-bestand naar het pad waarop Netlify het serveert.
function padVan(bestand) {
  if (bestand === 'index.html') return '/';
  if (bestand.endsWith('/index.html')) return '/' + bestand.slice(0, -'index.html'.length);
  return '/' + bestand.slice(0, -'.html'.length);
}

function leesRedirects(dist) {
  const regels = [];
  for (const r of readFileSync(join(dist, '_redirects'), 'utf8').split('\n')) {
    const t = r.trim();
    if (!t || t.startsWith('#')) continue;
    const [van, naar, status] = t.split(/\s+/);
    regels.push({ van, naar, status: parseInt(status, 10) || 301 });
  }
  return regels;
}

export function head(html) {
  const kop = html.split('</head>')[0];
  const meta = (attr, naam) => { const m = kop.match(new RegExp(`<meta ${attr}="${naam.replace(/[:.]/g, '\\$&')}" content="([^"]*)"`)); return m ? decode(m[1]) : null; };
  const ld = [];
  const ldFouten = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { ld.push(JSON.parse(m[1])); } catch (e) { ldFouten.push(e.message); }
  }
  return {
    lang: (html.match(/<html lang="([^"]*)"/) || [])[1],
    title: decode((kop.match(/<title>([^<]*)<\/title>/) || [])[1] ?? ''),
    description: meta('name', 'description'),
    canonical: (kop.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || null,
    robots: meta('name', 'robots') || 'index, follow',
    hreflang: [...kop.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    og: Object.fromEntries([...kop.matchAll(/<meta property="(og:[a-z_:]+)" content="([^"]*)"/g)].filter((m) => m[1] !== 'og:locale:alternate').map((m) => [m[1], decode(m[2])])),
    ogAlternate: [...kop.matchAll(/<meta property="og:locale:alternate" content="([^"]*)"/g)].map((m) => m[1]),
    twitter: meta('name', 'twitter:card'),
    ld, ldFouten,
  };
}

const knopenVan = (ld) => ld.flatMap((g) => g['@graph'] || [g]);
const typen = (k) => [].concat(k['@type'] || []);

// Alle {"@id": ...}-verwijzingen (objecten met alleen @id) in een knoop.
function verwijzingen(x, uit = []) {
  if (Array.isArray(x)) x.forEach((y) => verwijzingen(y, uit));
  else if (x && typeof x === 'object') {
    if (x['@id'] && Object.keys(x).length === 1) uit.push(x['@id']);
    else for (const [k, v] of Object.entries(x)) if (k !== '@id') verwijzingen(v, uit);
  }
  return uit;
}

const zichtbareTekst = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

export function controleerSite(dist = 'dist', { vandaag = new Date().toISOString().slice(0, 10) } = {}) {
  const fouten = [];
  const waarschuwingen = [];
  const redirects = leesRedirects(dist);
  const bestanden = alleHtml(dist).filter((f) => !f.startsWith('cockpit/'));
  const paginas = new Map();
  for (const f of bestanden) {
    const html = readFileSync(join(dist, f), 'utf8');
    paginas.set(padVan(f), { bestand: f, html, h: head(html) });
  }
  const indexeerbaar = (p) => p && !/noindex/.test(p.h.robots) && p.h.canonical === B + padVan(p.bestand);

  // Waar komt een interne link terecht? {status, naar}. Zoals Netlify: een bestaand
  // bestand gaat voor een regel zonder !, daarna de regels in volgorde, daarna een
  // map zonder slash (301 naar de slash), anders 404.
  function volg(pad) {
    const schoon = pad.split('#')[0].split('?')[0] || '/';
    let p = schoon;
    try { p = decodeURI(schoon); } catch { /* laat staan */ }
    if (bestaat(p)) return { status: 200 };
    for (const r of redirects) {
      if (/^https?:/.test(r.van)) continue;
      const past = r.van.endsWith('/*') ? p.startsWith(r.van.slice(0, -1)) : [r.van, r.van + '/', r.van.replace(/\/$/, '')].includes(p);
      if (past) return { status: r.status, naar: r.naar };
    }
    if (!p.endsWith('/') && existsSync(join(dist, p, 'index.html'))) return { status: 301, naar: p + '/' };
    return { status: 404 };
  }
  function bestaat(p) {
    if (p.endsWith('/')) return existsSync(join(dist, p, 'index.html'));
    if (existsSync(join(dist, p + '.html'))) return true;
    const f = join(dist, p);
    return existsSync(f) && statSync(f).isFile();
  }

  const titels = new Map();
  const omschrijvingen = new Map();
  for (const [pad, p] of paginas) {
    const { h, html } = p;
    const w = (m) => waarschuwingen.push(`${pad}: ${m}`);
    const f = (m) => fouten.push(`${pad}: ${m}`);
    if (h.ldFouten.length) f('JSON-LD parse: ' + h.ldFouten.join('; '));
    if (!h.lang || !/^(nl|en|ja)$/.test(h.lang)) f(`html lang "${h.lang}"`);
    // Afbeeldingen en links gelden voor elke pagina, ook noindex.
    let zonderMaat = 0;
    for (const img of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="/.test(img[0])) f('afbeelding zonder alt: ' + img[0].slice(0, 90));
      if (!/\bwidth="/.test(img[0]) || !/\bheight="/.test(img[0])) zonderMaat++;
    }
    if (zonderMaat) w(`${zonderMaat} afbeelding(en) zonder width/height`);
    const lichaam = html.split('</head>')[1] || '';
    for (const m of lichaam.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = decode(m[1]);
      if (/^http:\/\//.test(href)) { f(`link naar http: ${href}`); continue; }
      let intern = null;
      if (href.startsWith('/') && !href.startsWith('//')) intern = href;
      else if (href.startsWith(B)) intern = href.slice(B.length) || '/';
      if (!intern) continue;
      const r = volg(intern);
      if (r.status === 404) f(`kapotte interne link: ${href}`);
      else if (r.status === 301 || r.status === 302) {
        f(`interne link naar een redirect: ${href} -> ${r.naar}`);
      } else if (r.status === 410) f(`link naar ingetrokken artikel: ${href}`);
    }

    if (!indexeerbaar(p)) {
      if (!/noindex/.test(h.robots) && h.canonical && h.canonical !== B + pad) {
        if (!h.canonical.startsWith(B + '/')) f(`canonical niet absoluut: ${h.canonical}`);
        const doel = paginas.get(h.canonical.slice(B.length));
        if (!indexeerbaar(doel)) f(`canonical wijst naar een niet-indexeerbare pagina: ${h.canonical}`);
      } else if (!/noindex/.test(h.robots)) f('geen canonical');
      continue;
    }

    // ---------- head
    if (!h.title) f('geen title');
    else if (h.title.length > 65) f(`title ${h.title.length} tekens: ${h.title}`);
    else if (h.title.length > 60 && h.lang !== 'ja') w(`title ${h.title.length} tekens: ${h.title}`);
    if (!h.description) f('geen description');
    else if (h.description.length > 160 && h.lang !== 'ja') f(`description ${h.description.length} tekens`);
    else if (h.description.length > 155 && h.lang !== 'ja') w(`description ${h.description.length} tekens`);
    if (titels.has(h.title)) f(`title gelijk aan ${titels.get(h.title)}`); else titels.set(h.title, pad);
    if (omschrijvingen.has(h.description)) f(`description gelijk aan ${omschrijvingen.get(h.description)}`); else omschrijvingen.set(h.description, pad);
    for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale', 'og:site_name']) if (!h.og[k]) f(`${k} ontbreekt`);
    if (h.og['og:url'] && h.og['og:url'] !== h.canonical) f(`og:url ${h.og['og:url']} is niet de canonical`);
    if (h.og['og:image'] && !/^https:\/\//.test(h.og['og:image'])) f('og:image niet absoluut');
    if (h.og['og:locale'] !== LOCALE[h.lang]) f(`og:locale ${h.og['og:locale']} past niet bij lang ${h.lang}`);
    if (!h.twitter) f('twitter:card ontbreekt');
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) f(`${h1} H1's in de HTML`);

    // ---------- hreflang
    if (h.hreflang.length) {
      const set = Object.fromEntries(h.hreflang);
      for (const [hl] of h.hreflang) if (!['x-default', ...TALEN].includes(hl)) f(`ongeldige hreflang ${hl}`);
      if (set[h.lang] !== h.canonical) f(`hreflang ${h.lang} verwijst niet naar zichzelf`);
      if (!set['x-default']) f('hreflang zonder x-default');
      for (const [hl, u] of h.hreflang) {
        const doel = paginas.get(u.slice(B.length));
        if (!u.startsWith(B + '/') || !indexeerbaar(doel)) { f(`hreflang ${hl} naar een niet-indexeerbare URL: ${u}`); continue; }
        if (hl !== 'x-default' && doel.h.lang !== hl) f(`hreflang ${hl} wijst naar een pagina met lang ${doel.h.lang}: ${u}`);
        if (JSON.stringify(Object.fromEntries(doel.h.hreflang)) !== JSON.stringify(set)) f(`hreflang niet wederkerig of niet gelijk met ${u}`);
      }
      const verwacht = Object.keys(set).filter((hl) => hl !== 'x-default' && hl !== h.lang).map((hl) => LOCALE[hl]).sort();
      if (JSON.stringify([...h.ogAlternate].sort()) !== JSON.stringify(verwacht)) f(`og:locale:alternate ${h.ogAlternate} hoort ${verwacht} te zijn`);
    } else if (h.ogAlternate.length) f('og:locale:alternate zonder hreflang');

    // ---------- JSON-LD
    const knopen = knopenVan(h.ld);
    if (!knopen.length) { f('geen JSON-LD'); continue; }
    const ids = new Set(knopen.map((k) => k['@id']).filter(Boolean));
    for (const k of knopen) {
      for (const id of verwijzingen(k)) {
        const lokaal = id.startsWith(B + '/#') || id.split('#')[0] === h.canonical;
        if (lokaal && !ids.has(id)) f(`@id ${id} wordt gebruikt maar staat niet in de graaf`);
      }
    }
    for (const id of [B + '/#org', B + '/#website']) if (!ids.has(id)) f(`graaf mist ${id}`);
    const org = knopen.find((k) => k['@id'] === B + '/#org');
    if (org) for (const veld of ['name', 'url', 'logo', 'address', 'sameAs', 'contactPoint', 'areaServed', 'knowsLanguage']) if (!org[veld]) f(`Organization mist ${veld}`);
    const kyle = knopen.find((k) => k['@id'] === B + '/#kyle');
    if (kyle) for (const veld of ['name', 'url', 'sameAs', 'hasCredential', 'worksFor']) if (!kyle[veld]) f(`Person Kyle mist ${veld}`);
    const pagina = knopen.find((k) => k['@id'] === h.canonical + '#webpage');
    if (!pagina) f(`geen WebPage met @id ${h.canonical}#webpage`);
    else {
      if (pagina.url !== h.canonical) f('WebPage.url is niet de canonical');
      if (pagina.inLanguage !== h.lang) f(`WebPage.inLanguage ${pagina.inLanguage} is niet html lang ${h.lang}`);
      if (!pagina.dateModified) w('WebPage zonder dateModified');
      p.dateModified = pagina.dateModified;
    }
    const bc = knopen.find((k) => typen(k).includes('BreadcrumbList'));
    if (pad !== '/' && !bc) f('geen BreadcrumbList');
    if (bc && bc.itemListElement.at(-1).item !== h.canonical) f('laatste kruimel is niet de pagina zelf');
    for (const a of knopen.filter((k) => typen(k).includes('Article'))) {
      for (const veld of ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'image', 'mainEntityOfPage']) if (!a[veld]) f(`Article mist ${veld}`);
      const auteur = knopen.find((k) => k['@id'] === a.author?.['@id']);
      if (!auteur?.url || !paginas.get(auteur.url.slice(B.length))) f('Article-auteur zonder url naar een bestaande auteurspagina');
    }
    const tekst = zichtbareTekst(html);
    for (const q of knopen.filter((k) => typen(k).includes('FAQPage')).flatMap((k) => k.mainEntity)) {
      if (!tekst.includes(q.name.replace(/\s+/g, ' '))) f(`FAQ-vraag staat niet zichtbaar op de pagina: ${q.name}`);
    }
  }

  // ---------- sitemap
  const sm = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  const smUrls = new Map();
  for (const m of sm.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = decode((m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1]);
    const lastmod = (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
    const alt = [...m[1].matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)].map((x) => [x[1], decode(x[2])]);
    if (smUrls.has(loc)) fouten.push(`sitemap: ${loc} staat er dubbel in`);
    smUrls.set(loc, { lastmod, alt });
    const p = paginas.get(loc.slice(B.length));
    if (!indexeerbaar(p)) { fouten.push(`sitemap: ${loc} is geen indexeerbare pagina met status 200`); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod || '') || lastmod > vandaag) fouten.push(`sitemap: ${loc} lastmod "${lastmod}"`);
    if (p.dateModified && p.dateModified !== lastmod) fouten.push(`sitemap: ${loc} lastmod ${lastmod} is niet dateModified ${p.dateModified}`);
    if (JSON.stringify(alt) !== JSON.stringify(p.h.hreflang)) fouten.push(`sitemap: hreflang van ${loc} wijkt af van de HTML`);
  }
  for (const [pad, p] of paginas) if (indexeerbaar(p) && !smUrls.has(B + pad)) fouten.push(`sitemap: indexeerbare pagina ${pad} ontbreekt`);

  // ---------- robots.txt, llms.txt, _redirects
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${B}/sitemap.xml`)) fouten.push('robots.txt: geen Sitemap-regel');
  for (const blok of robots.split(/\n(?=User-agent:)/)) if (/^Disallow:\s*\/\s*$/m.test(blok)) fouten.push('robots.txt: een user-agent is helemaal geblokkeerd: ' + blok.split('\n')[0]);
  const llms = readFileSync(join(dist, 'llms.txt'), 'utf8');
  if (!/^# /.test(llms) || !/\n> /.test(llms)) fouten.push('llms.txt: titel (#) of samenvatting (>) ontbreekt');
  for (const m of llms.matchAll(/\]\((https:\/\/slim-geregeld\.nl[^)]*)\)/g)) if (!indexeerbaar(paginas.get(m[1].slice(B.length)))) fouten.push(`llms.txt: link naar ${m[1]} is geen indexeerbare pagina`);
  if (redirects.some((r) => r.van === '/*' && r.status === 200)) fouten.push('_redirects: catch-all met status 200 geeft soft-404\'s');
  if (!existsSync(join(dist, '404.html'))) fouten.push('dist/404.html ontbreekt');

  const aantal = [...paginas.values()].filter(indexeerbaar).length;
  return { fouten, waarschuwingen, aantal, sitemap: smUrls.size };
}

// Los draaien: node scripts/seo-check.mjs [dist]
if (import.meta.url === `file://${process.argv[1]}`) {
  const { fouten, waarschuwingen, aantal, sitemap } = controleerSite(process.argv[2] || 'dist');
  for (const w of waarschuwingen) console.warn('let op: ' + w);
  for (const f of fouten) console.error('fout: ' + f);
  console.log(`seo-check: ${aantal} indexeerbare pagina's, ${sitemap} in de sitemap, ${fouten.length} fouten, ${waarschuwingen.length} waarschuwingen`);
  process.exit(fouten.length ? 1 : 0);
}
