// Blog en nieuws voor de statische buildstap (scripts/seo-paginas.mjs roept dit aan).
//
// Bron: content/blog/{nl,en,ja}/<slug>.md en content/nieuws/nieuws.json. Het
// formaat staat in content/README.md; de n8n-content-engine schrijft daarnaar.
// Met BLOG_CONTENT_DIR=content/__fixtures__ bouwt dit de testinhoud in plaats
// van de echte map (alleen voor scripts/test-blog.mjs en de controle op een preview).
//
// Wat er uitkomt, allemaal als map met index.html, zodat er nooit een submap
// naast een los .html-bestand staat (dat brak eerder de Netlify-preview):
//   /blog/                          NL-overzicht, 12 per pagina, /blog/pagina/2/ enz.
//   /blog/<slug>/                   NL-artikel
//   /blog/onderwerp/<cluster>/      NL-overzicht per cluster (noindex)
//   /en/blog/, /en/blog/<slug>/, /en/blog/page/2/, /en/blog/topic/<cluster>/
//   /ja/blog/... alleen als er Japanse stukken zijn
//   /ingetrokken.html               410-pagina voor stukken met status ingetrokken
//   /404.html                       Netlify serveert die met status 404 voor onbekende URL's
//   /over/<auteur>/, /en/about/<auteur>/   auteurspagina's (Person-schema, artikellijst)
// Verder: regels in dist/_redirects, een blogsectie in dist/llms.txt, en de
// sitemap-regels, die bouwBlog teruggeeft (seo-paginas.mjs schrijft de sitemap).
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { Marked, Renderer } from 'marked';
import { parse as leesYaml } from 'yaml';
import { ORG, SITE, kyle, miguel, AUTEURPADEN, PROFIELEN } from './entiteiten.mjs';

export const CONTENT = process.env.BLOG_CONTENT_DIR || 'content';
const TALEN = ['nl', 'en', 'ja'];
const STATUSSEN = ['live', 'archief', 'ingetrokken'];
const PER_PAGINA = 12;
// Datum waarop de vaste tekst van de auteurspagina's voor het laatst inhoudelijk wijzigde.
const AUTEURS_GEWIJZIGD = '2026-11-05';
const LOCALE = { nl: 'nl_NL', en: 'en_US', ja: 'ja_JP' };
// Boven deze lengte valt " | Slim Geregeld" van de paginatitel weg.
export const TITEL_MAX = 60;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;
// Mapnamen die het overzicht zelf gebruikt; een artikel mag niet zo heten.
const GERESERVEERD = ['pagina', 'page', 'onderwerp', 'topic'];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const padUrl = (p) => p.split('/').map(encodeURIComponent).join('/');

// ---------------------------------------------------------------- teksten
const T = {
  nl: {
    blog: 'Blog', home: 'Home', homePad: '/', locale: 'nl_NL',
    overzichtTitel: 'Blog over boekhouding, btw en de BV | Slim Geregeld',
    overzichtOmschrijving: 'Artikelen van Becon-geregistreerd boekhouder Kyle Bouwmeester over btw, de BV, de aangifte inkomstenbelasting, Moneybird en verdragsvergunningen.',
    overzichtH1: 'Blog', overzichtIntro: 'Praktische artikelen over boekhouding, btw, de BV en de aangifte inkomstenbelasting, met rekenvoorbeelden uit de praktijk.',
    leeg: 'Hier verschijnen binnenkort de eerste artikelen. Tot die tijd staan de korte tips op de nieuwspagina.', leegLink: ['/nieuws', 'Naar het nieuws'],
    alleOnderwerpen: 'Alle onderwerpen', onderwerp: 'Onderwerp',
    gepubliceerd: 'Gepubliceerd op', bijgewerkt: 'Bijgewerkt op', door: 'Door',
    inhoud: 'Inhoud', faq: 'Veelgestelde vragen', overAuteur: 'Over de auteur', gerelateerd: 'Lees ook',
    vorige: 'Vorige', volgende: 'Volgende', pagina: 'Pagina', paginaPad: 'pagina', onderwerpPad: 'onderwerp',
    archief: 'Dit artikel staat in het archief en wordt niet meer bijgewerkt. Kijk in het overzicht voor nieuwere stukken.',
    linkedin: 'Dit stuk op LinkedIn', bekijkLinkedin: 'Bekijk de post op LinkedIn',
    cta: ['/contact', 'Plan een gratis kennismaking'],
    nav: [['/branches', 'Branches'], ['/pakketten', 'Pakketten'], ['/blog/', 'Blog'], ['/nieuws', 'Nieuws'], ['/over-ons', 'Over ons'], ['/contact', 'Contact']],
    talen: [['/en/', 'EN', 'en'], ['/djtt/ja/', '日本語', 'ja']],
    voet: 'Boekhouding, btw-aangifte en jaarrekening voor zzp\'ers en kleine ondernemers. Becon-geregistreerd boekhouder Kyle Bouwmeester.',
    voetLinks: [['/privacybeleid', 'Privacybeleid'], ['/algemene-voorwaarden', 'Algemene voorwaarden'], ['/en/', 'English']],
  },
  en: {
    blog: 'Blog', home: 'Treaty services', homePad: '/en/', locale: 'en_US',
    overzichtTitel: 'Blog on DAFT, DJTT and Dutch bookkeeping | Slim Geregeld',
    overzichtOmschrijving: 'Articles by Becon-registered bookkeeper Kyle Bouwmeester on DAFT and DJTT permits, renewals, owner\'s equity and Dutch bookkeeping, with worked figures.',
    overzichtH1: 'Blog', overzichtIntro: 'Articles on the DAFT and DJTT residence permits, the renewal, owner\'s equity and running a Dutch business, with worked figures from practice.',
    leeg: 'The first articles will appear here soon. Until then, the treaty pages answer the most common questions.', leegLink: ['/en/', 'Treaty services in English'],
    alleOnderwerpen: 'All topics', onderwerp: 'Topic',
    gepubliceerd: 'Published', bijgewerkt: 'Updated', door: 'By',
    inhoud: 'Contents', faq: 'Frequently asked questions', overAuteur: 'About the author', gerelateerd: 'Read next',
    vorige: 'Previous', volgende: 'Next', pagina: 'Page', paginaPad: 'page', onderwerpPad: 'topic',
    archief: 'This article is archived and no longer updated. See the overview for newer articles.',
    linkedin: 'This article on LinkedIn', bekijkLinkedin: 'View the post on LinkedIn',
    cta: ['/daft/contact/', 'Ask a question'],
    nav: [['/daft/', 'US (DAFT)'], ['/djtt/', 'Japan (DJTT)'], ['/daft/renewal/', 'Renewal'], ['/daft/#pricing', 'Compliance Plan'], ['/en/blog/', 'Blog'], ['/daft/contact/', 'Contact']],
    talen: [['/djtt/ja/', '日本語', 'ja'], ['/', 'NL', 'nl']],
    voet: 'Opening balance sheets, renewal statements and bookkeeping for DAFT and DJTT entrepreneurs. Becon-registered bookkeeper Kyle Bouwmeester.',
    voetLinks: [['/en/', 'Treaty services'], ['/daft/contact/', 'Contact'], ['/', 'Nederlands']],
  },
  ja: {
    blog: 'ブログ', home: '日本語ページ', homePad: '/djtt/ja/', locale: 'ja_JP',
    overzichtTitel: 'ブログ：日蘭通商航海条約（DJTT）とオランダの記帳 | Slim Geregeld',
    overzichtOmschrijving: 'Becon登録ブックキーパー Kyle Bouwmeester による、日蘭通商航海条約に基づく滞在許可、更新、自己資本、オランダでの記帳についての記事。',
    overzichtH1: 'ブログ', overzichtIntro: '日蘭通商航海条約に基づく滞在許可、更新、自己資本、オランダでの事業運営についての記事です。英語版が正文です。',
    leeg: '記事は近日公開予定です。', leegLink: ['/djtt/ja/', '日本語ページへ'],
    alleOnderwerpen: 'すべてのトピック', onderwerp: 'トピック',
    gepubliceerd: '公開日', bijgewerkt: '更新日', door: '著者',
    inhoud: '目次', faq: 'よくある質問', overAuteur: '著者について', gerelateerd: '関連記事',
    vorige: '前へ', volgende: '次へ', pagina: 'ページ', paginaPad: 'page', onderwerpPad: 'topic',
    archief: 'この記事はアーカイブされており、更新されていません。',
    linkedin: 'LinkedInの投稿', bekijkLinkedin: 'LinkedInで見る',
    cta: ['/daft/contact/?over=djft', 'お問い合わせ'],
    nav: [['/djtt/ja/', 'DJTT（日本語）'], ['/ja/blog/', 'ブログ'], ['/daft/renewal/', 'Renewal'], ['/daft/contact/?over=djft', 'Contact']],
    talen: [['/en/', 'EN', 'en'], ['/', 'NL', 'nl']],
    voet: 'オランダの条約ビザ（DAFT・DJTT）の開始貸借対照表、更新用の書類、記帳。Becon登録ブックキーパー Kyle Bouwmeester。',
    voetLinks: [['/djtt/ja/', '日本語ページ'], ['/en/', 'English'], ['/', 'Nederlands']],
  },
};

