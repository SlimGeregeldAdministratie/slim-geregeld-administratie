// Blog, nieuws, auteurs en downloads voor de Astro-pagina's. Leest één keer
// content/ in (via blog.mjs, dezelfde controles als de oude build) en geeft de
// pagina's hun paden en gegevens. Klopt de inhoud niet, dan stopt de build,
// net als vroeger: Netlify houdt dan de vorige versie live.
import {
  leesBlogs, leesNieuws, markdownNaarHtml, datumMooi, CLUSTERS, clusterLabel, T, auteurs,
  DOWNLOADS, ONDERWERPEN, blogBasis, artikelPad, alineas, youtubeId, TITEL_MAX,
} from './blog.mjs';
import { ORG, SITE, kyle, AUTEURPADEN } from './entiteiten.mjs';

export { markdownNaarHtml, datumMooi, CLUSTERS, clusterLabel, T, DOWNLOADS, ONDERWERPEN, blogBasis, artikelPad, alineas, youtubeId, AUTEURPADEN };
export const B = 'https://slim-geregeld.nl';
export const PER_PAGINA = 12;

const blogs = leesBlogs();
const nieuws = leesNieuws();
const fouten = [...blogs.fouten, ...nieuws.fouten];
if (fouten.length) throw new Error('inhoud: content/ klopt niet:\n  ' + fouten.join('\n  '));

export const A = auteurs(B);
// In de nieuwe site staat de profielfoto onder /img.
A.kyle.foto = '/img/kyle-profiel.jpg';

export const STUKKEN = blogs.stukken;
export const zichtbaar = STUKKEN.filter((s) => s.status !== 'ingetrokken');
export const nieuwsteEerst = (a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : a.slug.localeCompare(b.slug));
export const liveIn = (taal) => zichtbaar.filter((s) => s.taal === taal && s.status === 'live').sort(nieuwsteEerst);
export const NIEUWS = nieuws.items;

export const paginaPad = (taal, n) => (n === 1 ? blogBasis(taal) : `${blogBasis(taal)}${T[taal].paginaPad}/${n}/`);
export const clusterPad = (taal, c) => `${blogBasis(taal)}${T[taal].onderwerpPad}/${c}/`;
const metClusterPagina = new Set(zichtbaar.filter((s) => s.status === 'live').map((s) => s.taal + '|' + s.cluster));
export const clusterHeeftPagina = (taal, c) => metClusterPagina.has(taal + '|' + c);
export const paginaTitel = (titel) => (titel.length + ' | Slim Geregeld'.length <= TITEL_MAX ? `${titel} | Slim Geregeld` : titel);

// Dienstlinks onder artikelen: de oude paden wijzen in de nieuwe site naar de
// nieuwe pagina's. De teksten blijven die van CLUSTERS.
const NIEUW_PAD = { '/pakketten': '/tarieven', '/daft/#pricing': '/en/compliance-plan/', '/djtt/ja/#pricing': '/djtt/ja/' };
export function dienstVan(s) {
  const d = CLUSTERS[s.cluster]?.dienst[s.taal];
  return d ? [NIEUW_PAD[d[0]] || d[0], d[1], d[2], d[3]] : null;
}

// hreflang: alle taalversies van één stuk (translationKey).
const groepen = new Map();
for (const s of zichtbaar) {
  if (!groepen.has(s.translationKey)) groepen.set(s.translationKey, []);
  groepen.get(s.translationKey).push(s);
}
export function alternatiefVan(s) {
  const g = groepen.get(s.translationKey) || [s];
  if (g.length < 2) return {};
  return Object.fromEntries(g.map((x) => [x.taal, artikelPad(x)]));
}
export function overzichtAlternatief() {
  const uit = {};
  for (const t of ['nl', 'en', 'ja']) if (liveIn(t).length) uit[t] = blogBasis(t);
  return Object.keys(uit).length > 1 ? uit : {};
}

export const metKyle = (taal, ...rest) => [ORG, SITE, kyle(taal), ...rest.filter((k) => k['@id'] !== B + '/#kyle')];
export const kruimelGraaf = (u, items) => ({ '@type': 'BreadcrumbList', '@id': u + '#breadcrumb', itemListElement: items.map(([naam, pad], i) => ({ '@type': 'ListItem', position: i + 1, name: naam, item: B + pad })) });
export const ld = (graaf) => JSON.stringify({ '@context': 'https://schema.org', '@graph': graaf }).replace(/</g, '\\u003c');

