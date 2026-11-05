// Eén bron voor de vaste schema.org-knopen: de organisatie, Kyle, Miguel en de
// website. Elke pagina (React-routes via seo-paginas.mjs, blog en auteurspagina's
// via blog.mjs, en de statische verdragspagina's in public/, die bij de build
// worden bijgewerkt) gebruikt dezelfde @id's en dezelfde velden, zodat Google en
// AI-zoekmachines alles als één organisatie met één eigenaar zien.
// Wijzig gegevens als telefoon, adres of profielen alleen hier.
export const B = 'https://slim-geregeld.nl';

export const PROFIELEN = {
  kyleLinkedin: 'https://www.linkedin.com/in/kylebouwmeester',
  bedrijfLinkedin: 'https://www.linkedin.com/company/107735661/',
  moneybird: 'https://www.moneybird.nl/experts/slim-geregeld-administratie/',
  instagram: 'https://www.instagram.com/slimgeregeldadministratie/',
  // Google Bedrijfsprofiel, via de CID uit de Maps-link op de site.
  google: 'https://www.google.com/maps?cid=13727417383100848193',
};

export const AUTEURPADEN = {
  kyle: { nl: '/over/kyle-bouwmeester/', en: '/en/about/kyle-bouwmeester/' },
  miguel: { nl: '/over/miguel-weema/', en: '/en/about/miguel-weema/' },
};

const pad = (p) => B + p.split('/').map(encodeURIComponent).join('/');

export const ORG = {
  '@type': ['AccountingService', 'ProfessionalService'], '@id': B + '/#org',
  name: 'Slim Geregeld Administratie', alternateName: 'Slim Geregeld', url: B + '/',
  logo: { '@type': 'ImageObject', '@id': B + '/#logo', url: pad('/Slim Geregeld Administratie - Pictogram logo transparant 500x500.png'), width: 500, height: 500, caption: 'Slim Geregeld Administratie' },
  image: B + '/slim-geregeld-preview.jpg',
  email: 'kyle@slim-geregeld.nl', telephone: '+31621311043',
  address: { '@type': 'PostalAddress', addressLocality: 'Koog aan de Zaan', addressRegion: 'Noord-Holland', addressCountry: 'NL' },
  areaServed: { '@type': 'Country', name: 'Netherlands' },
  knowsLanguage: ['nl', 'en'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'kyle@slim-geregeld.nl', telephone: '+31621311043', availableLanguage: ['Dutch', 'English'], areaServed: 'NL' },
  identifier: { '@type': 'PropertyValue', propertyID: 'KVK', value: '92596991' },
  vatID: 'NL004963420B24',
  founder: { '@id': B + '/#kyle' },
  sameAs: [PROFIELEN.bedrijfLinkedin, PROFIELEN.moneybird, PROFIELEN.google, PROFIELEN.instagram],
};

const BECON = {
  '@type': 'EducationalOccupationalCredential', name: 'Becon-registratie 781794', credentialCategory: 'Registratie als belastingintermediair',
  identifier: { '@type': 'PropertyValue', propertyID: 'Becon', value: '781794' },
  recognizedBy: { '@type': 'GovernmentOrganization', name: 'Belastingdienst', url: 'https://www.belastingdienst.nl/' },
};

const FUNCTIE = {
  kyle: { nl: 'Becon-geregistreerd boekhouder', en: 'Becon-registered bookkeeper', ja: 'Becon登録ブックキーパー' },
  miguel: { nl: 'DAFT-specialist', en: 'DAFT specialist', ja: 'DAFTスペシャリスト' },
};

// Kyle in de taal van de pagina (alleen jobTitle verschilt). url wijst naar de
// auteurspagina in die taal (Japans: de Engelse).
export function kyle(taal = 'nl') {
  return {
    '@type': 'Person', '@id': B + '/#kyle', name: 'Kyle Bouwmeester', givenName: 'Kyle', familyName: 'Bouwmeester',
    jobTitle: FUNCTIE.kyle[taal] || FUNCTIE.kyle.en, url: B + AUTEURPADEN.kyle[taal === 'nl' ? 'nl' : 'en'],
    image: B + '/Pofielfoto%20Kyle.jpg', worksFor: { '@id': B + '/#org' }, knowsLanguage: ['nl', 'en'],
    hasCredential: BECON, sameAs: [PROFIELEN.kyleLinkedin],
  };
}

export function miguel(taal = 'nl', foto = null) {
  return {
    '@type': 'Person', '@id': B + '/#miguel', name: 'Miguel Weema', jobTitle: FUNCTIE.miguel[taal] || FUNCTIE.miguel.en,
    url: B + AUTEURPADEN.miguel[taal === 'nl' ? 'nl' : 'en'], worksFor: { '@id': B + '/#org' },
    ...(foto ? { image: pad(foto) } : {}),
  };
}

export const SITE = {
  '@type': 'WebSite', '@id': B + '/#website', url: B + '/', name: 'Slim Geregeld', alternateName: 'Slim Geregeld Administratie',
  inLanguage: ['nl', 'en', 'ja'], publisher: { '@id': B + '/#org' },
};

// Vervangt in een bestaande graaf de knopen met een vast @id door de versie hierboven.
export function normaliseerGraaf(graaf, taal) {
  const vast = { [ORG['@id']]: ORG, [B + '/#kyle']: kyle(taal), [SITE['@id']]: SITE };
  const knopen = graaf['@graph'] || [graaf];
  const nieuw = knopen.map((k) => vast[k['@id']] || k);
  return graaf['@graph'] ? { ...graaf, '@graph': nieuw } : nieuw[0];
}
