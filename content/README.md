# Inhoud: blog en nieuws

Deze map is de bron voor de blog (`/blog/`, `/en/blog/`, `/ja/blog/`) en voor de
LinkedIn-posts op `/nieuws`. De n8n-content-engine schrijft hier via de GitHub-API;
`npm run build` maakt er statische HTML van (`scripts/blog.mjs`, aangeroepen door
`scripts/seo-paginas.mjs`). Er draait geen CMS en geen database: wat op `main`
staat, staat na de Netlify-build live.

```
content/
  blog/nl/<slug>.md        Nederlandse artikelen
  blog/en/<slug>.md        Engelse artikelen
  blog/ja/<slug>.md        Japanse artikelen
  nieuws/nieuws.json       LinkedIn-posts voor /nieuws
  nieuws/media/<map>/      carrousels en eigen video's bij nieuwsposts (op de site onder /nieuws/media/<map>/)
  __fixtures__/            testinhoud, alleen voor npm run test:blog
public/blog/img/           afbeeldingen bij artikelen
```

## 1. Blogartikelen

### Bestand en URL

| Taal | Bestand | URL |
|---|---|---|
| nl | `content/blog/nl/<slug>.md` | `https://slim-geregeld.nl/blog/<slug>/` |
| en | `content/blog/en/<slug>.md` | `https://slim-geregeld.nl/en/blog/<slug>/` |
| ja | `content/blog/ja/<slug>.md` | `https://slim-geregeld.nl/ja/blog/<slug>/` |

- De bestandsnaam is de slug: kleine letters, cijfers en enkele streepjes (`daft-renewal-equity-check`). Geen accenten, geen spaties.
- Gereserveerd, niet als slug gebruiken: `pagina`, `page`, `onderwerp`, `topic`.
- De slug mag per taal verschillen. Versies van hetzelfde stuk horen bij elkaar via `translationKey`.
- Een slug wijzigen breekt de oude URL. Laat de slug staan en pas alleen de titel aan.

### Frontmatter

Elk bestand begint met YAML tussen twee regels `---`. Daaronder volgt de tekst in markdown.

| Veld | Verplicht | Formaat | Toelichting |
|---|---|---|---|
| `title` | ja | tekst, bij voorkeur max 45 tekens | Wordt de H1 en de paginatitel (`<title> \| Slim Geregeld`). Wordt de paginatitel daarmee langer dan 60 tekens, dan valt `\| Slim Geregeld` weg; een title boven 60 tekens geeft een waarschuwing. |
| `description` | ja | tekst, max 155 tekens | Meta-description en de korte tekst in het overzicht. Langer geeft een waarschuwing. |
| `date` | ja | `JJJJ-MM-DD` | Publicatiedatum. Zichtbaar op de pagina en in het Article-schema. |
| `updated` | nee | `JJJJ-MM-DD` | Datum van de laatste inhoudelijke wijziging. Zichtbaar als "Bijgewerkt op" en als `lastmod` in de sitemap. Bij elke inhoudelijke herschrijving bijwerken. |
| `author` | ja | `kyle` of `miguel` | Kyle: Becon-geregistreerd boekhouder met Becon-credential in het schema. Miguel: Miguel Weema, DAFT-specialist. |
| `lang` | ja | `nl`, `en` of `ja` | Moet gelijk zijn aan de map waarin het bestand staat. |
| `translationKey` | nee, wel aanbevolen | tekst | Zelfde waarde voor de NL-, EN- en JA-versie van één stuk. Zonder dit veld is de slug de sleutel. Per taal mag een sleutel maar één keer voorkomen. |
| `cluster` | ja | slug | Onderwerpgroep, zie de tabel hieronder. Bepaalt het label, de gerelateerde stukken en de dienstlink. |
| `tags` | nee | lijst met teksten | Komt als `keywords` in het schema. |
| `faq` | nee | lijst van `{q, a}` | Drie tot vijf vragen. Wordt een FAQ-blok onder het artikel plus FAQPage-schema. Platte tekst, geen markdown. |
| `status` | ja | `live`, `archief` of `ingetrokken` | Zie "Statussen". Ontbreekt het veld, dan geldt `live` met een waarschuwing. |
| `image` | nee | pad onder `public/blog/img/` | Bijvoorbeeld `/blog/img/daft-renewal-equity.png`, 1200x628. Komt bovenaan het artikel en als `og:image`. Bestaat het bestand niet, dan bouwt het artikel zonder afbeelding (waarschuwing). |
| `linkedin` | nee | lijst met linkedin.com-URL's | De post(s) die naar dit stuk verwijzen. Komt als link onder het artikel. |