// Clusters: label per taal en de vaste dienstlink onderaan elk artikel.
// Een onbekend cluster mag, dan is het label de sleutel en is er geen dienstlink.
const PAKKETTEN_NL = ['/pakketten', 'Boekhouding uit handen geven?', 'Boekhouding, btw-aangifte en jaarrekening voor €95 per maand, met Kyle als vast aanspreekpunt. De eerste 30 dagen zijn gratis.', 'Bekijk de pakketten'];
const PLAN_EN = ['/daft/#pricing', 'Bookkeeping for treaty entrepreneurs', 'The Compliance Plan covers monthly bookkeeping, the quarterly equity check and the renewal statement for €79 or €149 a month excluding VAT.', 'See the Compliance Plan'];
const PLAN_JA = ['/djtt/ja/#pricing', '条約ビザの方の記帳', '月次の記帳、四半期ごとの自己資本チェック、更新用の書類を含むプランです。', '料金を見る'];
export const CLUSTERS = {
  'daft-verlenging': { label: { nl: 'DAFT-verlenging', en: 'DAFT renewal', ja: '滞在許可の更新' },
    dienst: { nl: ['/daft/renewal/', 'Verlenging van je DAFT- of DJTT-vergunning', 'De verlengingsverklaring met balans en winst-en-verliesrekening over twee jaar, opgesteld en getekend door een Becon-boekhouder. Vanaf €495 exclusief btw.', 'Naar de verlenging'],
      en: ['/daft/renewal/', 'Renewing your DAFT or DJTT permit?', 'The renewal statement with balance sheet and profit and loss account for two years, prepared and signed by a Becon-registered bookkeeper. From €495 excluding VAT.', 'See the renewal statement'],
      ja: ['/daft/renewal/', '滞在許可の更新', '2年分の貸借対照表と損益計算書を、Becon登録ブックキーパーが作成し署名します。€495（税抜）から。', '更新について（英語）'] } },
  daft: { label: { nl: 'DAFT', en: 'DAFT', ja: 'DAFT' },
    dienst: { nl: ['/daft/', 'Openingsbalans voor DAFT', 'De openingsbalans voor de verblijfsvergunning onder het Amerikaans-Nederlands vriendschapsverdrag, vanaf €495 exclusief btw.', 'Naar de DAFT-pagina'],
      en: ['/daft/', 'DAFT opening balance sheet', 'The balance sheet the IND asks for, checked and signed by a Becon-registered bookkeeper. From €495 excluding VAT, fully remote and in English.', 'See the DAFT service'],
      ja: ['/daft/', 'DAFT 開始貸借対照表', 'IND が求める貸借対照表を作成し署名します。€495（税抜）から。', 'DAFT について（英語）'] } },
  djtt: { label: { nl: 'DJTT', en: 'DJTT', ja: '日蘭通商航海条約' },
    dienst: { nl: ['/djtt/', 'Openingsbalans voor DJTT', 'De openingsbalans voor Japanse ondernemers onder het Nederlands-Japanse handelsverdrag, vanaf €495 exclusief btw.', 'Naar de DJTT-pagina'],
      en: ['/djtt/', 'DJTT opening balance sheet', 'The balance sheet for Japanese nationals under the Dutch-Japanese Trade Treaty, checked and signed by a Becon-registered bookkeeper. From €495 excluding VAT.', 'See the DJTT service'],
      ja: ['/djtt/ja/', '開始貸借対照表（DJTT）', '日蘭通商航海条約に基づく滞在許可のための貸借対照表を作成し署名します。€495（税抜）から。', '日本語ページへ'] } },
  'zzp-btw': { label: { nl: 'Zzp en btw', en: 'VAT for freelancers', ja: '個人事業主とVAT' }, dienst: { nl: PAKKETTEN_NL, en: PLAN_EN, ja: PLAN_JA } },
  'bv-dga': { label: { nl: 'BV en DGA', en: 'BV and director', ja: 'BVと取締役' },
    dienst: { nl: ['/pakketten', 'Een BV in de administratie?', 'Voor BV\'s maakt Kyle een voorstel op maat, met loonadministratie, jaarrekening en de aangifte vennootschapsbelasting.', 'Bekijk de pakketten'], en: PLAN_EN, ja: PLAN_JA } },
  jaarwerk: { label: { nl: 'Jaarwerk', en: 'Year-end', ja: '決算' }, dienst: { nl: PAKKETTEN_NL, en: PLAN_EN, ja: PLAN_JA } },
  'ib-aangifte': { label: { nl: 'Aangifte inkomstenbelasting', en: 'Income tax return', ja: '所得税申告' },
    dienst: { nl: ['/pakketten', 'Aangifte inkomstenbelasting uitbesteden?', 'Voor ondernemers doet Kyle de aangifte inkomstenbelasting voor een vaste €235.', 'Bekijk de pakketten'], en: PLAN_EN, ja: PLAN_JA } },
  moneybird: { label: { nl: 'Moneybird', en: 'Moneybird', ja: 'Moneybird' }, dienst: { nl: PAKKETTEN_NL, en: PLAN_EN, ja: PLAN_JA } },
};
const clusterLabel = (c, taal) => CLUSTERS[c]?.label[taal] || c;