// Alle routes onder /blog/, /en/blog/ of /ja/blog/ voor getStaticPaths.
export function blogPaden(taal) {
  const t = T[taal];
  if (!zichtbaar.some((s) => s.taal === taal) && taal === 'ja') return [];
  const uit = [];
  const live = liveIn(taal);
  const overzicht = (lijst, filter, basisSeg) => {
    const paginas = Math.max(1, Math.ceil(lijst.length / PER_PAGINA));
    for (let n = 1; n <= paginas; n++) {
      const seg = [...basisSeg, ...(n > 1 ? [t.paginaPad, String(n)] : [])];
      uit.push({ params: { pad: seg.length ? seg.join('/') : undefined }, props: { soort: 'overzicht', taal, n, paginas, lijst, filter } });
    }
  };
  overzicht(live, null, []);
  for (const c of [...new Set(live.map((s) => s.cluster))]) overzicht(live.filter((s) => s.cluster === c), c, [t.onderwerpPad, c]);
  for (const s of zichtbaar.filter((x) => x.taal === taal)) uit.push({ params: { pad: s.slug }, props: { soort: 'artikel', taal, slug: s.slug } });
  return uit;
}
export const stukVan = (taal, slug) => zichtbaar.find((s) => s.taal === taal && s.slug === slug);
export function verwantVan(s) {
  return zichtbaar.filter((x) => x !== s && x.taal === s.taal && x.cluster === s.cluster && x.status === 'live').sort(nieuwsteEerst).slice(0, 3);
}
export function downloadVan(s) {
  const dl = DOWNLOADS.downloads.find((d) => d.clusters.includes(s.cluster));
  if (!dl) return null;
  return dl[s.taal] || dl.en;
}

// Nieuws: /nieuws/, /nieuws/2/, /nieuws/onderwerp/<c>/ en /nieuws/onderwerp/<c>/2/.
// Nieuwsoverzichten per taal: /nieuws/ (nl, met onderwerppagina's) en /en/news/
// (en, zonder onderwerppagina's). Posts in de andere taal gaan per pagina mee als
// "ander": op datum op de plek waar ze horen, verborgen tot de bezoeker ze aanzet.
export function nieuwsPaden(taal = 'nl') {
  const { perPagina, minIndex, clusters } = ONDERWERPEN;
  const vanTaal = (x) => (x.taal || 'nl') === taal;
  const eigen = NIEUWS.filter(vanTaal), ander = NIEUWS.filter((x) => !vanTaal(x));
  const lijsten = [{ seg: [], items: eigen, anders: ander, cluster: null },
    ...(taal === 'nl' ? Object.keys(clusters).map((c) => ({ seg: ['onderwerp', c], items: eigen.filter((x) => x.cluster === c), anders: ander.filter((x) => x.cluster === c), cluster: c })).filter((l) => l.items.length) : [])];
  const aanwezig = lijsten.filter((l) => l.cluster).map((l) => l.cluster);
  const uit = [];
  for (const l of lijsten) {
    const paginas = Math.max(1, Math.ceil(l.items.length / perPagina));
    const basis = (taal === 'nl' ? '/nieuws/' : '/en/news/') + (l.seg.length ? l.seg.join('/') + '/' : '');
    for (let n = 1; n <= paginas; n++) {
      const seg = [...l.seg, ...(n > 1 ? [String(n)] : [])];
      const items = l.items.slice((n - 1) * perPagina, n * perPagina);
      // Datumvenster van deze pagina: nieuwer dan het laatste item van deze pagina
      // (laatste pagina: alles ouder ook) en niet nieuwer dan dat van de vorige.
      const boven = n === 1 ? '9999' : l.items[(n - 1) * perPagina - 1].datum;
      const onder = n === paginas ? '0000' : items[items.length - 1].datum;
      const erbij = l.anders.filter((x) => x.datum <= boven && x.datum > onder && !(n > 1 && x.datum === boven));
      const rijen = [...items.map((x) => ({ x, ander: false })), ...erbij.map((x) => ({ x, ander: true }))].sort((p, q) => (p.x.datum < q.x.datum ? 1 : p.x.datum > q.x.datum ? -1 : 0));
      uit.push({ params: { pad: seg.length ? seg.join('/') : undefined }, props: {
        n, paginas, basis, cluster: l.cluster, aanwezig, index: !l.cluster || l.items.length >= minIndex,
        items, rijen, aantalAnder: l.anders.length, taal,
      } });
    }
  }
  return uit;
}
const bestaandeBlogs = new Set(zichtbaar.map((s) => s.taal + '/' + s.slug));
export const blogVanNieuws = (n) => (n.blogSlug && bestaandeBlogs.has((n.taal || 'nl') + '/' + n.blogSlug) ? blogBasis(n.taal || 'nl') + n.blogSlug + '/' : null);
