import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, X } from 'lucide-react';

// Balk boven de header die verdragsondernemers (VS en Japan) naar de Engelse en
// Japanse pagina's wijst. Bewust geen automatische doorverwijzing: Google crawlt
// vooral vanuit de VS en moet de Nederlandse site gewoon te zien krijgen.
//   - Op de homepage staat de balk altijd, voor iedereen.
//   - Op andere pagina's alleen als de browser niet op Nederlands staat.
//   - Wegklikken onthouden we in deze browser.
const WEG_SLEUTEL = 'sg_treatybalk_weg';

type Taal = 'nl' | 'en' | 'ja';

function browserTaal(): Taal {
  const talen = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'nl'])
    .map((t) => t.toLowerCase());
  if (talen.some((t) => t.startsWith('nl'))) return 'nl';
  if (talen[0].startsWith('ja')) return 'ja';
  return 'en';
}

const TreatyBalk = () => {
  const { pathname } = useLocation();
  const [taal, setTaal] = useState<Taal>('nl');
  const [weg, setWeg] = useState(true);

  useEffect(() => {
    setTaal(browserTaal());
    try {
      setWeg(localStorage.getItem(WEG_SLEUTEL) === '1');
    } catch {
      setWeg(false);
    }
  }, []);

  const opHome = pathname === '/';
  if (weg || (!opHome && taal === 'nl')) return null;

  const sluit = () => {
    setWeg(true);
    try {
      localStorage.setItem(WEG_SLEUTEL, '1');
    } catch {
      // geen opslag beschikbaar, dan alleen voor deze pagina weg
    }
  };

  // Knoppen in de balk: de eerste is de hoofdkeuze voor deze bezoeker.
  const knop = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap';
  const hoofd = knop + ' bg-white text-blue-700 hover:bg-blue-50';
  const neven = knop + ' bg-blue-500/40 text-white ring-1 ring-white/40 hover:bg-blue-500/70';
  const en = (cls: string) => <a href="/en/" hrefLang="en" lang="en" className={cls}>English →</a>;
  const ja = (cls: string) => <a href="/djtt/ja/" hrefLang="ja" lang="ja" className={cls}>日本語 →</a>;

  let tekst: React.ReactNode;
  let knoppen: React.ReactNode;
  if (taal === 'ja') {
    tekst = <span lang="ja">このサイトはオランダ語です。日本国籍の方の条約ビザ（DJTT）は日本語ページへ。</span>;
    knoppen = <>{ja(hoofd)}{en(neven)}</>;
  } else if (taal === 'en') {
    tekst = <span lang="en">This site is in Dutch. Looking for DAFT or DJTT in English?</span>;
    knoppen = <>{en(hoofd)}{ja(neven)}</>;
  } else {
    tekst = <span lang="en">Treaty entrepreneur from the US or Japan? Start here:</span>;
    knoppen = <>{en(hoofd)}{ja(neven)}</>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pr-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 relative">
        <Globe className="h-4 w-4 text-blue-200 shrink-0 hidden sm:block" aria-hidden="true" />
        <p className="text-center text-blue-50">{tekst}</p>
        <span className="flex items-center gap-2">{knoppen}</span>
        <button
          onClick={sluit}
          aria-label="Close"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TreatyBalk;
