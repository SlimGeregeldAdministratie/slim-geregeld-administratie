import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import nieuws from '@nieuws';
import onderwerpen from '../seo/onderwerpen.json';

// De LinkedIn-posts als gewone tekst uit content/nieuws/nieuws.json. De n8n-flow
// schrijft daar elke gepubliceerde post bij (formaat: content/README.md).
// Routes: /nieuws/, /nieuws/2/, /nieuws/onderwerp/<cluster>/ (en /2/). Elke route
// heeft een statische versie met dezelfde posts (scripts/seo-paginas.mjs, bouwNieuws),
// zodat crawlers de tekst lezen. Hier komt daar "Meest gelezen" bij (?volgorde=meest-gelezen),
// alleen in de browser; de rang komt uit vite.config.ts, het aantal impressies niet.

const B = 'https://slim-geregeld.nl';
const PER_PAGINA: number = onderwerpen.perPagina;
const MIN_INDEX: number = onderwerpen.minIndex;
const CLUSTERS = onderwerpen.clusters as Record<string, string>;
const TITEL = 'Nieuws en belastingtips voor ondernemers | Slim Geregeld';
// Bij "Meest gelezen" tellen posts pas mee als ze zo oud zijn; daarvoor staan ze bovenaan als "Nieuw".
const NIEUW_DAGEN = 14;
const isNieuw = (n: NieuwsItem) => Date.now() - Date.parse(n.datum + 'T00:00:00Z') < NIEUW_DAGEN * 86400000;
const OMSCHRIJVING = 'Praktische tips over administratie, ondernemerschap en belastingen van boekhouder Kyle Bouwmeester.';

const ZICHTBAAR = 3; // alinea's die direct te zien zijn, de rest achter "Lees verder"

function alineas(tekst: string) {
  return tekst.trim().split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);
}

function datumMooi(d: string) {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T00:00:00Z'));
}

function blogLink(n: NieuwsItem) {
  if (!n.blogSlug) return null;
  const taal = n.taal || 'nl';
  return (taal === 'nl' ? '/blog/' : `/${taal}/blog/`) + n.blogSlug + '/';
}

const Alinea = ({ tekst }: { tekst: string }) => (
  <p>
    {tekst.split('\n').map((regel, i, alle) => (
      <span key={i}>
        {regel}
        {i < alle.length - 1 && <br />}
      </span>
    ))}
  </p>
);

