/** @type {import('tailwindcss').Config} */
export default {
  // scripts/*.mjs: de statische blogpagina's (scripts/blog.mjs) gebruiken dezelfde CSS.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './scripts/**/*.mjs'],
  theme: {
    extend: {},
  },
  plugins: [],
};
