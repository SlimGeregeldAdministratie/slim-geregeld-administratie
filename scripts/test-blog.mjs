// Test voor de blogbuild: bouwt de site met de testinhoud uit content/__fixtures__
// en controleert de head (canonical, hreflang, JSON-LD), de tekst, het overzicht,
// de auteurspagina's, de sitemap, llms.txt, _redirects, /nieuws en de 404. Daarna
// de technische controle van de hele site (scripts/seo-check.mjs: wederkerige
// hreflang, canonical, JSON-LD-parse en @id's, sitemap gelijk aan de HTML, links),
// ook op een kopie met opzettelijke fouten, en paginering en foutmeldingen in een
// tijdelijke map. Draai: npm run test:blog
// Let op: dist bevat daarna testinhoud. Draai npm run build voor de echte site.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, rmSync, readdirSync, statSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { bouwBlog, leesBlogs } from './blog.mjs';
import { controleerSite, head } from './seo-check.mjs';

const FIX = 'content/__fixtures__';
const B = 'https://slim-geregeld.nl';
const env = { ...process.env, BLOG_CONTENT_DIR: FIX };
let geslaagd = 0;
const test = (naam, fn) => { fn(); geslaagd++; console.log('  ok  ' + naam); };

console.log('bouwen met testinhoud...');
execSync('npx vite build --logLevel error', { env, stdio: 'inherit' });
const sjabloon = readFileSync('dist/index.html', 'utf8');
execSync('node scripts/seo-paginas.mjs', { env, stdio: 'inherit' });

const lees = (p) => readFileSync(join('dist', p), 'utf8');
const ldVan = (html) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
const knopen = (html) => ldVan(html).flatMap((g) => g['@graph'] || [g]);
const soort = (html, t) => knopen(html).filter((n) => [].concat(n['@type']).includes(t));
const hreflangs = (html) => Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));

const EN = 'en/blog/daft-renewal-what-the-ind-wants/index.html';
const NL = 'blog/daft-verlenging-wat-wil-de-ind/index.html';
const JA = 'ja/blog/daft-renewal-ind/index.html';
const en = lees(EN);
const nl = lees(NL);
const ja = lees(JA);
const urlEN = B + '/en/blog/daft-renewal-what-the-ind-wants/';
const urlNL = B + '/blog/daft-verlenging-wat-wil-de-ind/';
const urlJA = B + '/ja/blog/daft-renewal-ind/';

