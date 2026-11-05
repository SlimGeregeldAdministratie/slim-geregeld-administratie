// Test voor de blogbuild: bouwt de site met de testinhoud uit content/__fixtures__
// en controleert de head (canonical, hreflang, JSON-LD), de tekst, het overzicht,
// de sitemap, llms.txt, _redirects en /nieuws. Daarna paginering en foutmeldingen
// in een tijdelijke map. Draai: npm run test:blog
// Let op: dist bevat daarna testinhoud. Draai npm run build voor de echte site.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, rmSync, readdirSync, statSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { bouwBlog, leesBlogs } from './blog.mjs';

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

test('ingetrokken: geen pagina, 410 in _redirects vóór de catch-all', () => {
  assert.ok(!existsSync('dist/en/blog/withdrawn-piece'));
  const r = lees('_redirects');
  const i410 = r.indexOf('/en/blog/withdrawn-piece/    /ingetrokken.html    410');
  assert.ok(i410 > 0, '410-regel staat erin');
  assert.ok(r.indexOf('/en/blog/withdrawn-piece    /ingetrokken.html    410') > 0, 'ook zonder slash');
  assert.ok(i410 < r.indexOf('/*             /index.html   200'), 'vóór de catch-all');
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

test('llms.txt: blogsectie met clusters en nieuwste stukken', () => {
  const l = lees('llms.txt');
  assert.match(l, /## Blog/);
  assert.match(l, /- DAFT renewal \(daft-verlenging\): /);
  assert.match(l, /\[\[TEST\] What the IND wants for a DAFT renewal\]\(https:\/\/slim-geregeld\.nl\/en\/blog\/daft-renewal-what-the-ind-wants\/\)/);
  assert.ok(l.indexOf('## Blog') < l.indexOf('## Contact'));
});

test('/nieuws: posts als tekst, knoppen, link naar blog, geen LinkedIn-embeds', () => {
  const n = lees('nieuws.html');
  assert.match(n, /Lees het hele stuk/);
  assert.match(n, /href="\/blog\/daft-verlenging-wat-wil-de-ind\/"/);
  assert.match(n, /Bekijk op de bedrijfspagina/);
  assert.doesNotMatch(n, /linkedin\.com\/embed|platform\.linkedin\.com/);
  assert.ok(soort(n, 'CollectionPage')[0].mainEntity.itemListElement.length === 3);
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
  for (const p of [EN, NL, JA, 'blog/index.html', 'en/blog/index.html', 'nieuws.html']) assert.doesNotMatch(lees(p), /\u2014/, p);
});

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
  for (const f of ['_redirects', 'sitemap.xml', 'llms.txt']) cpSync(join('public', f), join(dist, f));
  const graaf = { ORG: { '@id': B + '/#org' }, KYLE: { knowsLanguage: ['nl', 'en'], hasCredential: { name: 'Becon-registratie 781794' } }, SITE: { '@id': B + '/#website' } };
  bouwBlog({ sjabloon, dist, B, ...graaf, content });
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
    assert.throws(() => bouwBlog({ sjabloon, dist, B, ...graaf, content }), /inhoud klopt niet/);
  });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n${geslaagd} tests geslaagd. dist bevat nu testinhoud; draai npm run build voor de echte site.`);