// ---------------------------------------------------------------- auteurs
const MIGUEL_FOTO = 'public/blog/img/miguel.jpg';
function auteurs(B) {
  return {
    kyle: {
      naam: 'Kyle Bouwmeester', initialen: 'KB', foto: '/Pofielfoto Kyle.jpg', id: B + '/#kyle',
      functie: { nl: 'Becon-geregistreerd boekhouder', en: 'Becon-registered bookkeeper', ja: 'Becon登録ブックキーパー' },
      bio: {
        nl: 'Kyle Bouwmeester is Becon-geregistreerd boekhouder (Becon 781794) en eigenaar van Slim Geregeld Administratie. Hij doet de boekhouding, btw-aangifte en jaarrekening voor zzp\'ers en kleine ondernemers, en stelt de balansen op voor verdragsondernemers uit de VS en Japan.',
        en: 'Kyle Bouwmeester is a Becon-registered bookkeeper (Becon 781794) and the owner of Slim Geregeld Administratie. He prepares and signs the balance sheets for DAFT and DJTT entrepreneurs and keeps the books for Dutch freelancers and small businesses.',
        ja: 'Kyle Bouwmeester は Becon 登録ブックキーパー（Becon 781794）で、Slim Geregeld Administratie の代表です。DAFT・DJTT の起業家向けに貸借対照表を作成し署名しています。',
      },
      url: { nl: AUTEURPADEN.kyle.nl, en: AUTEURPADEN.kyle.en, ja: AUTEURPADEN.kyle.en },
      schema: (taal) => kyle(taal),
      feiten: {
        nl: [['Becon-registratie', '781794 (registratie als belastingintermediair bij de Belastingdienst)'], ['Kantoor', 'Slim Geregeld Administratie, Koog aan de Zaan'], ['KVK', '92596991'], ['Talen', 'Nederlands, Engels']],
        en: [['Becon registration', '781794 (registered tax intermediary with the Dutch Tax Administration)'], ['Practice', 'Slim Geregeld Administratie, Koog aan de Zaan, the Netherlands'], ['Chamber of Commerce (KVK)', '92596991'], ['Languages', 'Dutch, English']],
      },
      links: [[PROFIELEN.kyleLinkedin, 'LinkedIn'], [PROFIELEN.moneybird, 'Moneybird Expert'], ['mailto:kyle@slim-geregeld.nl', 'kyle@slim-geregeld.nl']],
    },
    miguel: {
      naam: 'Miguel Weema', initialen: 'MW', foto: existsSync(MIGUEL_FOTO) ? '/blog/img/miguel.jpg' : null, id: B + '/#miguel',
      functie: { nl: 'DAFT-specialist', en: 'DAFT specialist', ja: 'DAFTスペシャリスト' },
      bio: {
        nl: 'Miguel Weema is DAFT-specialist bij Slim Geregeld Administratie.',
        en: 'Miguel Weema is the DAFT specialist at Slim Geregeld Administratie.',
        ja: 'Miguel Weema は Slim Geregeld Administratie の DAFT スペシャリストです。',
      },
      url: { nl: AUTEURPADEN.miguel.nl, en: AUTEURPADEN.miguel.en, ja: AUTEURPADEN.miguel.en },
      schema: (taal) => miguel(taal, existsSync(MIGUEL_FOTO) ? '/blog/img/miguel.jpg' : null),
      feiten: { nl: [['Kantoor', 'Slim Geregeld Administratie']], en: [['Practice', 'Slim Geregeld Administratie']] },
      links: [],
    },
  };
}

// ---------------------------------------------------------------- inlezen en controleren
function datumTekst(d) {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return d == null ? d : String(d);
}
const geldigeDatum = (d) => DATUM.test(d) && !Number.isNaN(Date.parse(d + 'T00:00:00Z'));

// Leest alle markdown en geeft {stukken, fouten, waarschuwingen}. Gooit niet;
// de aanroeper beslist (de build stopt bij fouten).
export function leesBlogs(map = CONTENT) {
  const stukken = [];
  const fouten = [];
  const waarschuwingen = [];
  for (const taal of TALEN) {
    const dir = join(map, 'blog', taal);
    if (!existsSync(dir)) continue;
    for (const bestand of readdirSync(dir).sort()) {
      if (!bestand.endsWith('.md')) continue;
      const pad = join(dir, bestand);
      const slug = bestand.slice(0, -3);
      const fout = (m) => fouten.push(`${pad}: ${m}`);
      const let_op = (m) => waarschuwingen.push(`${pad}: ${m}`);
      if (!SLUG.test(slug)) { fout('bestandsnaam moet een slug zijn (kleine letters, cijfers en streepjes)'); continue; }
      if (GERESERVEERD.includes(slug)) { fout(`slug "${slug}" is gereserveerd`); continue; }
      const ruw = readFileSync(pad, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
      const m = ruw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (!m) { fout('geen YAML-frontmatter tussen --- en ---'); continue; }
      let fm;
      try { fm = leesYaml(m[1]) || {}; } catch (e) { fout('YAML klopt niet: ' + e.message.split('\n')[0]); continue; }
      const s = {
        bestand: pad, slug, taal, tekst: m[2].trim(),
        title: fm.title, description: fm.description, date: datumTekst(fm.date), updated: datumTekst(fm.updated) || null,
        author: fm.author, lang: fm.lang, translationKey: fm.translationKey ? String(fm.translationKey) : slug,
        cluster: fm.cluster, tags: fm.tags ?? [], faq: fm.faq ?? [], status: fm.status ?? 'live', image: fm.image ?? null,
        linkedin: fm.linkedin == null ? [] : (Array.isArray(fm.linkedin) ? fm.linkedin : [fm.linkedin]),
      };
      if (!s.title || typeof s.title !== 'string') fout('title ontbreekt');
      else if (s.title.length > TITEL_MAX) let_op(`title is ${s.title.length} tekens; boven ${TITEL_MAX} valt "| Slim Geregeld" weg en kapt Google de titel af`);
      if (!s.description || typeof s.description !== 'string') fout('description ontbreekt');
      else if (s.description.length > 155) let_op(`description is ${s.description.length} tekens, maximaal 155; zoekmachines kappen hem af`);
      if (!s.date || !geldigeDatum(s.date)) fout('date moet JJJJ-MM-DD zijn');
      if (s.updated && !geldigeDatum(s.updated)) fout('updated moet JJJJ-MM-DD zijn');
      if (s.updated && s.date && s.updated < s.date) let_op('updated ligt voor date');
      if (!['kyle', 'miguel'].includes(s.author)) fout('author moet kyle of miguel zijn');
      if (s.lang !== taal) fout(`lang is "${s.lang}" maar het bestand staat in de map ${taal}`);
      if (!s.cluster || !SLUG.test(String(s.cluster))) fout('cluster ontbreekt of is geen slug');
      else if (!CLUSTERS[s.cluster]) let_op(`onbekend cluster "${s.cluster}" (geen label en geen dienstlink)`);
      if (!STATUSSEN.includes(s.status)) fout(`status moet ${STATUSSEN.join(', ')} zijn`);
      if (fm.status == null) let_op('status ontbreekt, behandeld als live');
      if (!Array.isArray(s.tags) || s.tags.some((t) => typeof t !== 'string')) fout('tags moet een lijst met teksten zijn');
      if (!Array.isArray(s.faq) || s.faq.some((f) => !f || typeof f.q !== 'string' || typeof f.a !== 'string')) fout('faq moet een lijst van {q, a} zijn');
      if (s.linkedin.some((u) => typeof u !== 'string' || !/^https:\/\/(www\.)?linkedin\.com\//.test(u))) fout('linkedin moet een lijst met linkedin.com-URL\'s zijn');
      if (s.image) {
        const rel = String(s.image).replace(/^\/?(public\/)?/, '');
        if (!rel.startsWith('blog/img/')) fout('image moet onder public/blog/img/ staan');
        else if (!existsSync(join('public', rel))) { let_op(`image ${rel} bestaat niet, artikel zonder afbeelding gebouwd`); s.image = null; }
        else s.image = '/' + rel;
      }
      if (!s.tekst) fout('geen tekst onder de frontmatter');
      stukken.push(s);
    }
  }
  // Eén versie per taal per translationKey, anders klopt hreflang niet.
  const gezien = new Map();
  for (const s of stukken) {
    const k = s.translationKey + '|' + s.taal;
    if (gezien.has(k)) fouten.push(`${s.bestand}: translationKey "${s.translationKey}" bestaat al in ${s.taal} (${gezien.get(k)})`);
    else gezien.set(k, s.bestand);
  }
  return { stukken, fouten, waarschuwingen };
}

export function leesNieuws(map = CONTENT) {
  const pad = join(map, 'nieuws', 'nieuws.json');
  if (!existsSync(pad)) return { items: [], fouten: [], waarschuwingen: [] };
  const fouten = [];
  let lijst;
  try { lijst = JSON.parse(readFileSync(pad, 'utf8')); } catch (e) { return { items: [], fouten: [`${pad}: geen geldige JSON (${e.message})`], waarschuwingen: [] }; }
  if (!Array.isArray(lijst)) return { items: [], fouten: [`${pad}: moet een lijst zijn`], waarschuwingen: [] };
  const perId = new Map();
  lijst.forEach((n, i) => {
    const waar = `${pad} item ${i} (${n?.id ?? 'zonder id'})`;
    if (!n || !n.id || !n.tekst || !geldigeDatum(String(n.datum))) { fouten.push(`${waar}: id, datum (JJJJ-MM-DD) en tekst zijn verplicht`); return; }
    if (n.kanaal && !['profiel', 'pagina'].includes(n.kanaal)) fouten.push(`${waar}: kanaal moet profiel of pagina zijn`);
    if (!n.urlProfiel && !n.urlPagina) fouten.push(`${waar}: urlProfiel of urlPagina is verplicht`);
    perId.set(n.id, n); // bij een dubbel id wint het laatste item
  });
  const items = [...perId.values()].sort((a, b) => (b.datum > a.datum ? 1 : b.datum < a.datum ? -1 : 0));
  return { items, fouten, waarschuwingen: [] };
}

// ---------------------------------------------------------------- URL's
export const blogBasis = (taal) => (taal === 'nl' ? '/blog/' : `/${taal}/blog/`);
export const artikelPad = (s) => blogBasis(s.taal) + s.slug + '/';
const paginaPad = (taal, n) => (n === 1 ? blogBasis(taal) : `${blogBasis(taal)}${T[taal].paginaPad}/${n}/`);
const clusterPad = (taal, c) => `${blogBasis(taal)}${T[taal].onderwerpPad}/${c}/`;

// ---------------------------------------------------------------- markdown
function slugKop(tekst, gebruikt, n) {
  let id = tekst.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  if (!id) id = 'kop-' + n;
  let uniek = id;
  for (let i = 2; gebruikt.has(uniek); i++) uniek = `${id}-${i}`;
  gebruikt.add(uniek);
  return uniek;
}

// Markdown naar HTML. Een H1 in de tekst wordt H2 (de pagina heeft er al één).
// Ruwe HTML wordt als tekst getoond: de engine schrijft alleen markdown.
export function markdownNaarHtml(md) {
  const koppen = [];
  const gebruikt = new Set();
  const basis = new Renderer();
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const niveau = Math.min(Math.max(depth, 2), 4);
        const html = this.parser.parseInline(tokens);
        const platte = this.parser.parseInline(tokens, this.parser.textRenderer);
        const id = slugKop(platte, gebruikt, koppen.length + 1);
        if (niveau === 2) koppen.push({ id, tekst: platte });
        return `<h${niveau} id="${id}">${html}</h${niveau}>\n`;
      },
      html({ text }) { return esc(text); },
      table(token) { return `<div class="blog-tabel">${basis.table.call(this, token)}</div>\n`; },
      link({ href, title, tokens }) {
        const tekst = this.parser.parseInline(tokens);
        const extern = /^https?:\/\//.test(href) && !/^https:\/\/(www\.)?slim-geregeld\.nl/.test(href);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${extern ? ' rel="noopener"' : ''}>${tekst}</a>`;
      },
      image({ href, title, text }) {
        return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy">`;
      },
    },
  });
  const html = marked.parse(md);
  return { html, koppen };
}