function zetHead(titel: string, omschrijving: string, canonical: string, index: boolean) {
  document.title = titel;
  const zet = (selector: string, maak: () => HTMLElement, attr: string, waarde: string) => {
    let el = document.head.querySelector(selector) as HTMLElement | null;
    if (!el) { el = maak(); document.head.appendChild(el); }
    el.setAttribute(attr, waarde);
  };
  zet('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', omschrijving);
  zet('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', canonical);
  zet('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }), 'content', index ? 'index, follow' : 'noindex, follow');
}

function youtubeId(src: string) {
  const m = src.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Carrousel: één dia tegelijk met vorige/volgende, de tekst van de dia eronder en de pdf als download.
const Carrousel = ({ m, titel }: { m: Extract<NieuwsMedia, { type: 'carrousel' }>; titel: string }) => {
  const [i, setI] = useState(0);
  const n = m.paginas.length;
  const knop = 'w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:border-blue-300 disabled:opacity-40';
  return (
    <section aria-roledescription="carrousel" aria-label={titel} className="bg-blue-50">
      <img src={m.paginas[i]} alt={m.tekstPerPagina[i]} loading="lazy" className="w-full h-auto max-h-[36rem] object-contain" />
      <div className="px-6 py-3 flex items-center justify-between gap-3 text-sm">
        <button type="button" className={knop} onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Vorige dia">←</button>
        <p className="text-gray-700 text-center flex-1" aria-live="polite"><span className="text-gray-500">Dia {i + 1} van {n}:</span> {m.tekstPerPagina[i]}</p>
        <button type="button" className={knop} onClick={() => setI(i + 1)} disabled={i === n - 1} aria-label="Volgende dia">→</button>
      </div>
      <p className="px-6 pb-3 text-sm"><a href={m.pdf} download className="font-semibold text-blue-600 hover:text-blue-700">Download de carrousel (pdf)</a></p>
    </section>
  );
};

// Video: YouTube pas laden na een klik (geen externe verzoeken vooraf), eigen mp4 met preload none.
const Video = ({ m, titel, afbeelding }: { m: Extract<NieuwsMedia, { type: 'video' }>; titel: string; afbeelding?: string | null }) => {
  const [speel, setSpeel] = useState(false);
  const yt = youtubeId(m.src);
  const poster = m.poster || afbeelding || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : undefined);
  if (!yt) return <video controls preload="none" poster={poster} className="w-full h-auto bg-black"><source src={m.src} type="video/mp4" /></video>;
  if (speel) {
    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1`} title={titel} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full border-0" />
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setSpeel(true)} className="relative block w-full bg-black" aria-label={`Speel video af: ${titel}`}>
      {poster && <img src={poster} alt="" loading="lazy" className="w-full h-auto max-h-[28rem] object-contain opacity-90" />}
      <span className="absolute inset-0 flex items-center justify-center"><span className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center shadow-lg">▶</span></span>
    </button>
  );
};

const Post = ({ n, nieuw = false }: { n: NieuwsItem; nieuw?: boolean }) => {
  const [open, setOpen] = useState(false);
  const delen = alineas(n.tekst);
  const titel = n.titel || delen[0]?.split('\n')[0] || '';
  const hoofd = n.urlProfiel || n.urlPagina;
  const blog = blogLink(n);
  const getoond = open ? delen : delen.slice(0, ZICHTBAAR);
  return (
    <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" lang={n.taal && n.taal !== 'nl' ? n.taal : undefined}>
      {n.media?.type === 'carrousel' ? (
        <Carrousel m={n.media} titel={titel} />
      ) : n.media?.type === 'video' ? (
        <Video m={n.media} titel={titel} afbeelding={n.afbeelding} />
      ) : n.afbeelding && (
        <img src={n.afbeelding} alt={titel} loading="lazy" className="w-full h-auto max-h-[28rem] object-contain bg-blue-50" />
      )}
      <div className="p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <time dateTime={n.datum}>{datumMooi(n.datum)}</time>
          {nieuw && <span className="inline-block rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1">Nieuw</span>}
          {n.cluster && CLUSTERS[n.cluster] && (
            <Link to={`/nieuws/onderwerp/${n.cluster}/`} className="inline-block rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 hover:bg-blue-100">
              {CLUSTERS[n.cluster]}
            </Link>
          )}
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-1 mb-4 leading-snug">{titel}</h2>
        <div className="space-y-3 text-gray-700 leading-relaxed">
          {getoond.map((a, i) => <Alinea key={i} tekst={a} />)}
        </div>
        {delen.length > ZICHTBAAR && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
            aria-expanded={open}
          >
            {open ? 'Minder tonen' : 'Lees verder'}
          </button>
        )}
        {n.media?.type === 'video' && (
          <details className="mt-4 text-gray-700">
            <summary className="cursor-pointer text-sm font-semibold text-blue-600">Transcript van de video</summary>
            <div className="mt-2 space-y-3 leading-relaxed">{alineas(n.media.transcript).map((a, i) => <Alinea key={i} tekst={a} />)}</div>
          </details>
        )}
        <div className="flex flex-wrap gap-3 mt-6">
          {hoofd && (
            <a
              href={hoofd}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Linkedin className="w-4 h-4" />
              Bekijk op LinkedIn
            </a>
          )}
          {n.urlPagina && n.urlProfiel && (
            <a
              href={n.urlPagina}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              Bekijk op de bedrijfspagina
            </a>
          )}
          {blog && (
            <a href={blog} className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Lees het hele stuk →
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const Nieuws = () => {
  const { pagina, cluster } = useParams();
  const [zoek] = useSearchParams();
  const navigate = useNavigate();
  const gelezen = zoek.get('volgorde') === 'meest-gelezen';
  const [getoond, setGetoond] = useState(PER_PAGINA);

  // Alle posts, nieuwste eerst; bij een dubbel id telt het laatste item in het bestand.
  const posts = useMemo(() => {
    const perId = new Map<string, NieuwsItem>();
    for (const n of nieuws) if (n && n.id && n.tekst && n.datum) perId.set(n.id, { ...n, cluster: n.cluster && CLUSTERS[n.cluster] ? n.cluster : 'nieuws' });
    return [...perId.values()].sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  }, []);
  const aanwezig = useMemo(() => Object.keys(CLUSTERS).filter((c) => posts.some((n) => n.cluster === c)), [posts]);

  const geldigCluster = !cluster || Boolean(CLUSTERS[cluster]);
  const gefilterd = cluster ? posts.filter((n) => n.cluster === cluster) : posts;
  const paginas = Math.max(1, Math.ceil(gefilterd.length / PER_PAGINA));
  const nr = pagina ? Number(pagina) : 1;
  const geldig = geldigCluster && Number.isInteger(nr) && nr >= 1 && nr <= paginas;
  const basis = cluster ? `/nieuws/onderwerp/${cluster}/` : '/nieuws/';
  const label = cluster ? CLUSTERS[cluster] : null;

  // Nieuwste: de pagina uit de URL. Meest gelezen: alles van dit onderwerp op rang, met "Toon meer".
  // Meest gelezen: posts jonger dan 14 dagen bovenaan (nieuwste eerst, label Nieuw), daarna op rang.
  const lijst = gelezen
    ? [...gefilterd.filter(isNieuw), ...gefilterd.filter((n) => !isNieuw(n)).sort((a, b) => (a.rang ?? Infinity) - (b.rang ?? Infinity) || (a.datum < b.datum ? 1 : -1))].slice(0, getoond)
    : gefilterd.slice((nr - 1) * PER_PAGINA, nr * PER_PAGINA);

  useEffect(() => {
    window.scrollTo(0, 0);
    setGetoond(PER_PAGINA);
  }, [pagina, cluster, gelezen]);

  useEffect(() => {
    const achter = nr > 1 ? `, pagina ${nr}` : '';
    const titel = label ? `${label}: nieuws en tips${achter} | Slim Geregeld` : (nr === 1 ? TITEL : `Nieuws en belastingtips${achter} | Slim Geregeld`);
    const pad = nr > 1 ? `${basis}${nr}/` : basis;
    zetHead(titel, OMSCHRIJVING, B + pad, geldig && (!cluster || gefilterd.length >= MIN_INDEX));
  }, [nr, basis, label, cluster, geldig, gefilterd.length]);

  const metVolgorde = (pad: string) => (gelezen ? `${pad}?volgorde=meest-gelezen` : pad);
  // Meest gelezen heeft geen pagina's: terug naar de eerste pagina van dit onderwerp.
  const kiesVolgorde = (meest: boolean) => navigate(meest ? `${basis}?volgorde=meest-gelezen` : basis, { replace: true });
  const chip = (actief: boolean) => `rounded-full px-3 py-1 text-sm font-semibold transition-colors ${actief ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {label ? `Nieuws over ${label.toLowerCase()}` : 'Nieuws & Updates'}
          </h1>
          <p className="text-lg text-gray-600">
            De posts van Kyle op LinkedIn, met praktische tips over administratie, btw en belastingen
          </p>
          <p className="mt-3 text-sm">
            <a href="/blog/" className="font-semibold text-blue-600 hover:text-blue-700">Lees ook de blog →</a>
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Volg mij op LinkedIn
                  </h2>
                  <p className="text-sm text-gray-600">
                    Praktische tips over administratie, ondernemerschap en belastingtips
                  </p>
                </div>
              </div>
              <a
                href="https://www.linkedin.com/in/kylebouwmeester/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <Linkedin className="w-4 h-4" />
                Volg Kyle
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <nav aria-label="Onderwerp" className="flex flex-wrap gap-2">
              <Link to={metVolgorde('/nieuws/')} className={chip(!cluster)}>Alle onderwerpen</Link>
              {aanwezig.map((c) => (
                <Link key={c} to={metVolgorde(`/nieuws/onderwerp/${c}/`)} className={chip(cluster === c)}>{CLUSTERS[c]}</Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-sm" role="group" aria-label="Volgorde">
              <span className="text-gray-500">Volgorde:</span>
              <button type="button" onClick={() => kiesVolgorde(false)} aria-pressed={!gelezen} className={chip(!gelezen)}>Nieuwste</button>
              <button type="button" onClick={() => kiesVolgorde(true)} aria-pressed={gelezen} className={chip(gelezen)}>Meest gelezen</button>
            </div>
          </div>

          {!geldig ? (
            <p className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-gray-700">
              Deze pagina bestaat niet. <Link to="/nieuws/" className="text-blue-600 underline">Naar het nieuws</Link>
            </p>
          ) : (
            <div className="space-y-8">
              {lijst.map((n) => <Post key={n.id} n={n} nieuw={gelezen && isNieuw(n)} />)}
            </div>
          )}

          {geldig && gelezen && getoond < gefilterd.length && (
            <div className="text-center">
              <button type="button" onClick={() => setGetoond(getoond + PER_PAGINA)} className="px-5 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-semibold text-sm">
                Toon meer
              </button>
            </div>
          )}

          {geldig && !gelezen && paginas > 1 && (
            <nav aria-label="Paginering" className="flex items-center justify-between text-sm font-semibold">
              {nr > 1 ? <Link to={nr === 2 ? basis : `${basis}${nr - 1}/`} rel="prev" className="text-blue-600 hover:underline">← Vorige</Link> : <span />}
              <span className="flex gap-1">
                {Array.from({ length: paginas }, (_, i) => i + 1).map((i) => (
                  <Link key={i} to={i === 1 ? basis : `${basis}${i}/`} aria-current={i === nr ? 'page' : undefined}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg ${i === nr ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}>{i}</Link>
                ))}
              </span>
              {nr < paginas ? <Link to={`${basis}${nr + 1}/`} rel="next" className="text-blue-600 hover:underline">Volgende →</Link> : <span />}
            </nav>
          )}

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Mis geen enkele update!
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Volg Slim Geregeld Administratie op LinkedIn voor wekelijkse tips over administratie,
              belastingen en slimmer ondernemen.
            </p>
            <a
              href="https://www.linkedin.com/in/kylebouwmeester/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-lg"
            >
              <Linkedin className="w-5 h-5" />
              Volg nu op LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nieuws;
