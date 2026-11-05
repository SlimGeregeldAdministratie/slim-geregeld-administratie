import { useEffect, useMemo, useState } from 'react';
import { Linkedin } from 'lucide-react';
import nieuws from '@nieuws';

// De LinkedIn-posts als gewone tekst uit content/nieuws/nieuws.json. De n8n-flow
// schrijft daar elke gepubliceerde post bij (formaat: content/README.md). De
// statische versie in dist/nieuws.html (scripts/blog.mjs) toont dezelfde tekst
// voor crawlers. Geen LinkedIn-scripts of iframes.

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

const Post = ({ n }: { n: NieuwsItem }) => {
  const [open, setOpen] = useState(false);
  const delen = alineas(n.tekst);
  const titel = n.titel || delen[0]?.split('\n')[0] || '';
  const hoofd = n.urlProfiel || n.urlPagina;
  const blog = blogLink(n);
  const getoond = open ? delen : delen.slice(0, ZICHTBAAR);
  return (
    <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" lang={n.taal && n.taal !== 'nl' ? n.taal : undefined}>
      {n.afbeelding && (
        <img src={n.afbeelding} alt={titel} loading="lazy" className="w-full h-auto max-h-[28rem] object-contain bg-blue-50" />
      )}
      <div className="p-6">
        <time dateTime={n.datum} className="text-sm text-gray-500">{datumMooi(n.datum)}</time>
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Nieuwste eerst; bij een dubbel id telt het laatste item in het bestand.
  const posts = useMemo(() => {
    const perId = new Map<string, NieuwsItem>();
    for (const n of nieuws) if (n && n.id && n.tekst && n.datum) perId.set(n.id, n);
    return [...perId.values()].sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nieuws & Updates
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

          <div className="space-y-8">
            {posts.map((n) => <Post key={n.id} n={n} />)}
          </div>

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