// ---------------------------------------------------------------- datums
export function datumMooi(d, taal) {
  const loc = { nl: 'nl-NL', en: 'en-GB', ja: 'ja-JP' }[taal];
  return new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T00:00:00Z'));
}

// ---------------------------------------------------------------- HTML-bouwstenen
// Tailwind-klassen staan letterlijk in dit bestand, zodat tailwind.config.js
// (content: ./scripts/**/*.mjs) ze meeneemt in de gebouwde CSS.
function kop(taal, actief) {
  const t = T[taal];
  const link = ([h, l]) => `<a href="${h}" class="${h === actief ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors font-medium whitespace-nowrap">${esc(l)}</a>`;
  const mobiel = ([h, l]) => `<a href="${h}" class="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">${esc(l)}</a>`;
  const taalLinks = t.talen.map(([h, l, hl]) => `<a href="${h}" hreflang="${hl}" lang="${hl}" class="px-3 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">${esc(l)}</a>`).join('<span class="w-px h-4 bg-gray-200" aria-hidden="true"></span>');
  return `<header class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center gap-4 py-4">
<a href="${t.homePad}" class="flex items-center hover:opacity-80 transition-opacity"><img src="${padUrl('/Slim Geregeld Administratie - Volledig logo transparant 1200x628.png')}" alt="Slim Geregeld Administratie" class="h-12 w-auto" width="92" height="48"></a>
<nav class="hidden lg:flex items-center space-x-6 xl:space-x-8">${t.nav.map(link).join('')}</nav>
<span class="hidden xl:flex items-center whitespace-nowrap rounded-full border border-gray-200 text-sm font-semibold overflow-hidden">${taalLinks}</span>
<a href="${t.cta[0]}" class="hidden sm:inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg whitespace-nowrap">${esc(t.cta[1])}</a>
<details class="lg:hidden relative"><summary class="list-none cursor-pointer p-2 rounded-lg hover:bg-gray-100" aria-label="Menu"><svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></summary>
<nav class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2">${t.nav.map(mobiel).join('')}${t.talen.map(([h, l, hl]) => mobiel([h, l]).replace('<a ', `<a hreflang="${hl}" lang="${hl}" `)).join('')}${mobiel(t.cta)}</nav></details>
</div></div></header>`;
}

function voet(taal) {
  const t = T[taal];
  return `<footer class="bg-gray-900 text-white"><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8 text-sm">
<div><p class="text-lg font-semibold mb-3">Slim Geregeld Administratie</p><p class="text-gray-400 leading-relaxed">${esc(t.voet)}</p></div>
<div class="text-gray-400 space-y-1"><p><a class="hover:text-white" href="mailto:kyle@slim-geregeld.nl">kyle@slim-geregeld.nl</a></p><p><a class="hover:text-white" href="tel:+31621311043">+31 6 21 31 10 43</a></p><p>Koog aan de Zaan</p><p>KVK 92596991</p></div>
<div class="text-gray-400 space-y-1">${t.voetLinks.map(([h, l]) => `<p><a class="hover:text-white" href="${h}">${esc(l)}</a></p>`).join('')}</div>
</div></footer>`;
}

function avatar(a, groot) {
  const maat = groot ? 'w-16 h-16 text-xl' : 'w-9 h-9 text-sm';
  return a.foto
    ? `<img src="${padUrl(a.foto)}" alt="${esc(a.naam)}" class="${maat} rounded-full object-cover flex-shrink-0" width="${groot ? 64 : 36}" height="${groot ? 64 : 36}" loading="lazy">`
    : `<span class="${maat} rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center flex-shrink-0" aria-hidden="true">${esc(a.initialen)}</span>`;
}

// Opmaak van de artikeltekst. Klein en vast, in de merkkleur.
const ARTIKEL_CSS = `<style>
.blog-tekst{color:#1f2937;font-size:1.0625rem;line-height:1.75}
.blog-tekst>*+*{margin-top:1.1em}
.blog-tekst h2{font-size:1.5rem;line-height:1.3;font-weight:700;color:#111827;margin-top:2.2em;scroll-margin-top:6rem}
.blog-tekst h3{font-size:1.2rem;line-height:1.4;font-weight:600;color:#111827;margin-top:1.8em;scroll-margin-top:6rem}
.blog-tekst h4{font-weight:600;color:#111827;margin-top:1.5em}
.blog-tekst a{color:#2563eb;text-decoration:underline;text-underline-offset:2px}
.blog-tekst a:hover{color:#1d4ed8}
.blog-tekst ul{list-style:disc;padding-left:1.4em}
.blog-tekst ol{list-style:decimal;padding-left:1.4em}
.blog-tekst li+li{margin-top:.35em}
.blog-tekst strong{font-weight:600;color:#111827}
.blog-tekst blockquote{border-left:4px solid #2563eb;background:#eff6ff;padding:.75em 1em;border-radius:0 .5rem .5rem 0}
.blog-tekst code{background:#f3f4f6;padding:.1em .35em;border-radius:.25rem;font-size:.9em}
.blog-tekst pre{background:#f3f4f6;padding:1em;border-radius:.5rem;overflow-x:auto}
.blog-tekst pre code{background:none;padding:0}
.blog-tekst hr{border-color:#e5e7eb}
.blog-tekst img{border-radius:.75rem;max-width:100%;height:auto}
.blog-tabel{overflow-x:auto;border:1px solid #e5e7eb;border-radius:.75rem}
.blog-tabel table{width:100%;border-collapse:collapse;font-size:.95rem;line-height:1.5}
.blog-tabel th{background:#eff6ff;color:#111827;font-weight:600;text-align:left}
.blog-tabel th,.blog-tabel td{padding:.6em .9em;border-bottom:1px solid #e5e7eb;vertical-align:top}
.blog-tabel tr:last-child td{border-bottom:0}
[id]{scroll-margin-top:6rem}
details>summary::-webkit-details-marker{display:none}
</style>`;

