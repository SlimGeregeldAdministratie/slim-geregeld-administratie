// Reviews en scores, stand 22-11-2026. Teksten letterlijk van Google en de
// Moneybird-expertpagina. 'vertaling' is de Engelse vertaling van Google zelf;
// die tonen we op Engelse pagina's met het label "Translated by Google".
// Scores later live via n8n (zie GoogleReviews.astro).
// Niet tonen: Serena Arendzen (partner) en de anonieme Moneybird-review van
// 26-10-2026 (familie), allebei een belangenconflict. Ook niet: Iona Susanto
// (4 sterren, kanttekening) en Santino Heij (gaat over NettoCheck, niet de dienst).

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
  vertaling?: string; // Engelse vertaling door Google, voor Engelse pagina's
};

export const reviews: Review[] = [
  // Engelstalig (verdragsklanten eerst)
  { bron: 'google', naam: 'Barry Sims', branche: 'DAFT opening balance sheet', sterren: 5, taal: 'en',
    tekst: 'Kyle was extremely fast, efficient, accurate and personable. I am extremely happy with his service and would recommend him for others needing an opening balance sheet for their DAFT businesses.' },
  { bron: 'google', naam: 'Orlando Guerra', branche: 'DAFT opening balance sheet', sterren: 5, taal: 'en',
    tekst: "Very happy with the quick and precise services provided by Slim Geregeld in regards to establishing opening balances for my DAFT visa. Highly recommend Kyle's bookkeeping services in any regards!" },
  { bron: 'google', naam: 'Jozsa-Fetzer Huba', branche: 'tax recovery project', sterren: 5, taal: 'en',
    tekst: 'I contacted Kyle with a tax recovery project. He was constructive, responsive, he worked extensively and delivered beyond expectations. I warmly recommend him!' },
  { bron: 'moneybird', naam: 'Anoniem', datum: '2026-11-17', sterren: 5, taal: 'en',
    tekst: 'From the very beginning, he took the time to clearly explain the services he offered, the process involved, and the fee structure, which made me feel confident and comfortable throughout the entire process. … What particularly stood out to me was his transparency regarding any additional services and associated costs. …' },

  // Nederlandstalig
  { bron: 'moneybird', naam: 'Benthe Lokhorst', bedrijf: 'ProProject', branche: 'consultant, bv', datum: '2026-10-15', sterren: 5, taal: 'nl',
    tekst: 'Begin dit jaar ben ik de samenwerking gestart met Kyle van SlimGeregeld Administratie voor de boekhouding van mijn BV. Kyle is betrokken, communiceert proactief en komt zijn afspraken na. Hij ondersteunt waar nodig, denkt mee en geeft waardevol advies wanneer hij mogelijkheden zie. Een prettige en betrouwbare samenwerking. Zeker een aanrader!',
    vertaling: 'Earlier this year, I started working with Kyle from SlimGeregeld Administratie for the bookkeeping of my BV. Kyle is committed, communicates proactively, and honors his agreements. He provides support where needed, thinks along with you, and offers valuable advice when he sees opportunities. A pleasant and reliable collaboration. Highly recommended!' },
  { bron: 'google', naam: 'Christel Pronk', branche: 'aangifte inkomstenbelasting', sterren: 5, taal: 'nl',
    tekst: 'Kyle heeft mij het afgelopen jaar geholpen met mijn inkomstenbelasting. Fijne communicatie en alles lekker snel en duidelijk. Volgend jaar bel ik je zeker weer op, Kyle!',
    vertaling: 'Kyle helped me with my income tax over the past year. Great communication, and everything nice and quick and clear. I will definitely call you again next year, Kyle!' },
  { bron: 'google', naam: 'Jeremy Gomes', bedrijf: 'Gomes Media', branche: 'online marketeer', sterren: 5, taal: 'nl', foto: '/img/reviews/jeremy.png', link: 'https://maps.app.goo.gl/4hzddgC4sesnrEkZ8',
    tekst: 'Maakt het boekhouden veel gemakkelijker en ook sneller! Onderweg kan ik vrij rap wat facturen versturen door een simpel appje. Top systeem.',
    vertaling: 'Makes bookkeeping much easier and faster too! On the go, I can send some invoices quite quickly using a simple app. Great system.' },
  { bron: 'google', naam: 'Daan van der Mark', sterren: 5, taal: 'nl',
    tekst: 'Blij met de keuze om te kiezen voor Slim Geregeld, omdat mijn administratie veel minder tijd kost en geen gedoe meer oplevert. Vooral handig dat je je administratie gemakkelijk kunt bijhouden via WhatsApp, en dat Kyle altijd voor je klaar staat wanneer dit nodig is.',
    vertaling: 'Happy with my choice to opt for Slim Geregeld, because my administration takes much less time and no longer causes any hassle. It is especially convenient that you can easily keep track of your administration via WhatsApp, and that Kyle is always there for you when needed.' },
  { bron: 'moneybird', naam: 'Mirte Groen', bedrijf: 'Zusjes Groen', branche: 'e-commerce', datum: '2026-09-21', sterren: 5, taal: 'nl',
    tekst: 'Kyle en Slim Geregeld Administratie hebben ons super goed geholpen om Moneybird op te zetten én beter onze administratie te doen. Wij zijn er erg blij mee.' },
  { bron: 'google', naam: 'Umesh ten Kate', bedrijf: 'Umi Sports', branche: 'personal trainer', sterren: 5, taal: 'nl', foto: '/img/reviews/umesh.png', link: 'https://maps.app.goo.gl/gQpY9LhWrDCwau2v7',
    tekst: 'Slim Geregeld is efficiënt en overzichtelijk. Verder begeleidt Kyle je op een ondersteunende en begripvolle manier.',
    vertaling: 'Slim Geregeld is efficient and well-organized. Furthermore, Kyle guides you in a supportive and understanding manner.' },
  { bron: 'moneybird', naam: 'Dany Cramer', bedrijf: 'Cramer D Events', branche: 'evenementen', datum: '2026-07-29', sterren: 5, taal: 'nl',
    tekst: 'Ik ben al een aantal jaar zzp’er, hierdoor heb ik altijd moeite gehad met het bijhouden van mijn financiën en alles wat hierbij komt kijken. Sinds ik met Kyle werk is alles overzichtelijk en duidelijk. Hij communiceert goed en staat altijd paraat wanneer ik dat nodig heb. Ik kan Kyle en “Slim geregeld admin” aan iedereen aanraden!' },
  { bron: 'moneybird', naam: 'Edwin Postma', bedrijf: 'Make Bouw', branche: 'bouwbedrijf', datum: '2026-10-30', sterren: 5, taal: 'nl',
    tekst: 'Super fijne samenwerking, altijd duidelijk en snel!' },
  { bron: 'google', naam: 'Sri Kurniati', sterren: 5, taal: 'nl',
    tekst: 'Super, altijd goeie communicatie, snel antwoord en goede prijs/kwaliteit verhouding!',
    vertaling: 'Great, always good communication, quick response, and good value for money!' },
  { bron: 'google', naam: 'Burak Sahin', sterren: 5, taal: 'nl',
    tekst: 'Het is erg gemakkelijk en bespaart me super veel tijd zodat ik kan focussen op leukere dingen in het ondernemen, perfecte oplossing!',
    vertaling: 'It is very easy and saves me so much time so I can focus on more enjoyable aspects of running my business, perfect solution!' },
  { bron: 'google', naam: 'Rafaël Bossto', sterren: 5, taal: 'nl',
    tekst: 'Eenvoud en gemak. Nu al twee kwartalen klant bij Slim Geregeld, aanrader!',
    vertaling: 'Simplicity and convenience. Already a customer of Slim Geregeld for two quarters, highly recommended!' },
  { bron: 'google', naam: 'Nosh van Campenhout', sterren: 5, taal: 'nl',
    tekst: 'Fijn om mee samen te werken! Altijd bereikbaar en fijn in de omgang, plus een goede service',
    vertaling: 'A pleasure to work with! Always available and pleasant to deal with, plus good service.' },
  { bron: 'google', naam: 'Andries Min', bedrijf: 'Marimin', branche: 'timmerman', sterren: 5, taal: 'nl', foto: '/img/reviews/andries.png', link: 'https://maps.app.goo.gl/cz2LpkpYzyJQTiyg6',
    tekst: 'Prima, lekker makkelijk zo.',
    vertaling: 'Great, nice and easy this way.' },
];