Voorbeeld:

```markdown
---
title: "What the IND wants when you renew a DAFT permit"
description: "The documents the IND asks for at a DAFT renewal, who may sign them, and a worked example of owner's equity at €4,500."
date: 2026-11-10
updated: 2026-11-10
author: kyle
lang: en
translationKey: daft-renewal-ind
cluster: daft-verlenging
tags: [DAFT, renewal, IND, owner's equity]
faq:
  - q: "Is a bank statement enough for the renewal?"
    a: "No. The IND asks for a balance sheet and a profit and loss account for the current and the previous financial year."
  - q: "How long does the renewed permit run?"
    a: "The first permit runs two years, the renewal grants five."
status: live
image: /blog/img/daft-renewal-ind.png
linkedin:
  - https://www.linkedin.com/feed/update/urn:li:share:7523435029557923840/
---

Eerste alinea met het antwoord in één of twee zinnen.

## What does the IND ask for at renewal?

...
```

Zet tekst met een dubbele punt, aanhalingstekens of een `#` tussen dubbele aanhalingstekens, anders breekt de YAML.

### De tekst onder de frontmatter

- Begin met een korte alinea; de H1 komt uit `title`. Een `#`-kop in de tekst wordt automatisch een H2.
- Gebruik `##` voor hoofdstukken, bij voorkeur als vraag met het antwoord in de eerste alinea. Elke `##` komt in de inhoudsopgave (die verschijnt vanaf twee kopjes, de FAQ telt mee).
- `###` voor subkopjes. Tabellen in GitHub-markdown (`| a | b |` met een `|---|---|`-regel) worden een opgemaakte tabel.
- Interne links als pad (`/daft/renewal/`, `/blog/<slug>/`), externe links volledig (`https://ind.nl/...`).
- Geen HTML: ruwe HTML wordt als tekst getoond. Geen em dashes.
- Afbeeldingen in de tekst: `![omschrijving](/blog/img/bestand.png)`, bestand in `public/blog/img/`.

### Statussen

| Status | Pagina | Overzicht `/blog/` | Sitemap | Gebruik |
|---|---|---|---|---|
| `live` | ja | ja | ja | Normaal gepubliceerd. |
| `archief` | ja, met de melding dat het niet meer wordt bijgewerkt | nee | ja | Verouderd maar met bezoekers, links of AI-citaties. Blijft bereikbaar. |
| `ingetrokken` | nee | nee | nee | Inhoud klopt niet meer en moet weg. De URL geeft een 410 met een verwijzing naar het blogoverzicht (regel in `_redirects`). Het bestand blijft in de repo staan, anders verdwijnt de 410. |

### Clusters

| Cluster | Label NL / EN | Dienstlink onder het artikel |
|---|---|---|
| `daft-verlenging` | DAFT-verlenging / DAFT renewal | `/daft/renewal/` |
| `daft` | DAFT / DAFT | `/daft/` |
| `djtt` | DJTT / DJTT | `/djtt/` (Japans: `/djtt/ja/`) |
| `zzp-btw` | Zzp en btw / VAT for freelancers | NL: `/pakketten`, EN: `/daft/#pricing` (Compliance Plan) |
| `bv-dga` | BV en DGA / BV and director | NL: `/pakketten`, EN: `/daft/#pricing` |
| `jaarwerk` | Jaarwerk / Year-end | NL: `/pakketten`, EN: `/daft/#pricing` |
| `ib-aangifte` | Aangifte inkomstenbelasting / Income tax return | NL: `/pakketten` (IB €235), EN: `/daft/#pricing` |
| `moneybird` | Moneybird / Moneybird | NL: `/pakketten`, EN: `/daft/#pricing` |

Een nieuw cluster werkt meteen (label = de sleutel, geen dienstlink) en geeft een
waarschuwing. Label en dienstlink voeg je toe in `CLUSTERS` in `scripts/blog.mjs`.

Het blogoverzicht heeft nog geen volgorde "Meest gelezen". Die komt er zodra er per artikel
een veld `klikken` uit Search Console is, op dezelfde manier als `impressies` bij het nieuws.

### Wat de build per artikel maakt