// ---------------------------------------------------------------- pagina-sjabloon
// Het sjabloon is dist/index.html van vite (GTM, favicon, de gebouwde Tailwind-CSS).
// Het React-script gaat eruit: deze pagina's zijn af zonder JavaScript.
function pagina(sjabloon, { taal, titel, omschrijving, canonical, robots, alternates, graaf, afbeelding, type, lichaam }) {
  let h = sjabloon;
  const zet = (re, naar) => { if (!re.test(h)) throw new Error('blog: niet gevonden in sjabloon: ' + re); h = h.replace(re, naar); };
  h = h.replace(/\s*<script type="module"[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/g, '');
  h = h.replace(/\s*<link rel="modulepreload"[^>]*>/g, '');
  zet(/<html lang="[^"]*"/, `<html lang="${taal}"`);
  zet(/<title>[^<]*<\/title>/, `<title>${esc(titel)}</title>`);
  zet(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(omschrijving)}" />`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):url" content=")[^"]*"/g, `$1${canonical}"`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):title" content=")[^"]*"/g, `$1${esc(titel)}"`);
  h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):description" content=")[^"]*"/g, `$1${esc(omschrijving)}"`);
  h = h.replace(/(<meta property="og:type" content=")[^"]*"/, `$1${type}"`);
  if (afbeelding) {
    h = h.replace(/(<meta (?:property|name)="(?:og|twitter|linkedin):image" content=")[^"]*"/g, `$1${afbeelding}"`);
    h = h.replace(/\s*<meta property="og:image:(?:width|height)" content="[^"]*" \/>/g, '');
  }
  if (!canonical) h = h.replace(/\s*<meta (?:property|name)="(?:og|twitter|linkedin):url" content="[^"]*" \/>/g, '');
  const extra = [
    ...(canonical ? [`<link rel="canonical" href="${canonical}" />`] : []),
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:locale" content="${T[taal].locale}" />`,
    ...alternates.filter(([hl]) => hl !== 'x-default' && hl !== taal).map(([hl]) => `<meta property="og:locale:alternate" content="${LOCALE[hl]}" />`),
    '<meta property="og:site_name" content="Slim Geregeld" />',
    ...alternates.map(([hl, u]) => `<link rel="alternate" hreflang="${hl}" href="${u}" />`),
    ...(graaf ? [`<script type="application/ld+json">${JSON.stringify(graaf).replace(/</g, '\\u003c')}</script>`] : []),
    ARTIKEL_CSS,
  ];
  zet(/<\/head>/, '    ' + extra.join('\n    ') + '\n  </head>');
  zet(/<div id="root"><\/div>/, `<div id="root">${lichaam}</div>`);
  return h;
}

function schrijf(pad, html) {
  mkdirSync(dirname(pad), { recursive: true });
  writeFileSync(pad, html);
}

