import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

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

  let tekst: React.ReactNode;
  if (taal === 'ja') {
    tekst = (
      <span lang="ja">
        このサイトはオランダ語です。日本国籍の方の条約ビザ（DJTT）は{' '}
        <a href="/djtt/ja/" hrefLang="ja" className="font-semibold underline underline-offset-2">日本語ページへ →</a>
        <span className="mx-2 opacity-60">·</span>
        <a href="/en/" hrefLang="en" lang="en" className="underline underline-offset-2">English</a>
      </span>
    );
  } else if (taal === 'en') {
    tekst = (
      <span lang="en">
        This site is in Dutch. Looking for DAFT or DJTT in English?{' '}
        <a href="/en/" hrefLang="en" className="font-semibold underline underline-offset-2">English →</a>
        <span className="mx-2 opacity-60">·</span>
        <a href="/djtt/ja/" hrefLang="ja" lang="ja" className="underline underline-offset-2">日本語</a>
      </span>
    );
  } else {
    tekst = (
      <span lang="en">
        Treaty entrepreneur from the US or Japan?{' '}
        <a href="/en/" hrefLang="en" className="font-semibold underline underline-offset-2">English</a>
        <span className="mx-2 opacity-60">·</span>
        <a href="/djtt/ja/" hrefLang="ja" lang="ja" className="font-semibold underline underline-offset-2">日本語</a>
      </span>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 relative">
        <p className="text-center pr-6">{tekst}</p>
        <button
          onClick={sluit}
          aria-label="Close"
          className="absolute right-3 sm:right-6 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TreatyBalk;