- Statische HTML in `dist/<taal-pad>/blog/<slug>/index.html`, zonder React en zonder JavaScript.
- Head: titel, description, canonical, robots, Open Graph, hreflang en JSON-LD (Article, Person, FAQPage als `faq` gevuld is, BreadcrumbList, WebPage, Organization).
- Hreflang: alle versies met dezelfde `translationKey` en status `live` of `archief` verwijzen naar elkaar en naar zichzelf, plus `x-default` naar de Engelse versie (zonder Engelse versie: NL, anders JA). Een stuk zonder vertaling krijgt geen hreflang.
- Pagina: zichtbare publicatie- en bijwerkdatum, auteursblok met foto (Kyle) of initialen (Miguel heeft geen foto) en een link naar de auteurspagina, inhoudsopgave uit de H2's, de tekst, de FAQ, de dienstlink van het cluster en drie gerelateerde `live`-stukken uit hetzelfde cluster en dezelfde taal.
- Auteurspagina's: `/over/kyle-bouwmeester/` en `/en/about/kyle-bouwmeester/` (idem `miguel-weema`) met Person-schema (Becon, KVK, LinkedIn), hreflang nl/en en de lijst met artikelen van die auteur. Een auteur zonder `live`-artikel staat op noindex en niet in de sitemap. Organisatie- en persoonsgegevens staan op één plek: `scripts/entiteiten.mjs`.
- Overzicht: `/blog/`, `/en/blog/` en `/ja/blog/` (die laatste alleen als er Japanse stukken zijn), nieuwste eerst, 12 per pagina (`/blog/pagina/2/`, `/en/blog/page/2/`), met label, datum, auteur en description. Per cluster een filterpagina `/blog/onderwerp/<cluster>/` en `/en/blog/topic/<cluster>/` (noindex). Een leeg overzicht staat op noindex en niet in de sitemap.
- `sitemap.xml` (geheel geschreven door `scripts/seo-paginas.mjs`): elk `live`- en `archief`-artikel met `lastmod` (updated of date) en `xhtml:link`-alternates, de overzichten zodra ze inhoud hebben en de auteurspagina's. Hreflang staat zowel in de HTML-head als in de sitemap, met dezelfde set; `npm run test:blog` controleert dat.
- Een onbekende URL geeft een echte 404 (`dist/404.html`); er is geen catch-all naar de React-app meer.
- `llms.txt`: een blogsectie met de clusters en de nieuwste 20 artikelen.

### Controle en fouten

De build stopt bij een fout, zodat er nooit een half artikel live gaat; Netlify laat dan
de vorige versie van de site staan. Fouten: ontbrekende `title`, `description`, `date`,
`author`, `cluster` of tekst, een datum buiten `JJJJ-MM-DD`, `lang` die niet bij de map
past, een onbekende `status` of `author`, een ongeldige slug, een dubbele
`translationKey` in één taal, `faq` of `tags` in een verkeerd formaat. Waarschuwingen
(build gaat door): description langer dan 155 tekens, onbekend cluster, ontbrekende
afbeelding, `updated` vóór `date`, ontbrekende `status`.

Lokaal controleren: `npm run blog:check`. De engine moet dezelfde regels vóór de commit toetsen.

### Schrijven via de GitHub-API (n8n)

```
PUT https://api.github.com/repos/SlimGeregeldAdministratie/slim-geregeld-administratie/contents/content/blog/en/<slug>.md
{
  "message": "Blog: <title>",
  "content": "<bestand in base64, UTF-8>",
  "branch": "main",
  "sha": "<alleen bij bijwerken: sha uit een GET op hetzelfde pad>"
}
```

Eén commit per artikel en taal. Elke commit op `main` start een Netlify-build. Afbeeldingen
op dezelfde manier naar `public/blog/img/<naam>.png`, vóór het artikel dat ernaar verwijst.

## 2. Nieuws: `content/nieuws/nieuws.json`

Een JSON-lijst met één object per LinkedIn-post. `/nieuws/` toont ze als gewone tekst
(React-pagina plus een statische versie per pagina voor crawlers), met afbeelding, datum,
onderwerplabel, de eerste drie alinea's (de rest achter "Lees verder"), de knop "Bekijk op
LinkedIn" en, als ze gevuld zijn, "Bekijk op de bedrijfspagina" en "Lees het hele stuk".

Pagina's (allemaal statische bestanden, canonical naar zichzelf, `rel="prev"`/`rel="next"` in de head):

| URL | Inhoud | Index |
|---|---|---|
| `/nieuws/`, `/nieuws/2/`, ... | alle posts, nieuwste eerst, 10 per pagina | ja, in de sitemap |
| `/nieuws/onderwerp/<cluster>/`, `.../2/` | posts van één onderwerp, 10 per pagina | alleen bij 3 of meer posts; anders `noindex` en niet in de sitemap |

