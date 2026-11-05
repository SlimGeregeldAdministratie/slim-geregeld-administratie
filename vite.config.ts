import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// De nieuwsposts staan in content/nieuws/nieuws.json (n8n schrijft daarheen).
// BLOG_CONTENT_DIR wijst de build naar testinhoud, zie scripts/test-blog.mjs.
const content = resolve(__dirname, process.env.BLOG_CONTENT_DIR || 'content');
const nieuwsBestand = resolve(content, 'nieuws/nieuws.json');

// Het aantal impressies per post gaat niet mee naar de browser: de app krijgt
// alleen een rang (1 = meest gelezen) voor de sortering "Meest gelezen".
// Posts zonder impressies krijgen geen rang en komen daar achteraan.
function nieuwsZonderImpressies(): Plugin {
  return {
    name: 'nieuws-zonder-impressies',
    enforce: 'pre',
    load(id) {
      // Vite geeft het echte pad (op macOS /private/var/... voor /var/...), dus vergelijk op de bestandsnaam.
      const bestand = id.split('?')[0];
      if (!bestand.endsWith('/nieuws/nieuws.json')) return null;
      const lijst = JSON.parse(readFileSync(bestand, 'utf8')) as Array<Record<string, unknown>>;
      const gemeten = lijst.filter((n) => typeof n.impressies === 'number').sort((a, b) => (b.impressies as number) - (a.impressies as number));
      const rang = new Map(gemeten.map((n, i) => [n, i + 1]));
      const schoon = lijst.map((n) => {
        const { impressies: _weg, ...rest } = n;
        void _weg;
        return rang.has(n) ? { ...rest, rang: rang.get(n) } : rest;
      });
      return JSON.stringify(schoon);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nieuwsZonderImpressies(), react()],
  resolve: {
    alias: { '@nieuws': nieuwsBestand },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
