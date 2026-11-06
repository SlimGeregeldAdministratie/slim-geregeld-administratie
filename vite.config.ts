import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// De nieuwsposts staan in content/nieuws/nieuws.json (n8n schrijft daarheen).
// BLOG_CONTENT_DIR wijst de build naar testinhoud, zie scripts/test-blog.mjs.
const content = resolve(__dirname, process.env.BLOG_CONTENT_DIR || 'content');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@nieuws': resolve(content, 'nieuws/nieuws.json') },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