Alleen posts met `"toon": true` staan op de site. Een post met `"toon": false` staat niet
op `/nieuws/`, niet op een onderwerppagina, niet in de sitemap en niet in de JavaScript-bundel.

Volgorde "Meest gelezen" (`?volgorde=meest-gelezen`) sorteert in de browser op impressies per
dag: `impressies` gedeeld door het aantal dagen tussen `datum` en `impressiesBijgewerkt`. Zo
wint een oude post niet alleen omdat hij langer staat. Posts die nog geen 14 dagen oud zijn
tellen daar niet mee: die staan bovenaan met het label "Nieuw" en schuiven na 14 dagen vanzelf
op hun plek. De statische HTML blijft op nieuwste. Het aantal impressies komt niet in de site: de build
geeft de app alleen een rang mee (`vite.config.ts`). Let op: deze repo is openbaar, dus de
getallen staan wel in dit bestand op GitHub.

Aantal per pagina en de minimumgrens staan in `src/seo/onderwerpen.json`, net als de onderwerpen:

| `cluster` | Label | Voor |
|---|---|---|
| `zzp-btw` | Zzp en btw | btw, omzetdoel, auto, kosten, potjes, zzp-regelingen |
| `bv-dga` | BV en DGA | BV oprichten of overstappen, salaris of dividend, holding |
| `ib-aangifte` | Aangifte inkomstenbelasting | IB-aangifte, aftrekposten, box 3, pensioen, voorlopige aanslag, schenken |
| `jaarwerk` | Jaarwerk | jaarafsluiting, eindejaarstips, boekenonderzoek |
| `moneybird` | Moneybird | werken in Moneybird |
| `daft-verlenging` | DAFT-verlenging | verlenging van een DAFT- of DJTT-vergunning |
| `djtt` | DJTT | Japanse verdragsondernemers |
| `nieuws` | Praktijknieuws | nieuws over Slim Geregeld zelf, de praktijk, lanceringen |

| Veld | Verplicht | Formaat | Toelichting |
|---|---|---|---|
| `id` | ja | tekst | De URN die de LinkedIn-API teruggeeft, bijvoorbeeld `urn:li:share:7523435029557923840`. Uniek; bij een dubbel id telt het laatste item. |
| `datum` | ja | `JJJJ-MM-DD` | Publicatiedatum. Bepaalt de volgorde. |
| `kanaal` | ja | `profiel` of `pagina` | Waar de post oorspronkelijk staat: Kyles profiel of de bedrijfspagina. |
| `titel` | nee | tekst | Kop boven de post. Leeg of `null`: de eerste regel van de tekst. |
| `tekst` | ja | tekst | De volledige posttekst. Alinea's scheiden met een lege regel (`\n\n`), een enkele `\n` wordt een regelafbreking. Platte tekst, geen HTML of markdown. |
| `afbeelding` | nee | URL of pad | De kaart of foto bij de post: een volledige `https://`-URL (bijvoorbeeld de HCTI- of LinkedIn-CDN-URL) of een pad op de site (`/blog/img/...`). |
| `urlProfiel` | ja, als `urlPagina` leeg is | URL | `https://www.linkedin.com/feed/update/<urn>/` van de post op Kyles profiel. Doel van "Bekijk op LinkedIn". |
| `urlPagina` | nee | URL of `null` | Dezelfde post op de bedrijfspagina. Gevuld: tweede knop "Bekijk op de bedrijfspagina". Is `urlProfiel` leeg, dan wordt dit de hoofdknop. |
| `taal` | ja | `nl`, `en` of `ja` | Taal van de post. |
| `toon` | ja | `true` of `false` | Of de post op de site komt. Zie "Welke posts op de site komen" hieronder. Ontbreekt het, dan geldt `true` met een waarschuwing. |
| `cluster` | ja | sleutel uit de tabel hierboven | Onderwerp van de post. De planner kiest het op de inhoud, zoals bij een blog. Ontbreekt het of is het onbekend, dan komt de post onder `nieuws` (waarschuwing in de build). |
| `impressies` | nee | heel getal of weglaten | Totaal aantal impressies op LinkedIn op de datum `impressiesBijgewerkt`. De planner werkt dit wekelijks bij via de API (zelfde `id`, item vervangen). Alleen voor "Meest gelezen"; posts zonder getal komen daar achteraan. Wordt niet getoond. |
| `impressiesBijgewerkt` | bij `impressies` | `JJJJ-MM-DD` | Datum waarop `impressies` is gemeten. Nodig voor impressies per dag; ontbreekt het, dan rekent de build met de builddatum. |
| `media` | nee | object of weglaten | Carrousel of video bij de post, zie "Media" hieronder. Zonder `media` toont de site `afbeelding`. |
| `blogSlug` | nee | slug of `null` | Slug van het bijbehorende artikel in dezelfde taal. Gevuld: link "Lees het hele stuk" naar `/blog/<slug>/` (of `/en/blog/<slug>/`). De statische versie toont de link alleen als het artikel bestaat. |