// ---------------------------------------------------------------- hoofdfunctie
export function bouwBlog({ sjabloon, dist, B, content = CONTENT }) {
  const { stukken, fouten, waarschuwingen } = leesBlogs(content);
  const nieuws = leesNieuws(content);
  for (const w of [...waarschuwingen, ...nieuws.waarschuwingen]) console.warn('blog: let op: ' + w);
  const alleFouten = [...fouten, ...nieuws.fouten];
  if (alleFouten.length) throw new Error('blog: inhoud klopt niet:\n  ' + alleFouten.join('\n  '));

  const A = auteurs(B);
  const abs = (p) => B + p;
  const zichtbaar = stukken.filter((s) => s.status !== 'ingetrokken');
  const nieuwsteEerst = (a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : a.slug.localeCompare(b.slug));
  const groepen = new Map();
  for (const s of zichtbaar) {
    if (!groepen.has(s.translationKey)) groepen.set(s.translationKey, []);
    groepen.get(s.translationKey).push(s);
  }
  // hreflang: alle versies van één stuk, wederkerig en zelfverwijzend, x-default naar EN (anders NL, anders JA).
  const alternatesVan = (s) => {
    const g = groepen.get(s.translationKey) || [s];
    if (g.length < 2) return [];
    const perTaal = Object.fromEntries(g.map((x) => [x.taal, x]));
    const def = perTaal.en || perTaal.nl || perTaal.ja;
    return [...TALEN.filter((t) => perTaal[t]).map((t) => [t, abs(artikelPad(perTaal[t]))]), ['x-default', abs(artikelPad(def))]];
  };
  const talenMetStukken = TALEN.filter((t) => zichtbaar.some((s) => s.taal === t));
  const overzichtTalen = TALEN.filter((t) => t !== 'ja' || talenMetStukken.includes('ja'));
  const overzichtAlternates = () => {
    const metInhoud = overzichtTalen.filter((t) => zichtbaar.some((s) => s.taal === t && s.status === 'live'));
    if (metInhoud.length < 2) return [];
    const def = metInhoud.includes('en') ? 'en' : metInhoud[0];
    return [...metInhoud.map((t) => [t, abs(blogBasis(t))]), ['x-default', abs(blogBasis(def))]];
  };

  const kruimelGraaf = (u, items) => ({ '@type': 'BreadcrumbList', '@id': u + '#breadcrumb', itemListElement: items.map(([naam, pad], i) => ({ '@type': 'ListItem', position: i + 1, name: naam, item: abs(pad) })) });
  const kruimelHtml = (items) => `<nav aria-label="Breadcrumb" class="text-sm text-gray-500 mb-6"><ol class="flex flex-wrap items-center gap-x-2 gap-y-1">${items.map(([naam, pad], i) => i < items.length - 1 ? `<li><a href="${pad}" class="hover:text-blue-600">${esc(naam)}</a></li><li aria-hidden="true">/</li>` : `<li class="text-gray-700 truncate max-w-xs">${esc(naam)}</li>`).join('')}</ol></nav>`;
  const persoon = (a, taal) => a.schema(taal);
  const paginaTitel = (titel) => (titel.length + ' | Slim Geregeld'.length <= TITEL_MAX ? `${titel} | Slim Geregeld` : titel);
  // Een clusterpagina bestaat alleen als het cluster live-stukken in die taal heeft; anders is het label geen link.
  const metClusterPagina = new Set(zichtbaar.filter((s) => s.status === 'live').map((s) => s.taal + '|' + s.cluster));
  const label = (c, taal) => metClusterPagina.has(taal + '|' + c)
    ? `<a href="${clusterPad(taal, c)}" class="inline-block rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 hover:bg-blue-100">${esc(clusterLabel(c, taal))}</a>`
    : `<span class="inline-block rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1">${esc(clusterLabel(c, taal))}</span>`;
  // Organization verwijst via founder naar Kyle, dus Kyle staat in elke graaf.
  const metKyle = (taal, ...rest) => [ORG, SITE, kyle(taal), ...rest.filter((k) => k['@id'] !== B + '/#kyle')];
  const metaRegel = (s) => {
    const a = A[s.author];
    return `<span>${esc(a.naam)}</span><span aria-hidden="true">·</span><time datetime="${s.date}">${esc(datumMooi(s.date, s.taal))}</time>`;
  };
  const kaart = (s) => `<li><article class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6">
<div class="mb-3">${label(s.cluster, s.taal)}</div>
<h2 class="text-xl font-bold text-gray-900 mb-2 leading-snug"><a href="${artikelPad(s)}" class="hover:text-blue-600">${esc(s.title)}</a></h2>
<p class="text-sm text-gray-500 mb-3 flex flex-wrap gap-x-2">${metaRegel(s)}</p>
<p class="text-gray-600 leading-relaxed">${esc(s.description)}</p></article></li>`;

  const geschreven = [];
  const sitemap = [];

  // ---------- artikelen
  for (const s of zichtbaar) {
    const t = T[s.taal];
    const a = A[s.author];
    const pad = artikelPad(s);
    const u = abs(pad);
    const { html, koppen } = markdownNaarHtml(s.tekst);
    const faqId = 'faq';
    const toc = [...koppen, ...(s.faq.length ? [{ id: faqId, tekst: t.faq }] : [])];
    const alternates = alternatesVan(s);
    const bijgewerkt = s.updated && s.updated !== s.date ? s.updated : null;
    const kruimels = [[t.home, t.homePad], [t.blog, blogBasis(s.taal)], [s.title, pad]];
    const verwant = zichtbaar.filter((x) => x !== s && x.taal === s.taal && x.cluster === s.cluster && x.status === 'live').sort(nieuwsteEerst).slice(0, 3);
    const dienst = CLUSTERS[s.cluster]?.dienst[s.taal];
    const afbeelding = s.image ? abs(padUrl(s.image)) : null;

    const graaf = {
      '@context': 'https://schema.org',
      '@graph': [
        ...metKyle(s.taal, persoon(a, s.taal)),
        { '@type': 'WebPage', '@id': u + '#webpage', url: u, name: s.title, description: s.description, inLanguage: s.taal, isPartOf: { '@id': B + '/#website' }, breadcrumb: { '@id': u + '#breadcrumb' }, datePublished: s.date, dateModified: s.updated || s.date, ...(afbeelding ? { primaryImageOfPage: afbeelding } : {}) },
        { '@type': 'Article', '@id': u + '#article', headline: s.title.slice(0, 110), description: s.description, inLanguage: s.taal, datePublished: s.date, dateModified: s.updated || s.date,
          author: { '@id': a.id }, publisher: { '@id': B + '/#org' }, mainEntityOfPage: { '@id': u + '#webpage' }, articleSection: clusterLabel(s.cluster, s.taal),
          ...(s.tags.length ? { keywords: s.tags.join(', ') } : {}), image: afbeelding || ORG.image },
        kruimelGraaf(u, kruimels),
        ...(s.faq.length ? [{ '@type': 'FAQPage', '@id': u + '#faq', inLanguage: s.taal, isPartOf: { '@id': u + '#webpage' }, mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
      ],
    };

    const lichaam = `${kop(s.taal, blogBasis(s.taal))}
<main class="bg-gradient-to-b from-blue-50 to-white"><div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
${kruimelHtml(kruimels)}
<article>
<div class="mb-4">${label(s.cluster, s.taal)}</div>
<h1 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">${esc(s.title)}</h1>
<p class="text-lg text-gray-600 leading-relaxed mb-6">${esc(s.description)}</p>
<div class="flex items-center gap-3 text-sm text-gray-600 mb-8">${avatar(a, false)}<div>
<p><span class="text-gray-500">${esc(t.door)}</span> <a href="#auteur" class="font-semibold text-gray-900 hover:text-blue-600">${esc(a.naam)}</a>, ${esc(a.functie[s.taal])}</p>
<p class="text-gray-500">${esc(t.gepubliceerd)} <time datetime="${s.date}">${esc(datumMooi(s.date, s.taal))}</time>${bijgewerkt ? `<span aria-hidden="true"> · </span>${esc(t.bijgewerkt)} <time datetime="${bijgewerkt}">${esc(datumMooi(bijgewerkt, s.taal))}</time>` : ''}</p>
</div></div>
${s.status === 'archief' ? `<p class="mb-8 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm px-4 py-3">${esc(t.archief)} <a href="${blogBasis(s.taal)}" class="underline">${esc(t.blog)}</a></p>` : ''}
${afbeelding ? `<img src="${padUrl(s.image)}" alt="${esc(s.title)}" class="w-full rounded-2xl shadow-sm mb-8" width="1200" height="628">` : ''}
${toc.length >= 2 ? `<nav aria-labelledby="inhoud-kop" class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-10"><p id="inhoud-kop" class="font-semibold text-gray-900 mb-2">${esc(t.inhoud)}</p><ol class="list-decimal pl-5 space-y-1 text-gray-700">${toc.map((k) => `<li><a href="#${k.id}" class="hover:text-blue-600">${esc(k.tekst)}</a></li>`).join('')}</ol></nav>` : ''}
<div class="blog-tekst">${html}</div>
${s.faq.length ? `<section class="mt-12" aria-labelledby="${faqId}"><h2 id="${faqId}" class="text-2xl font-bold text-gray-900 mb-4">${esc(t.faq)}</h2><div class="space-y-3">${s.faq.map((f) => `<div class="bg-white border border-gray-100 rounded-xl shadow-sm p-5"><h3 class="font-semibold text-gray-900 mb-2">${esc(f.q)}</h3><p class="text-gray-700 leading-relaxed">${esc(f.a)}</p></div>`).join('')}</div></section>` : ''}
</article>
<section id="auteur" class="mt-12 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex gap-4 items-start" aria-label="${esc(t.overAuteur)}">${avatar(a, true)}<div>
<p class="text-sm text-gray-500">${esc(t.overAuteur)}</p><p class="font-semibold text-gray-900"><a href="${a.url[s.taal]}" class="hover:text-blue-600">${esc(a.naam)}</a></p><p class="text-sm text-gray-600 mb-2">${esc(a.functie[s.taal])}</p>
<p class="text-gray-700 leading-relaxed">${esc(a.bio[s.taal])}</p></div></section>
${dienst ? `<section class="mt-8 rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white"><p class="text-xl font-bold mb-2">${esc(dienst[1])}</p><p class="text-blue-100 mb-5 leading-relaxed">${esc(dienst[2])}</p><a href="${dienst[0]}" class="inline-block bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50">${esc(dienst[3])}</a></section>` : ''}
${s.linkedin.length ? `<p class="mt-8 text-sm text-gray-600">${esc(t.linkedin)}: ${s.linkedin.map((l, i) => `<a href="${esc(l)}" rel="noopener" class="text-blue-600 underline">${esc(t.bekijkLinkedin)}${s.linkedin.length > 1 ? ' ' + (i + 1) : ''}</a>`).join(', ')}</p>` : ''}
${verwant.length ? `<section class="mt-12"><h2 class="text-2xl font-bold text-gray-900 mb-4">${esc(t.gerelateerd)}</h2><ul class="space-y-4">${verwant.map(kaart).join('')}</ul></section>` : ''}
</div></main>
${voet(s.taal)}`;

    schrijf(join(dist, pad.slice(1), 'index.html'), pagina(sjabloon, {
      taal: s.taal, titel: paginaTitel(s.title), omschrijving: s.description, canonical: u, robots: 'index, follow, max-image-preview:large',
      alternates, graaf, afbeelding, type: 'article', lichaam,
    }));
    geschreven.push(pad);
    sitemap.push({ loc: u, lastmod: s.updated || s.date, alternates });
  }

  // ---------- overzichten (nieuwste eerst, 12 per pagina, archief en ingetrokken niet)
  const overzicht = (taal, lijst, { pad1, padN, titel, omschrijving, h1, intro, kruimels, robotsAltijd, filterActief }) => {
    const t = T[taal];
    const paginas = Math.max(1, Math.ceil(lijst.length / PER_PAGINA));
    const clusters = [...new Set(zichtbaar.filter((s) => s.taal === taal && s.status === 'live').map((s) => s.cluster))].sort();
    for (let n = 1; n <= paginas; n++) {
      const pad = n === 1 ? pad1 : padN(n);
      const u = abs(pad);
      const deel = lijst.slice((n - 1) * PER_PAGINA, n * PER_PAGINA);
      const leeg = lijst.length === 0;
      const robots = robotsAltijd || (leeg ? 'noindex, follow' : 'index, follow');
      const pk = n === 1 ? kruimels : [...kruimels, [`${t.pagina} ${n}`, pad]];
      const graaf = { '@context': 'https://schema.org', '@graph': [...metKyle(taal),
        { '@type': 'CollectionPage', '@id': u + '#webpage', url: u, name: titel, description: omschrijving, inLanguage: taal, isPartOf: { '@id': B + '/#website' }, breadcrumb: { '@id': u + '#breadcrumb' },
          ...(deel.length ? { mainEntity: { '@type': 'ItemList', itemListElement: deel.map((s, i) => ({ '@type': 'ListItem', position: (n - 1) * PER_PAGINA + i + 1, url: abs(artikelPad(s)), name: s.title })) } } : {}) },
        kruimelGraaf(u, pk)] };
      const filters = clusters.length > 1 ? `<nav aria-label="${esc(t.onderwerp)}" class="flex flex-wrap gap-2 mb-8"><a href="${blogBasis(taal)}" class="rounded-full px-3 py-1 text-sm font-semibold ${!filterActief ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'}">${esc(t.alleOnderwerpen)}</a>${clusters.map((c) => `<a href="${clusterPad(taal, c)}" class="rounded-full px-3 py-1 text-sm font-semibold ${filterActief === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'}">${esc(clusterLabel(c, taal))}</a>`).join('')}</nav>` : '';
      const nav = paginas > 1 ? `<nav aria-label="${esc(t.pagina)}" class="flex items-center justify-between mt-10 text-sm font-semibold">${n > 1 ? `<a href="${n === 2 ? pad1 : padN(n - 1)}" rel="prev" class="text-blue-600 hover:underline">← ${esc(t.vorige)}</a>` : '<span></span>'}<span class="text-gray-500">${esc(t.pagina)} ${n} / ${paginas}</span>${n < paginas ? `<a href="${padN(n + 1)}" rel="next" class="text-blue-600 hover:underline">${esc(t.volgende)} →</a>` : '<span></span>'}</nav>` : '';
      const lichaam = `${kop(taal, blogBasis(taal))}
<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
${kruimelHtml(pk)}
<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${esc(h1)}</h1>
<p class="text-lg text-gray-600 mb-8 max-w-2xl">${esc(intro)}</p>
${filters}
${leeg ? `<p class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-gray-700">${esc(t.leeg)} <a href="${t.leegLink[0]}" class="text-blue-600 underline">${esc(t.leegLink[1])}</a></p>` : `<ul class="space-y-6">${deel.map(kaart).join('')}</ul>`}
${nav}
</div></main>
${voet(taal)}`;
      schrijf(join(dist, pad.slice(1), 'index.html'), pagina(sjabloon, {
        taal, titel: n === 1 ? titel : `${titel} (${t.pagina.toLowerCase()} ${n})`, omschrijving, canonical: u, robots,
        alternates: n === 1 && !filterActief ? overzichtAlternates() : [], graaf, afbeelding: null, type: 'website', lichaam,
      }));
      geschreven.push(pad);
      if (n === 1 && !filterActief && !leeg) sitemap.push({ loc: u, lastmod: lijst.reduce((m, s) => ((s.updated || s.date) > m ? (s.updated || s.date) : m), ''), alternates: overzichtAlternates() });
    }
  };

  for (const taal of overzichtTalen) {
    const t = T[taal];
    const live = zichtbaar.filter((s) => s.taal === taal && s.status === 'live').sort(nieuwsteEerst);
    overzicht(taal, live, {
      pad1: blogBasis(taal), padN: (n) => paginaPad(taal, n), titel: t.overzichtTitel, omschrijving: t.overzichtOmschrijving, h1: t.overzichtH1, intro: t.overzichtIntro,
      kruimels: [[t.home, t.homePad], [t.blog, blogBasis(taal)]],
    });
    // Per cluster een eigen overzicht (noindex: dun zolang een cluster weinig stukken heeft).
    for (const c of [...new Set(live.map((s) => s.cluster))]) {
      const lijst = live.filter((s) => s.cluster === c);
      const naam = clusterLabel(c, taal);
      overzicht(taal, lijst, {
        pad1: clusterPad(taal, c), padN: (n) => `${clusterPad(taal, c)}${t.paginaPad}/${n}/`, titel: `${naam} | ${t.blog} | Slim Geregeld`,
        omschrijving: t.overzichtOmschrijving, h1: `${t.blog}: ${naam}`, intro: t.overzichtIntro,
        kruimels: [[t.home, t.homePad], [t.blog, blogBasis(taal)], [naam, clusterPad(taal, c)]], robotsAltijd: 'noindex, follow', filterActief: c,
      });
    }
  }

  // ---------- ingetrokken: 410 met een korte pagina die naar het overzicht wijst
  const ingetrokken = stukken.filter((s) => s.status === 'ingetrokken');
  const regels = ingetrokken.flatMap((s) => {
    const p = artikelPad(s);
    return [`${p.slice(0, -1)}    /ingetrokken.html    410`, `${p}    /ingetrokken.html    410`];
  });
  schrijf(join(dist, 'ingetrokken.html'), pagina(sjabloon, {
    taal: 'nl', titel: 'Artikel ingetrokken | Slim Geregeld', omschrijving: 'Dit artikel is ingetrokken.', canonical: null, robots: 'noindex, follow', alternates: [],
    graaf: null, afbeelding: null, type: 'website',
    lichaam: `${kop('nl', '/blog/')}<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white"><div class="max-w-3xl mx-auto px-4 py-16 space-y-4 text-gray-700">
<h1 class="text-3xl font-bold text-gray-900">Dit artikel is ingetrokken</h1><p>De inhoud klopte niet meer en is daarom van de site gehaald. <a class="text-blue-600 underline" href="/blog/">Naar het blogoverzicht</a></p>
<p lang="en">This article has been withdrawn. <a class="text-blue-600 underline" href="/en/blog/">Go to the blog</a></p></div></main>${voet('nl')}`,
  }));
  const redirectsPad = join(dist, '_redirects');
  const redirects = readFileSync(redirectsPad, 'utf8');
  const MARKER = '# BLOG: ingetrokken artikelen (scripts/blog.mjs vult dit aan)';
  if (!redirects.includes(MARKER)) throw new Error('blog: marker ontbreekt in public/_redirects: ' + MARKER);
  writeFileSync(redirectsPad, redirects.replace(MARKER, [MARKER, ...regels].join('\n')));

  // ---------- auteurspagina's
  auteurPaginas({ A, zichtbaar, nieuwsteEerst, sjabloon, dist, abs, kruimelGraaf, kruimelHtml, kaart, geschreven, sitemap, metKyle });

  // ---------- 404: Netlify serveert dist/404.html met status 404 voor elke URL zonder bestand of regel
  schrijf(join(dist, '404.html'), pagina(sjabloon, {
    taal: 'nl', titel: 'Pagina niet gevonden | Slim Geregeld', omschrijving: 'Deze pagina bestaat niet (meer).', canonical: null, robots: 'noindex, follow', alternates: [],
    graaf: null, afbeelding: null, type: 'website',
    lichaam: `${kop('nl', '')}<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white"><div class="max-w-3xl mx-auto px-4 py-16 space-y-4 text-gray-700">
<h1 class="text-3xl font-bold text-gray-900">Deze pagina bestaat niet</h1><p>Het adres klopt niet of de pagina is verplaatst. <a class="text-blue-600 underline" href="/">Naar de homepage</a> · <a class="text-blue-600 underline" href="/blog/">Naar de blog</a> · <a class="text-blue-600 underline" href="/nieuws">Naar het nieuws</a></p>
<p lang="en">This page does not exist. <a class="text-blue-600 underline" href="/en/">Treaty services in English (DAFT, DJTT)</a></p></div></main>${voet('nl')}`,
  }));

  // ---------- llms.txt: clusters en de nieuwste 20 stukken
  const live = zichtbaar.filter((s) => s.status === 'live').sort(nieuwsteEerst);
  if (live.length) {
    const llmsPad = join(dist, 'llms.txt');
    const llms = readFileSync(llmsPad, 'utf8');
    const telling = {};
    for (const s of live) {
      telling[s.cluster] ??= {};
      telling[s.cluster][s.taal] = (telling[s.cluster][s.taal] || 0) + 1;
    }
    const taalNaam = { nl: 'Dutch', en: 'English', ja: 'Japanese' };
    const blok = ['## Blog', '', `Articles by Kyle Bouwmeester (Becon 781794) and Miguel Weema. Overviews: [Dutch](${abs('/blog/')}), [English](${abs('/en/blog/')})${talenMetStukken.includes('ja') ? `, [Japanese](${abs('/ja/blog/')})` : ''}.`, '', 'Topics:', '',
      ...Object.keys(telling).sort().map((c) => `- ${clusterLabel(c, 'en')} (${c}): ${Object.entries(telling[c]).map(([t, n]) => `${n} ${taalNaam[t]}`).join(', ')}`),
      '', 'Newest articles:', '',
      ...live.slice(0, 20).map((s) => `- [${s.title}](${abs(artikelPad(s))}) (${taalNaam[s.taal]}, ${s.updated || s.date}): ${s.description}`), '', ''].join('\n');
    writeFileSync(llmsPad, llms.includes('## Contact') ? llms.replace('## Contact', blok + '## Contact') : llms + '\n' + blok);
  }

  console.log(`blog: ${zichtbaar.length} artikelen, ${ingetrokken.length} ingetrokken, ${geschreven.length} pagina's geschreven (bron ${content})`);
  return { stukken, nieuws: nieuws.items, sitemap };
}

// Auteurspagina's in het Nederlands en Engels: wie de auteur is, de Becon-registratie,
// KVK, profielen en de lijst met artikelen. Een auteur zonder live-artikelen (Miguel
// tot zijn eerste stuk) krijgt de pagina wel, maar op noindex en buiten de sitemap.
function auteurPaginas({ A, zichtbaar, nieuwsteEerst, sjabloon, dist, abs, kruimelGraaf, kruimelHtml, kaart, geschreven, sitemap, metKyle }) {
  const TEKST = {
    nl: { artikelen: 'Artikelen', geen: 'Nog geen artikelen.', feiten: 'Gegevens', profielen: 'Profielen', titel: (n) => `${n}, auteur | Slim Geregeld`, kruimels: [['Home', '/'], ['Over ons', '/over-ons']] },
    en: { artikelen: 'Articles', geen: 'No articles yet.', feiten: 'Details', profielen: 'Profiles', titel: (n) => `${n}, author | Slim Geregeld`, kruimels: [['Treaty services', '/en/']] },
  };
  for (const [sleutel, a] of Object.entries(A)) {
    const stukken = zichtbaar.filter((s) => s.author === sleutel && s.status === 'live').sort(nieuwsteEerst);
    const index = stukken.length > 0 || sleutel === 'kyle';
    const nieuwste = stukken.reduce((m, s) => ((s.updated || s.date) > m ? (s.updated || s.date) : m), AUTEURS_GEWIJZIGD);
    const alternates = index ? [['nl', abs(AUTEURPADEN[sleutel].nl)], ['en', abs(AUTEURPADEN[sleutel].en)], ['x-default', abs(AUTEURPADEN[sleutel].en)]] : [];
    for (const taal of ['nl', 'en']) {
      const t = TEKST[taal];
      const pad = AUTEURPADEN[sleutel][taal];
      const u = abs(pad);
      const kruimels = [...t.kruimels, [a.naam, pad]];
      const omschrijving = `${a.naam}, ${a.functie[taal]} bij Slim Geregeld Administratie.`.slice(0, 155);
      const persoonKnoop = a.schema(taal);
      const graaf = { '@context': 'https://schema.org', '@graph': [...metKyle(taal, persoonKnoop),
        { '@type': 'ProfilePage', '@id': u + '#webpage', url: u, name: t.titel(a.naam), description: omschrijving, inLanguage: taal, isPartOf: { '@id': SITE['@id'] },
          breadcrumb: { '@id': u + '#breadcrumb' }, mainEntity: { '@id': persoonKnoop['@id'] }, dateModified: nieuwste,
          ...(stukken.length ? { hasPart: stukken.map((s) => ({ '@id': abs(artikelPad(s)) + '#article' })) } : {}) },
        kruimelGraaf(u, kruimels)] };
      const feiten = (a.feiten[taal] || []).map(([k, v]) => `<div class="flex flex-col sm:flex-row sm:gap-3"><dt class="font-semibold text-gray-900 sm:w-56">${esc(k)}</dt><dd class="text-gray-700">${esc(v)}</dd></div>`).join('');
      const lichaam = `${kop(taal, '')}
<main class="min-h-screen bg-gradient-to-b from-blue-50 to-white"><div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
${kruimelHtml(kruimels)}
<div class="flex items-center gap-4 mb-6">${avatar(a, true)}<div><h1 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">${esc(a.naam)}</h1><p class="text-lg text-gray-600">${esc(a.functie[taal])}</p></div></div>
<p class="text-gray-700 leading-relaxed mb-8">${esc(a.bio[taal])}</p>
<section class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8"><h2 class="text-xl font-bold text-gray-900 mb-4">${esc(t.feiten)}</h2><dl class="space-y-2">${feiten}</dl>
${a.links.length ? `<p class="mt-4 flex flex-wrap gap-x-4 gap-y-1">${a.links.map(([h, l]) => `<a href="${esc(h)}"${/^https?:/.test(h) ? ' rel="me noopener"' : ''} class="text-blue-600 underline">${esc(l)}</a>`).join('')}</p>` : ''}</section>
<section><h2 class="text-2xl font-bold text-gray-900 mb-4">${esc(t.artikelen)}</h2>${stukken.length ? `<ul class="space-y-6">${stukken.map(kaart).join('')}</ul>` : `<p class="text-gray-700">${esc(t.geen)}</p>`}</section>
</div></main>
${voet(taal)}`;
      schrijf(join(dist, pad.slice(1), 'index.html'), pagina(sjabloon, {
        taal, titel: t.titel(a.naam), omschrijving, canonical: u, robots: index ? 'index, follow' : 'noindex, follow',
        alternates, graaf, afbeelding: null, type: 'profile', lichaam,
      }));
      geschreven.push(pad);
      if (index) sitemap.push({ loc: u, lastmod: nieuwste, alternates });
    }
  }
}

// ---------------------------------------------------------------- /nieuws als statische HTML
// Dezelfde opbouw als src/components/Nieuws.tsx, zodat crawlers de posts als tekst lezen.
export function alineas(tekst) {
  return String(tekst).trim().split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);
}
export function nieuwsHtml(items, blogs) {
  const bestaat = new Set(blogs.filter((s) => s.status !== 'ingetrokken').map((s) => s.taal + '/' + s.slug));
  return items.map((n) => {
    const hoofd = n.urlProfiel || n.urlPagina;
    const taal = n.taal || 'nl';
    const blog = n.blogSlug && bestaat.has(taal + '/' + n.blogSlug) ? blogBasis(taal) + n.blogSlug + '/' : null;
    const kopTekst = n.titel || alineas(n.tekst)[0].split('\n')[0];
    return `<article style="margin:0 0 2.5rem"${taal !== 'nl' ? ` lang="${esc(taal)}"` : ''}>
<h2>${esc(kopTekst)}</h2>
<p><time datetime="${esc(n.datum)}">${esc(datumMooi(n.datum, 'nl'))}</time></p>
${n.afbeelding ? `<img src="${esc(n.afbeelding)}" alt="${esc(kopTekst)}" loading="lazy" decoding="async" style="max-width:100%;height:auto">` : ''}
${alineas(n.tekst).map((a) => `<p>${esc(a).replace(/\n/g, '<br>')}</p>`).join('')}
<p><a href="${esc(hoofd)}" rel="noopener">Bekijk op LinkedIn</a>${n.urlPagina && n.urlProfiel ? ` · <a href="${esc(n.urlPagina)}" rel="noopener">Bekijk op de bedrijfspagina</a>` : ''}${blog ? ` · <a href="${blog}">Lees het hele stuk</a>` : ''}</p>
</article>`;
  }).join('\n');
}
