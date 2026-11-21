// Reviews en scores, stand 19-11-2026. Teksten letterlijk van Google en de
// Moneybird-expertpagina. Scores later live via n8n (zie Reviews.astro).
// Niet tonen: Serena Arendzen (partner) en de anonieme Moneybird-review van
// 26-10-2026 (familie). Beide zijn echte reviews, maar een belangenconflict.

export const google = {
  score: '4,9',
  aantal: 17,
  profiel: 'https://g.page/r/CUGYPwNhlYG-EAE',
};

export const moneybird = {
  adviser: 'kyle-slim-geregeld-administratie',
  score: '5,0',
  aantal: 10,
  profiel: 'https://www.moneybird.nl/experts/slim-geregeld-administratie/',
};

export type Review = {
  naam: string;
  bedrijf?: string;   // alleen als het iets toevoegt aan de naam
  branche?: string;   // wat voor ondernemer, kort
  tekst: string;
  sterren: number;
  bron: 'google' | 'moneybird';
  foto?: string;
  link?: string;
  datum?: string;
  taal: 'nl' | 'en';
};

export const reviews: Review[] = [
  { bron: 'moneybird', naam: 'Benthe Lokhorst', bedrijf: 'ProProject', branche: 'consultant, bv', datum: '2026-10-15', sterren: 5, taal: 'nl',
    tekst: 'Begin dit jaar ben ik de samenwerking gestart met Kyle van SlimGeregeld Administratie voor de boekhouding van mijn BV. Kyle is betrokken, communiceert proactief en komt zijn afspraken na. Hij ondersteunt waar nodig, denkt mee en geeft waardevol advies wanneer hij mogelijkheden zie. Een prettige en betrouwbare samenwerking. Zeker een aanrader!' },
  { bron: 'google', naam: 'Jeremy Gomes', bedrijf: 'Gomes Media', branche: 'online marketeer', sterren: 5, taal: 'nl', foto: '/img/reviews/jeremy.png', link: 'https://maps.app.goo.gl/4hzddgC4sesnrEkZ8',
    tekst: 'Maakt het boekhouden veel gemakkelijker en ook sneller! Onderweg kan ik vrij rap wat facturen versturen door een simpel appje. Top systeem.' },
  { bron: 'moneybird', naam: 'Mirte Groen', bedrijf: 'Zusjes Groen', branche: 'e-commerce', datum: '2026-09-21', sterren: 5, taal: 'nl',
    tekst: 'Kyle en Slim Geregeld Administratie hebben ons super goed geholpen om Moneybird op te zetten én beter onze administratie te doen. Wij zijn er erg blij mee.' },
  { bron: 'google', naam: 'Umesh ten Kate', bedrijf: 'Umi Sports', branche: 'personal trainer', sterren: 5, taal: 'nl', foto: '/img/reviews/umesh.png', link: 'https://maps.app.goo.gl/gQpY9LhWrDCwau2v7',
    tekst: 'Slim Geregeld is efficiënt en overzichtelijk. Verder begeleidt Kyle je op een ondersteunende en begripvolle manier.' },
  { bron: 'moneybird', naam: 'Dany Cramer', bedrijf: 'Cramer D Events', branche: 'evenementen', datum: '2026-07-29', sterren: 5, taal: 'nl',
    tekst: 'Ik ben al een aantal jaar zzp’er, hierdoor heb ik altijd moeite gehad met het bijhouden van mijn financiën en alles wat hierbij komt kijken. Sinds ik met Kyle werk is alles overzichtelijk en duidelijk. Hij communiceert goed en staat altijd paraat wanneer ik dat nodig heb. Ik kan Kyle en “Slim geregeld admin” aan iedereen aanraden!' },
  { bron: 'moneybird', naam: 'Make Bouw', branche: 'bouwbedrijf', datum: '2026-10-30', sterren: 5, taal: 'nl',
    tekst: 'Super fijne samenwerking, altijd duidelijk en snel!' },
  { bron: 'google', naam: 'Andries Min', bedrijf: 'Marimin', branche: 'timmerman', sterren: 5, taal: 'nl', foto: '/img/reviews/andries.png', link: 'https://maps.app.goo.gl/cz2LpkpYzyJQTiyg6',
    tekst: 'Prima, lekker makkelijk zo.' },
  { bron: 'moneybird', naam: 'Anoniem', datum: '2026-11-17', sterren: 5, taal: 'en',
    tekst: 'From the very beginning, he took the time to clearly explain the services he offered, the process involved, and the fee structure, which made me feel confident and comfortable throughout the entire process. … What particularly stood out to me was his transparency regarding any additional services and associated costs. …' },
];