Voorbeeld van één item:

```json
{
  "id": "urn:li:share:7523435029557923840",
  "toon": true,
  "datum": "2026-11-03",
  "kanaal": "profiel",
  "titel": "Hoeveel omzet heb jij eigenlijk nodig?",
  "tekst": "Je agenda zit vol. Maar houd je ook genoeg over?\nBegin eens bij wat je nodig hebt, in plaats van bij wat je kunt factureren.\n\nPak je maandelijkse zakelijke kosten erbij. ...",
  "afbeelding": "https://media.licdn.com/dms/image/v2/.../0/1793726689783?e=2147483647&v=beta&t=...",
  "urlProfiel": "https://www.linkedin.com/feed/update/urn:li:activity:7523435030422114304/",
  "urlPagina": null,
  "taal": "nl",
  "cluster": "zzp-btw",
  "blogSlug": null,
  "impressies": 73,
  "impressiesBijgewerkt": "2026-11-04"
}
```

### Welke posts op de site komen (`toon`)

Op de site staan alleen posts met inhoud: een uitleg, een cijfer of rekensom, een
praktijksituatie, of nieuws over de praktijk zelf. `toon: false` krijgen:

- dubbele posts (zelfde of bijna zelfde tekst als een eerdere post; de beste blijft staan);
- generieke motivatie- of opvulposts zonder concreet feit, cijfer of voorbeeld;
- posts die alleen een vraag stellen.

De planner zet `toon` bij elke nieuwe post automatisch: `true` als de post door de
poortwachter kwam en minstens twee eigen elementen heeft (eigen cijfer, klantsituatie,
praktijkfout, eigen rekensom), anders `false`. Kyle kan het veld later met de hand omzetten.

### Media: carrousel en video (`media`)

Bestanden horen in `content/nieuws/media/<map>/`, waarbij `<map>` het getal uit de URN is
(`urn:li:share:7523435029557923840` wordt `7523435029557923840`). De build kopieert de map
naar `/nieuws/media/<map>/`; in `nieuws.json` staan de paden vanaf `/nieuws/media/`. Commit
eerst de bestanden en daarna `nieuws.json`: een pad naar een ontbrekend bestand laat de build
falen (Netlify houdt dan de vorige versie).

Carrousel (LinkedIn-document):

```json
"media": {
  "type": "carrousel",
  "pdf": "/nieuws/media/7523435029557923840/carrousel.pdf",
  "paginas": ["/nieuws/media/7523435029557923840/1.png", "/nieuws/media/7523435029557923840/2.png"],
  "tekstPerPagina": ["Tekst van dia 1", "Tekst van dia 2"]
}
```

- `paginas`: één PNG of JPEG per dia (bijvoorbeeld 1080 x 1350), in volgorde. Breedte en hoogte leest de build zelf uit.
- `tekstPerPagina`: per dia de tekst die erop staat, even lang als `paginas`. Wordt de alt-tekst en staat in de statische HTML als zichtbare tekst onder elke dia, zodat crawlers de inhoud lezen.
- De site toont een diaweergave (vorige/volgende) met de tekst van de dia en een downloadlink naar de pdf.

Video:

```json
"media": {
  "type": "video",
  "src": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "poster": "/nieuws/media/7523435029557923840/poster.jpg",
  "transcript": "Volledige tekst van wat er gezegd wordt.\n\nAlinea's met een lege regel."
}
```

- `src`: een YouTube-URL (watch, youtu.be of shorts) of een eigen `.mp4` onder `/nieuws/media/<map>/`.
- `poster`: optioneel stilstaand beeld. Zonder poster gebruikt de site bij YouTube het YouTube-plaatje, anders `afbeelding`.
- `transcript`: verplicht. Staat als tekst onder de video en in het VideoObject-schema.
- YouTube laadt pas na een klik (in de statische HTML een iframe met lazy loading, via youtube-nocookie.com); een eigen mp4 laadt pas bij afspelen.