test('artikel: titel, description, canonical, robots, taal', () => {
  assert.match(en, /<html lang="en"/);
  assert.match(en, /<title>\[TEST\] What the IND wants for a DAFT renewal \| Slim Geregeld<\/title>/);
  assert.match(en, /<meta name="description" content="Test article\. Which documents/);
  assert.match(en, new RegExp(`<link rel="canonical" href="${urlEN}" />`));
  assert.match(en, /<meta name="robots" content="index, follow/);
  assert.match(en, /<meta property="og:type" content="article"/);
  assert.match(ja, /<html lang="ja"/);
});

test('hreflang: wederkerig, zelfverwijzend, x-default naar en', () => {
  const verwacht = { nl: urlNL, en: urlEN, ja: urlJA, 'x-default': urlEN };
  for (const html of [en, nl, ja]) assert.deepEqual(hreflangs(html), verwacht);
  assert.deepEqual(hreflangs(lees('en/blog/owners-equity-quarterly-check/index.html')), {}, 'los stuk zonder vertaling heeft geen hreflang');
});

test('JSON-LD: Article, Person met Becon, FAQPage, BreadcrumbList', () => {
  const [art] = soort(en, 'Article');
  assert.equal(art.headline, '[TEST] What the IND wants for a DAFT renewal');
  assert.equal(art.datePublished, '2026-11-01');
  assert.equal(art.dateModified, '2026-11-04');
  assert.equal(art.inLanguage, 'en');
  assert.equal(art.author['@id'], B + '/#kyle');
  const kyle = soort(en, 'Person').find((p) => p['@id'] === B + '/#kyle');
  assert.equal(kyle.name, 'Kyle Bouwmeester');
  assert.equal(kyle.jobTitle, 'Becon-registered bookkeeper');
  assert.equal(kyle.hasCredential.name, 'Becon-registratie 781794');
  const [faq] = soort(en, 'FAQPage');
  assert.equal(faq.mainEntity.length, 2);
  assert.equal(faq.mainEntity[0].name, 'Is a bank statement enough for the renewal?');
  const [bc] = soort(en, 'BreadcrumbList');
  assert.deepEqual(bc.itemListElement.map((i) => i.item), [B + '/en/', B + '/en/blog/', urlEN]);
  assert.equal(soort(nl, 'Person')[0].jobTitle, 'Becon-geregistreerd boekhouder');
});

test('artikel: tekst als HTML, inhoudsopgave, datums, auteursblok, dienstlink', () => {
  assert.match(en, /<h1 [^>]*>\[TEST\] What the IND wants for a DAFT renewal<\/h1>/);
  assert.equal((en.match(/<h1[ >]/g) || []).length, 1, 'precies één H1');
  assert.match(en, /<h2 id="what-does-the-ind-ask-for-at-renewal">/);
  assert.match(en, /<a href="#what-does-the-ind-ask-for-at-renewal"/, 'inhoudsopgave linkt naar de H2');
  assert.match(en, /<a href="#faq"/, 'FAQ staat in de inhoudsopgave');
  assert.match(en, /<div class="blog-tabel"><table>/);
  assert.match(en, /<strong>two financial years<\/strong>/);
  assert.match(en, /&lt;script&gt;alert/, 'ruwe HTML wordt tekst');
  assert.doesNotMatch(en, /<script>alert/);
  assert.match(en, /Published <time datetime="2026-11-01">1 November 2026<\/time>/);
  assert.match(en, /Updated <time datetime="2026-11-04">4 November 2026<\/time>/);
  assert.match(en, /id="auteur"[\s\S]*Pofielfoto%20Kyle\.jpg/);
  assert.match(en, /href="\/daft\/renewal\/" class="inline-block bg-white/, 'dienstlink voor daft-verlenging');
  assert.match(en, /linkedin\.com\/feed\/update\/urn:li:activity:7523435030422114304/);
  assert.doesNotMatch(en, /src="\/assets\/[^"]+\.js"/, 'geen React-bundel op blogpagina');
  assert.match(en, /href="\/assets\/[^"]+\.css"/, 'wel de Tailwind-CSS');
  assert.match(nl, /<h2 id="een-h1-in-de-tekst-wordt-een-h2">/, 'H1 in markdown wordt H2');
  assert.match(nl, /Gepubliceerd op <time datetime="2026-11-01">1 november 2026<\/time>/);
  assert.doesNotMatch(nl, /Bijgewerkt op/, 'geen bijgewerkt-regel zonder updated');
  assert.match(ja, /2026年11月2日/);
});

test('gerelateerd: zelfde cluster en taal, alleen live', () => {
  const deel = en.split('Read next')[1] || '';
  assert.match(deel, /\/en\/blog\/owners-equity-quarterly-check\//);
  assert.doesNotMatch(deel, /old-opening-balance/);
  assert.doesNotMatch(deel, /daft-renewal-what-the-ind-wants/);
});

test('Miguel: initialen zonder foto, eigen Person', () => {
  const m = lees('en/blog/owners-equity-quarterly-check/index.html');
  assert.match(m, />MW<\/span>/);
  const p = soort(m, 'Person').find((x) => x['@id'] === B + '/#miguel');
  assert.equal(p.name, 'Miguel Weema');
  assert.equal(p.jobTitle, 'DAFT specialist');
  assert.equal(soort(m, 'FAQPage').length, 0, 'geen FAQPage zonder faq');
});

test('archief: pagina live met melding, niet in het overzicht, wel in de sitemap', () => {
  const a = lees('en/blog/old-opening-balance/index.html');
  assert.match(a, /This article is archived/);
  assert.doesNotMatch(lees('en/blog/index.html'), /old-opening-balance/);
  assert.match(lees('sitemap.xml'), /<loc>https:\/\/slim-geregeld\.nl\/en\/blog\/old-opening-balance\/<\/loc>/);
});

test('ingetrokken: geen pagina, 410 in _redirects, geen catch-all', () => {
  assert.ok(!existsSync('dist/en/blog/withdrawn-piece'));
  const r = lees('_redirects');
  const i410 = r.indexOf('/en/blog/withdrawn-piece/    /ingetrokken.html    410');
  assert.ok(i410 > 0, '410-regel staat erin');
  assert.ok(r.indexOf('/en/blog/withdrawn-piece    /ingetrokken.html    410') > 0, 'ook zonder slash');
  assert.doesNotMatch(r, /^\/\*\s+\/index\.html\s+200/m, 'geen catch-all meer');
  assert.ok(existsSync('dist/ingetrokken.html'));
  assert.doesNotMatch(lees('sitemap.xml'), /withdrawn-piece/);
});

test('overzicht: nieuwste eerst, label, datum, auteur, description, clusterfilter', () => {
  const o = lees('en/blog/index.html');
  assert.ok(o.indexOf('daft-renewal-what-the-ind-wants') < o.indexOf('owners-equity-quarterly-check'));
  assert.match(o, /<meta name="robots" content="index, follow" \/>/);
  assert.match(o, /DAFT renewal<\/a>/);
  assert.match(o, /Miguel Weema/);
  const n = lees('blog/index.html');
  assert.match(n, /href="\/blog\/onderwerp\/zzp-btw\/"/, 'filter per cluster');
  assert.ok(existsSync('dist/blog/onderwerp/zzp-btw/index.html'));
  assert.match(lees('blog/onderwerp/zzp-btw/index.html'), /noindex, follow/);
  assert.deepEqual(hreflangs(o), { nl: B + '/blog/', en: B + '/en/blog/', ja: B + '/ja/blog/', 'x-default': B + '/en/blog/' });
  assert.ok(existsSync('dist/ja/blog/index.html'));
});

test('sitemap: blogs met lastmod en xhtml:link', () => {
  const s = lees('sitemap.xml');
  const blok = s.split(`<loc>${urlEN}</loc>`)[1].split('</url>')[0];
  assert.match(blok, /<xhtml:link rel="alternate" hreflang="nl" href="https:\/\/slim-geregeld\.nl\/blog\/daft-verlenging-wat-wil-de-ind\/"\/>/);
  assert.match(blok, /hreflang="x-default" href="https:\/\/slim-geregeld\.nl\/en\/blog\/daft-renewal-what-the-ind-wants\/"/);
  assert.match(blok, /<lastmod>2026-11-04<\/lastmod>/);
  assert.match(s, /<loc>https:\/\/slim-geregeld\.nl\/blog\/<\/loc>/);
});

test('blogoverzicht: Meest gelezen alleen met klikken, rang zonder getallen, statisch op nieuwste', () => {
  const en = lees('en/blog/index.html');
  assert.match(en, /data-volgorde hidden/);
  const data = JSON.parse(en.match(/<script type="application\/json" data-gelezen>(.*?)<\/script>/s)[1]);
  assert.deepEqual(data.map((x) => x.r), [1, 2], 'per dag: 37 in 4 dagen gaat voor 53 in 16 dagen');
  assert.ok(data.every((x) => !('klikken' in x)));
  assert.doesNotMatch(en, /\b(37|53)\b/);
  assert.ok(en.indexOf('daft-renewal-what-the-ind-wants') < en.indexOf('owners-equity-quarterly-check'), 'statisch nieuwste eerst');
  assert.doesNotMatch(lees('blog/index.html'), /data-volgorde|data-gelezen/, 'NL zonder klikken: geen knop');
});

test('llms.txt: blogsectie met clusters en nieuwste stukken', () => {
  const l = lees('llms.txt');
  assert.match(l, /## Blog/);
  assert.match(l, /- DAFT renewal \(daft-verlenging\): /);
  assert.match(l, /\[\[TEST\] What the IND wants for a DAFT renewal\]\(https:\/\/slim-geregeld\.nl\/en\/blog\/daft-renewal-what-the-ind-wants\/\)/);
  assert.ok(l.indexOf('## Blog') < l.indexOf('## Contact'));
});

test('/nieuws/: posts als tekst, knoppen, onderwerplabel, link naar blog, geen LinkedIn-embeds', () => {
  assert.ok(!existsSync('dist/nieuws.html'), 'geen nieuws.html naast de map nieuws/');
  const n = lees('nieuws/index.html');
  assert.match(n, /<link rel="canonical" href="https:\/\/slim-geregeld\.nl\/nieuws\/" \/>/);
  assert.match(n, /<a href="\/nieuws\/onderwerp\/zzp-btw\/">Zzp en btw<\/a>/);
  assert.match(n, /Lees het hele stuk/);
  assert.match(n, /href="\/blog\/daft-verlenging-wat-wil-de-ind\/"/);
  assert.match(n, /Bekijk op de bedrijfspagina/);
  assert.doesNotMatch(n, /linkedin\.com\/embed|platform\.linkedin\.com/);
  assert.equal(soort(n, 'CollectionPage')[0].mainEntity.itemListElement.length, 5);
});

test('/nieuws/: carrousel als dia\'s met tekst en pdf, video met transcript en VideoObject', () => {
  const n = lees('nieuws/index.html');
  assert.ok(existsSync('dist/nieuws/media/test-carrousel/2.png') && existsSync('dist/nieuws/media/test-carrousel/carrousel.pdf'), 'media gekopieerd');
  assert.match(n, /<img src="\/nieuws\/media\/test-carrousel\/2\.png" alt="Stap 2: zet daar je privébedrag naast" width="540" height="675"/);
  assert.match(n, /<figcaption>Dia 3 van 3: Stap 3: reserveer voor inkomstenbelasting en Zvw<\/figcaption>/);
  assert.match(n, /<a href="\/nieuws\/media\/test-carrousel\/carrousel\.pdf" download>/);
  assert.match(n, /<iframe src="https:\/\/www\.youtube-nocookie\.com\/embed\/aqz-KE-bpKQ"[^>]*loading="lazy"/);
  assert.match(n, /<h3>Transcript<\/h3><p>Testtranscript, eerste alinea\.<\/p>/);
  const posts = soort(n, 'CollectionPage')[0].mainEntity.itemListElement.map((x) => x.item);
  const video = posts.find((x) => x.video).video;
  assert.equal(video['@type'], 'VideoObject');
  assert.equal(video.uploadDate, '2026-11-02');
  assert.equal(video.embedUrl, 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ');
  assert.ok(video.thumbnailUrl && video.transcript && video.name);
  assert.equal(posts.find((x) => Array.isArray(x.image)).image.length, 3);
});

test('dist: nergens een map naast een gelijknamig .html-bestand', () => {
  const fout = [];
  const loop = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (existsSync(p + '.html')) fout.push(p); loop(p); }
    }
  };
  loop('dist');
  assert.deepEqual(fout, []);
});

test('geen em dash in de gegenereerde blogpagina\'s', () => {
  for (const p of [EN, NL, JA, 'blog/index.html', 'en/blog/index.html', 'nieuws/index.html']) assert.doesNotMatch(lees(p), /\u2014/, p);
});

test('auteurspagina\'s: Person, Becon, KVK, LinkedIn, artikellijst, hreflang nl-en', () => {
  const k = lees('over/kyle-bouwmeester/index.html');
  const ke = lees('en/about/kyle-bouwmeester/index.html');
  assert.match(k, /<h1 [^>]*>Kyle Bouwmeester<\/h1>/);
  assert.match(k, /781794/);
  assert.match(k, /92596991/);
  assert.match(k, /href="https:\/\/www\.linkedin\.com\/in\/kylebouwmeester"/);
  assert.match(ke, /href="\/en\/blog\/daft-renewal-what-the-ind-wants\/"/, 'artikellijst');
  assert.match(ke, /href="\/blog\/daft-verlenging-wat-wil-de-ind\/"/, 'ook artikelen in andere talen');
  const [pp] = soort(k, 'ProfilePage');
  assert.equal(pp.mainEntity['@id'], B + '/#kyle');
  const kyle = soort(k, 'Person')[0];
  assert.equal(kyle.url, B + '/over/kyle-bouwmeester/');
  assert.ok(kyle.sameAs.includes('https://www.linkedin.com/in/kylebouwmeester'));
  assert.deepEqual(hreflangs(k), { nl: B + '/over/kyle-bouwmeester/', en: B + '/en/about/kyle-bouwmeester/', 'x-default': B + '/en/about/kyle-bouwmeester/' });
  assert.deepEqual(hreflangs(ke), hreflangs(k));
  assert.match(lees('sitemap.xml'), /<loc>https:\/\/slim-geregeld\.nl\/over\/kyle-bouwmeester\/<\/loc>/);
  const m = lees('en/about/miguel-weema/index.html');
  assert.match(m, /index, follow/, 'Miguel heeft een artikel in de testinhoud');
  assert.match(m, /owners-equity-quarterly-check/);
  assert.equal(soort(en, 'Person')[0].url, B + '/en/about/kyle-bouwmeester/', 'Article-auteur wijst naar de auteurspagina');
  assert.match(en, /<a href="\/en\/about\/kyle-bouwmeester\/" class="hover:text-blue-600">Kyle Bouwmeester<\/a>/, 'auteursblok linkt naar de auteurspagina');
});

test('404-pagina: noindex, geen canonical; React-subroutes als rewrite', () => {
  const p = lees('404.html');
  assert.match(p, /noindex/);
  assert.doesNotMatch(p, /rel="canonical"/);
  assert.match(p, /<h1 [^>]*>Deze pagina bestaat niet<\/h1>/);
  const r = lees('_redirects');
  assert.match(r, /^\/bouw\/faq\s+\/bouw\.html\s+200$/m);
  assert.match(r, /^\/intake\/\*\s+\/intake\.html\s+200$/m);
});

test('verdragspagina\'s: vaste knopen uit entiteiten.mjs, zichtbare datum = dateModified = lastmod', () => {
  const s = lees('sitemap.xml');
  for (const p of ['en/', 'daft/', 'djtt/', 'djtt/ja/', 'daft/renewal/', 'daft/contact/']) {
    const html = lees(p + 'index.html');
    const org = knopen(html).find((k) => k['@id'] === B + '/#org');
    assert.ok(org.contactPoint && org.sameAs.length >= 3, p + ' Organization uit entiteiten.mjs');
    const pagina = knopen(html).find((k) => k['@id'] === B + '/' + p + '#webpage');
    assert.match(html, new RegExp(`<time datetime="${pagina.dateModified}">`), p + ' zichtbare datum');
    assert.match(s.split(`<loc>${B}/${p}</loc>`)[1].split('</url>')[0], new RegExp(`<lastmod>${pagina.dateModified}</lastmod>`), p + ' lastmod');
  }
  const djtt = s.split(`<loc>${B}/djtt/</loc>`)[1].split('</url>')[0];
  assert.match(djtt, /hreflang="ja" href="https:\/\/slim-geregeld\.nl\/djtt\/ja\/"/);
});

test('hele site: canonical, hreflang, JSON-LD, sitemap, links (seo-check)', () => {
  const { fouten } = controleerSite('dist');
  assert.deepEqual(fouten, []);
});

test('seo-check vangt fouten: hreflang, canonical, JSON-LD, sitemap', () => {
  const kopie = mkdtempSync(join(tmpdir(), 'sg-seo-'));
  try {
    cpSync('dist', kopie, { recursive: true });
    const zet = (p, van, naar) => { const f = join(kopie, p); writeFileSync(f, readFileSync(f, 'utf8').replace(van, naar)); };
    zet('blog/daft-verlenging-wat-wil-de-ind/index.html', /<link rel="alternate" hreflang="ja" href="[^"]+" \/>/, '');
    zet('daft/index.html', '<link rel="canonical" href="https://slim-geregeld.nl/daft/">', '<link rel="canonical" href="https://slim-geregeld.nl/daft">');
    zet('en/blog/owners-equity-quarterly-check/index.html', '<script type="application/ld+json">{', '<script type="application/ld+json">{,');
    zet('sitemap.xml', '<loc>https://slim-geregeld.nl/branches</loc>', '<loc>https://slim-geregeld.nl/bestaat-niet</loc>');
    zet('branches.html', '<a href="/bouw">', '<a href="/bouww">');
    zet('creatief.html', '<div id="root">', '<div id="root"><a href="/daft">x</a>');
    const t = controleerSite(kopie).fouten.join('\n');
    assert.match(t, /hreflang niet wederkerig/);
    assert.match(t, /\/daft\/.*canonical|sitemap: .*\/daft\//);
    assert.match(t, /JSON-LD parse/);
    assert.match(t, /bestaat-niet is geen indexeerbare pagina/);
    assert.match(t, /indexeerbare pagina \/branches ontbreekt/);
    assert.match(t, /kapotte interne link: \/bouww/);
    assert.match(t, /interne link naar een redirect: \/daft -> \/daft\//);
  } finally {
    rmSync(kopie, { recursive: true, force: true });
  }
});

// ---------- /nieuws/: paginering, onderwerpen en "Meest gelezen" met 23 posts
const tmpNieuws = mkdtempSync(join(tmpdir(), 'sg-nieuws-'));
try {
  cpSync(join(FIX, 'blog'), join(tmpNieuws, 'blog'), { recursive: true });
  mkdirSync(join(tmpNieuws, 'nieuws'));
  const voorbeeld = JSON.parse(readFileSync(join(FIX, 'nieuws', 'nieuws.json'), 'utf8')).find((n) => !n.media);
  // 20 posts zzp-btw, 2 jaarwerk, 1 zonder cluster; impressies oplopend met het nummer.
  const posts = Array.from({ length: 23 }, (_, i) => ({ ...voorbeeld, id: `test-${i + 1}`, datum: `2026-10-${String(i + 1).padStart(2, '0')}`, titel: `Post ${i + 1}`,
    cluster: i < 20 ? 'zzp-btw' : i < 22 ? 'jaarwerk' : undefined, impressies: 1000 + i * 7, impressiesBijgewerkt: '2026-11-04', toon: true, blogSlug: null }));
  // Een verborgen post: niet op de site, niet in de bundel.
  posts.push({ ...voorbeeld, id: 'test-verborgen', datum: '2026-10-30', titel: 'Verborgen post', cluster: 'zzp-btw', toon: false, blogSlug: null });
  writeFileSync(join(tmpNieuws, 'nieuws', 'nieuws.json'), JSON.stringify(posts, null, 2));
  const envN = { ...process.env, BLOG_CONTENT_DIR: tmpNieuws };
  execSync('npx vite build --logLevel error', { env: envN, stdio: 'inherit' });
  execSync('node scripts/seo-paginas.mjs', { env: envN, stdio: 'inherit' });

  test('nieuws: 10 per pagina, canonical naar zichzelf, rel prev/next', () => {
    const p1 = lees('nieuws/index.html');
    const p2 = lees('nieuws/2/index.html');
    const p3 = lees('nieuws/3/index.html');
    assert.ok(!existsSync('dist/nieuws/4'));
    const kop = (h) => h.split('</head>')[0];
    assert.equal((p1.match(/<article /g) || []).length, 10);
    assert.equal((p3.match(/<article /g) || []).length, 3);
    assert.ok(p1.indexOf('Post 23') < p1.indexOf('Post 14'), 'nieuwste eerst');
    assert.match(kop(p2), /<link rel="canonical" href="https:\/\/slim-geregeld\.nl\/nieuws\/2\/" \/>/);
    assert.match(kop(p2), /<link rel="prev" href="https:\/\/slim-geregeld\.nl\/nieuws\/" \/>/);
    assert.match(kop(p2), /<link rel="next" href="https:\/\/slim-geregeld\.nl\/nieuws\/3\/" \/>/);
    assert.doesNotMatch(kop(p1), /rel="prev"/);
    assert.doesNotMatch(kop(p3), /rel="next"/);
    assert.match(kop(p2), /<meta name="robots" content="index, follow" \/>/);
    assert.notEqual(head(p1).title, head(p2).title);
    const s = lees('sitemap.xml');
    for (const u of ['/nieuws/', '/nieuws/2/', '/nieuws/3/']) assert.match(s, new RegExp(`<loc>${B}${u}</loc>`));
  });

  test('nieuws: filterpagina per onderwerp, noindex onder de 3 posts, onbekend cluster wordt nieuws', () => {
    const zzp = lees('nieuws/onderwerp/zzp-btw/index.html');
    assert.equal((zzp.match(/<article /g) || []).length, 10);
    assert.ok(existsSync('dist/nieuws/onderwerp/zzp-btw/2/index.html'));
    assert.match(zzp, /<meta name="robots" content="index, follow" \/>/);
    assert.match(zzp, /<link rel="next" href="https:\/\/slim-geregeld\.nl\/nieuws\/onderwerp\/zzp-btw\/2\/" \/>/);
    const jaar = lees('nieuws/onderwerp/jaarwerk/index.html');
    assert.match(jaar, /<meta name="robots" content="noindex, follow" \/>/);
    assert.doesNotMatch(lees('sitemap.xml'), /onderwerp\/jaarwerk/);
    assert.match(lees('nieuws/onderwerp/nieuws/index.html'), /Post 23/);
  });

  test('nieuws: toon false staat nergens', () => {
    for (const f of ['nieuws/index.html', 'nieuws/onderwerp/zzp-btw/index.html']) assert.doesNotMatch(lees(f), /Verborgen post/);
    const js = readdirSync('dist/assets').filter((f) => f.endsWith('.js')).map((f) => readFileSync(join('dist/assets', f), 'utf8')).join('');
    assert.doesNotMatch(js, /test-verborgen/);
  });

  test('nieuws: impressies niet in de bundel, rang op impressies per dag', () => {
    const js = readdirSync('dist/assets').filter((f) => f.endsWith('.js')).map((f) => readFileSync(join('dist/assets', f), 'utf8')).join('');
    assert.doesNotMatch(js, /impressies/);
    // Post 23 (1154 impressies in 12 dagen) gaat voor post 1 (1000 in 34 dagen).
    const rang = (id) => Number((js.match(new RegExp(`id:"${id}"[^}]*?rang:(\\d+)`)) || [])[1]);
    assert.equal(rang('test-23'), 1);
    assert.ok(rang('test-1') > rang('test-23'));
    for (const f of ['nieuws/index.html', 'nieuws/2/index.html']) assert.doesNotMatch(lees(f), /impressies|1154/);
  });

  test('nieuws: seo-check zonder fouten', () => {
    assert.deepEqual(controleerSite('dist').fouten, []);
  });
} finally {
  rmSync(tmpNieuws, { recursive: true, force: true });
}

// ---------- paginering en foutmeldingen in een tijdelijke map
const tmp = mkdtempSync(join(tmpdir(), 'sg-blog-'));
try {
  const content = join(tmp, 'content');
  mkdirSync(join(content, 'blog', 'nl'), { recursive: true });
  for (let i = 1; i <= 14; i++) {
    const d = `2026-10-${String(i).padStart(2, '0')}`;
    writeFileSync(join(content, 'blog', 'nl', `stuk-${i}.md`), `---\ntitle: "Stuk ${i}"\ndescription: "Omschrijving ${i}"\ndate: ${d}\nauthor: kyle\nlang: nl\ncluster: moneybird\nstatus: live\n---\n\nTekst ${i}.\n`);
  }
  const dist = join(tmp, 'dist');
  mkdirSync(dist);
  for (const f of ['_redirects', 'llms.txt']) cpSync(join('public', f), join(dist, f));
  bouwBlog({ sjabloon, dist, B, content });
  test('paginering: 12 per pagina, pagina 2 met de rest', () => {
    const p1 = readFileSync(join(dist, 'blog/index.html'), 'utf8');
    const p2 = readFileSync(join(dist, 'blog/pagina/2/index.html'), 'utf8');
    assert.equal((p1.match(/<article /g) || []).length, 12);
    assert.equal((p2.match(/<article /g) || []).length, 2);
    assert.ok(p1.indexOf('/blog/stuk-14/') < p1.indexOf('/blog/stuk-3/'), 'nieuwste eerst');
    assert.match(p1, /href="\/blog\/pagina\/2\/" rel="next"/);
    assert.match(p2, /href="\/blog\/" rel="prev"/);
    assert.doesNotMatch(p2, /stuk-14/);
  });

  writeFileSync(join(content, 'blog', 'nl', 'kapot.md'), '---\ntitle: Kapot\ndate: 5-11-2026\nauthor: jan\nlang: en\nstatus: concept\n---\n\nTekst.\n');
  test('foutmeldingen bij ongeldige frontmatter', () => {
    const { fouten } = leesBlogs(content);
    const tekst = fouten.join('\n');
    for (const m of ['description ontbreekt', 'date moet JJJJ-MM-DD zijn', 'author moet kyle of miguel zijn', 'lang is "en"', 'cluster ontbreekt', 'status moet']) assert.ok(tekst.includes(m), m);
    assert.throws(() => bouwBlog({ sjabloon, dist, B, content }), /inhoud klopt niet/);
  });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n${geslaagd} tests geslaagd. dist bevat nu testinhoud; draai npm run build voor de echte site.`);
