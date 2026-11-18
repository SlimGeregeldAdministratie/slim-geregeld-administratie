// Reviews en scores. Cijfers handmatig bijwerken (of later via n8n bij de build).
// Bron: Google-bedrijfsprofiel en Moneybird-expertpagina, stand 18-11-2026.

export const google = {
  score: '4,9',
  aantal: 17,
  bijgewerkt: '2026-11-18',
  profiel: 'https://g.page/r/CUGYPwNhlYG-EAE',
};

export const moneybird = {
  adviser: 'kyle-slim-geregeld-administratie',
  score: '5,0',
  aantal: 9,
};

export type Review = {
  naam: string;
  wat: string;
  tekst: string;
  sterren: number;
  foto?: string;
  link?: string;
  taal: 'nl' | 'en';
};

export const reviews: Review[] = [
  { naam: 'Jeremy Gomes', wat: 'Gomes Media, marketeer', tekst: 'Maakt het boekhouden veel gemakkelijker en ook sneller! Onderweg kan ik vrij rap wat facturen versturen door een simpel appje. Top systeem.', sterren: 5, foto: '/img/reviews/jeremy.png', link: 'https://maps.app.goo.gl/4hzddgC4sesnrEkZ8', taal: 'nl' },
  { naam: 'Umesh ten Kate', wat: 'personal trainer', tekst: 'Slim Geregeld is efficiënt en overzichtelijk. Verder begeleidt Kyle je op een ondersteunende en begripvolle manier.', sterren: 5, foto: '/img/reviews/umesh.png', link: 'https://maps.app.goo.gl/gQpY9LhWrDCwau2v7', taal: 'nl' },
  { naam: 'Dany Cramer', wat: 'OMNI fit coaching', tekst: 'Gebruik het om o.a. mijn facturen te maken! Alles was heel duidelijk en scheelt super veel tijd. Aanrader!', sterren: 5, foto: '/img/reviews/dany.png', link: 'https://maps.app.goo.gl/HZJpLdfC8V7X1DwN7', taal: 'nl' },
  { naam: 'Andries', wat: 'timmerman', tekst: 'Prima, lekker makkelijk zo.', sterren: 5, foto: '/img/reviews/andries.png', link: 'https://maps.app.goo.gl/cz2LpkpYzyJQTiyg6', taal: 'nl' },
];
