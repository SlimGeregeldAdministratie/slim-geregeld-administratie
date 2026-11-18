import { defineConfig } from 'astro/config';

// Nieuwe site (herbouw). Staat los van de huidige Vite/React-build in de
// hoofdmap tot de overstap. Zie ../../slim-geregeld-ontwerp/structuur.md.
export default defineConfig({
  site: 'https://slim-geregeld.nl',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
