import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import cfg from './paginas.json';

// Zet titel, omschrijving, canonical en robots bij elke routewissel binnen de
// app. De eerste keer staan ze al goed in de HTML (scripts/seo-paginas.mjs);
// dit houdt ze kloppend als iemand doorklikt zonder de pagina te herladen.
type Pagina = { pad: string; titel?: string; omschrijving?: string; noindex?: boolean; canonical?: string; kopie_van?: string };
const paginas = cfg.paginas as Pagina[];
const perPad: Record<string, Pagina> = Object.fromEntries(paginas.map((p) => [p.pad, p]));

function zetMeta(selector: string, maak: () => HTMLElement, attr: string, waarde: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) { el = maak(); document.head.appendChild(el); }
  el.setAttribute(attr, waarde);
}

const SeoRoute = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const pad = pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
    const p = perPad[pad] || perPad['/'];
    const bron = p.kopie_van ? perPad[p.kopie_van] : p;
    if (!bron?.titel) return;
    const canonical = cfg.basis + (p.canonical || (perPad[pad] ? pad : '/'));
    document.title = bron.titel;
    zetMeta('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', bron.omschrijving || '');
    zetMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', canonical);
    zetMeta('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }), 'content', bron.noindex ? 'noindex, follow' : 'index, follow');
  }, [pathname]);
  return null;
};

export default SeoRoute;