De twee bestaande videoposts (27 november 2025 en 20 januari 2026) hebben geen bron: daar
blijft het stilstaande beeld met de knop naar LinkedIn. De planner levert de media voor
nieuwe posts.

### Wat de n8n-flow moet doen (workflow Uhjh0QRaSB78i8f4)

De nodes "Get Nieuws.tsx", "Update linkedInPosts Array" en "Push to GitHub" passen nu
`src/components/Nieuws.tsx` aan. Die array bestaat na deze wijziging niet meer; de flow
moet tegelijk met de merge om naar dit bestand:

1. `GET https://api.github.com/repos/SlimGeregeldAdministratie/slim-geregeld-administratie/contents/content/nieuws/nieuws.json?ref=main` en bewaar `sha`.
2. Decodeer `content` (base64, UTF-8) en `JSON.parse` de lijst.
3. Verwijder een bestaand item met hetzelfde `id` en zet het nieuwe item vooraan (`unshift`).
4. Schrijf terug met `JSON.stringify(lijst, null, 2) + "\n"`, base64-gecodeerd:
   `PUT .../contents/content/nieuws/nieuws.json` met `{"message": "Nieuws: <titel>", "content": "<base64>", "sha": "<sha uit stap 1>", "branch": "main"}`.
5. Bij een 409 of 422 (sha veranderd tussendoor): stap 1 tot en met 4 opnieuw.

Nooit oude items weggooien: alle posts blijven op `/nieuws/` staan. Impressies van een bestaande post bijwerken mag: zelfde `id`, item vervangen.

### Startvulling

33 posts van Kyles profiel tussen 10 november 2025 en 3 november 2026:

- De 24 posts die de flow publiceerde, gevonden via de commit-historie van `Nieuws.tsx`. De post van 31 december 2025 had daar geen titel en kreeg "Schenk- en erfbelasting bewust inzetten"; in "Financial lease of private lease" is het gedachtestreepje een dubbele punt geworden.
- De negen posts die Kyle zelf schreef (lancering, WhatsApp-video, eindejaarstips, belastingwijzigingen 2026, oprichtingsverhaal, btw-stress-video, administratie-uren, IB-aangifte, drie aftrekposten). Id is daar de activity-URN. Bewerkingen voor de site: de vette Unicode-letters zijn gewone letters geworden, de hashtags aan het eind zijn weggelaten, de gedachtestreepjes zijn een komma of dubbele punt geworden en de titel is de eerste regel zonder emoji of aanhalingstekens. Bij de twee video-posts is de afbeelding het stilstaande beeld van de video.

De volledige tekst, de afbeelding en de URL komen uit de openbare LinkedIn-embed van
elke post (opgehaald op 5 november 2026). De afbeeldingen verwijzen naar de
LinkedIn-CDN (`media.licdn.com`, URL's zonder verloopdatum). `urlPagina` is overal
leeg, want de bedrijfspagina-URL's van deze posts zijn niet bekend.

Zes van de 33 staan op `toon: false`: de dubbele holdingpost van 13 mei 2026 (die van
2 maart blijft), "Hoe je geldlekken opspoort" (6 juli), de box 3-post (13 april), de
btw-typetjes (30 maart), "Pensioen opbouwen? ..." (10 maart) en "Pensioenbeleggen" (5 januari).

Het onderwerp (`cluster`) van deze 33 posts is op de tekst gekozen; `impressies` komt uit
het onderzoek naar Kyles LinkedIn-posts (peildatum 4 november 2026, de post van 3 november
na 15 uur).

## 3. Testen

- `npm run test:blog` bouwt de site met `content/__fixtures__` (via `BLOG_CONTENT_DIR`) en controleert head, hreflang, JSON-LD, tekst, overzicht, paginering, sitemap, llms.txt, `_redirects`, `/nieuws` en de foutmeldingen. Daarna bevat `dist` testinhoud: draai `npm run build` voor de echte site.
- `npm run blog:check` controleert alleen de echte inhoud, zonder te bouwen.
- `npm run seo:check` controleert na `npm run build` de hele gebouwde site: canonical, hreflang (wederkerig, x-default), JSON-LD (parse, @id's, verplichte velden), titels en descriptions, één H1, afbeeldingen, interne links, sitemap gelijk aan de HTML, robots.txt en llms.txt.
- `content/__fixtures__` wordt nooit door de gewone build gelezen.
