import { defineConfig } from 'astro/config';
import { cpSync, existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Inhoud die buiten nieuw/ leeft, omdat de n8n-content-engine daar via de
// GitHub-API naartoe schrijft (zie ../content/README.md). Bij elke build gaat
// een kopie naar public/, zodat de pagina's ze als gewone bestanden serveren.
// De kopieën staan in .gitignore; de bron blijft buiten nieuw/.
const KOPIEEN = [
  ['../public/blog/img', 'public/blog/img'],
  ['../content/nieuws/media', 'public/nieuws/media'],
  ['../public/downloads', 'public/downloads'],
];

const B = 'https://slim-geregeld.nl';

function alleHtml(map, uit = []) {
  for (const naam of readdirSync(map)) {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) alleHtml(pad, uit);
    else if (naam.endsWith('.html')) uit.push(pad);
  }
  return uit;
}

const inhoud = {
  name: 'slim-geregeld-inhoud',
  hooks: {
    'astro:config:setup': () => {
      for (const [van, naar] of KOPIEEN) {
        if (existsSync(van)) cpSync(van, naar, { recursive: true, force: true });
      }
      // Nieuwsfoto's met een eigen pad (bijv. /SGA Foto 4 (1).jpg) staan nog in de
      // public-map van de oude site; die gaan ook mee.
      try {
        for (const n of JSON.parse(readFileSync('../content/nieuws/nieuws.json', 'utf8'))) {
          const a = String(n.afbeelding || '');
          if (!a.startsWith('/') || a.startsWith('/nieuws/media/')) continue;
          const rel = decodeURIComponent(a.slice(1));
          if (existsSync('../public/' + rel) && !existsSync('public/' + rel)) cpSync('../public/' + rel, 'public/' + rel);
        }
      } catch (e) { console.warn('inhoud: nieuwsfoto\'s niet gekopieerd: ' + e.message); }
    },
    'astro:build:done': async ({ dir }) => {
      const dist = fileURLToPath(dir);
      // 1. Ingetrokken blogartikelen geven 410 met een korte pagina.
      const { leesBlogs, artikelPad } = await import('./src/lib/blog.mjs');
      const weg = leesBlogs().stukken.filter((s) => s.status === 'ingetrokken')
        .flatMap((s) => { const p = artikelPad(s); return [`${p.slice(0, -1)}    /ingetrokken/    410`, `${p}    /ingetrokken/    410`]; });
      const rPad = join(dist, '_redirects');
      const bestaand = existsSync(rPad) ? readFileSync(rPad, 'utf8') : '';
      if (weg.length) writeFileSync(rPad, bestaand + (bestaand && !bestaand.endsWith('\n') ? '\n' : '') + '# Ingetrokken blogartikelen (astro.config.mjs)\n' + weg.join('\n') + '\n');

      // 2. Sitemap uit de gebouwde pagina's zelf: alles met een canonical en zonder
      //    noindex, met de hreflang-regels uit de pagina. Zo kan geen pagina
      //    vergeten worden en staat er niets in wat niet geïndexeerd mag worden.
      const regels = [];
      for (const pad of alleHtml(dist)) {
        const html = readFileSync(pad, 'utf8');
        if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
        const can = html.match(/<link rel="canonical" href="([^"]+)"/);
        if (!can || !can[1].startsWith(B)) continue;
        const gewijzigd = html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})/);
        const alt = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
        regels.push({ loc: can[1], lastmod: gewijzigd && gewijzigd[1], alt });
      }
      regels.sort((a, b) => a.loc.localeCompare(b.loc));
      const esc = (s) => s.replace(/&/g, '&amp;');
      writeFileSync(join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n'
        + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + regels.map((r) => `<url><loc>${esc(r.loc)}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ''}`
          + r.alt.map((a) => `<xhtml:link rel="alternate" hreflang="${a[1]}" href="${esc(a[2])}"/>`).join('') + '</url>').join('\n')
        + '\n</urlset>\n');
      console.log(`inhoud: sitemap met ${regels.length} pagina's, ${weg.length / 2} ingetrokken artikelen`);
    },
  },
};

// Nieuwe site (herbouw). Staat los van de huidige Vite/React-build in de
// hoofdmap tot de overstap. Zie ../../slim-geregeld-ontwerp/structuur.md.
export default defineConfig({
  site: 'https://slim-geregeld.nl',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [inhoud],
});
