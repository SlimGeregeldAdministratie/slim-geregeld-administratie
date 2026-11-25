// Factuur- en offertesjablonen voor Slim Light (23-11-2026).
// Eén bron voor twee plekken: het live voorbeeld op /slim-chatbot-instellingen
// en (na overstap) de pdf in n8n via Gotenberg (chromium, A4). Daarom gewoon
// JavaScript zonder afhankelijkheden: factuurHtml(data, sjabloon) geeft een
// compleet HTML-document terug.
//
// sjabloon: 1 Helder, 2 Klassiek, 3 Kleur, 4 Zijbalk, 5 Minimaal, 6 Zacht
// (1 tot 3 zelfde nummers als in de mastersheet; 4 tot 6 sinds 24-11-2026, alleen via HTML).
// data:
//   taal 'nl'|'en', soort 'factuur'|'offerte', nummer, datum, verval (factuur) of geldigTot (offerte)
//   van  { bedrijf, naam, adres, postcode, plaats, email, tel, web, kvk, btw, iban, tnv, logo }
//   aan  { bedrijf, naam, adres, postcode, plaats, email, kvk }
//   regels [{ omschrijving, aantal, prijs, btw }]   prijs per stuk, btw in procenten (21, 9, 0)
//   inclBtw: prijzen zijn inclusief btw
//   termijn (dagen), voorwaarden, tekstBoven, tekstOnder, opmerking
// Leeg gelaten teksten krijgen de standaardtekst van Slim. Geen btw-nummer en
// nergens btw: dan staat er een regel over de kleineondernemersregeling.

const T = {
  nl: {
    factuur: 'Factuur', offerte: 'Offerte', nummer: 'Nummer', datum: 'Datum', verval: 'Vervaldatum', geldig: 'Geldig tot',
    aan: 'Aan', omschrijving: 'Omschrijving', aantal: 'Aantal', prijs: 'Prijs', btw: 'Btw', bedrag: 'Bedrag',
    subtotaal: 'Subtotaal', btwOver: (p, b) => 'Btw ' + p + '% over ' + b, totaal: 'Totaal', excl: 'excl. btw', incl: 'incl. btw',
    kvk: 'KvK', btwNr: 'Btw-id', iban: 'IBAN', tnv: 't.n.v.',
    kor: 'Geen btw berekend: vrijgesteld op grond van de kleineondernemersregeling (KOR).',
    stdVoorwaarden: 'Wij verzoeken u vriendelijk het bedrag binnen {betalingstermijn} dagen over te maken op {iban} ten name van {tnv}, onder vermelding van het factuurnummer.',
    stdBoven: 'Geachte {naam},\n\nHierbij ontvangt u de prijsopgave voor de onderstaande werkzaamheden.',
    stdOnder: 'We hopen u hiermee voldoende te hebben geïnformeerd en horen graag of u akkoord gaat.',
    datumLoc: 'nl-NL', geldLoc: 'nl-NL', klantStd: 'heer of mevrouw', teBetalen: 'Te betalen', van: 'Van', betalen: 'Betalen',
  },
  en: {
    factuur: 'Invoice', offerte: 'Quote', nummer: 'Number', datum: 'Date', verval: 'Due date', geldig: 'Valid until',
    aan: 'To', omschrijving: 'Description', aantal: 'Qty', prijs: 'Price', btw: 'VAT', bedrag: 'Amount',
    subtotaal: 'Subtotal', btwOver: (p, b) => 'VAT ' + p + '% on ' + b, totaal: 'Total', excl: 'excl. VAT', incl: 'incl. VAT',
    kvk: 'Chamber of Commerce', btwNr: 'VAT ID', iban: 'IBAN', tnv: 'in the name of',
    kor: 'No VAT charged: exempt under the Dutch small business scheme (KOR).',
    stdVoorwaarden: 'Please transfer the amount within {betalingstermijn} days to {iban} in the name of {tnv}, quoting the invoice number.',
    stdBoven: 'Dear {name},\n\nPlease find below our quote for the work described.',
    stdOnder: 'We trust this is clear and look forward to your approval.',
    datumLoc: 'en-GB', geldLoc: 'en-GB', klantStd: 'Sir or Madam', teBetalen: 'Amount due', van: 'From', betalen: 'Payment',
  },
};

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const alinea = (s) => esc(s).trim().split(/\n\s*\n/).map((p) => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');
const getal = (x) => { const n = Number(String(x == null ? '' : x).replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isFinite(n) ? n : 0; };

export function factuurTotalen(data) {
  const regels = (data.regels || []).filter((r) => r && String(r.omschrijving || '').trim()).slice(0, 10);
  const perTarief = {};
  let excl = 0, incl = 0;
  const uit = regels.map((r) => {
    const aantal = getal(r.aantal === '' || r.aantal == null ? 1 : r.aantal);
    const prijs = getal(r.prijs);
    const pct = getal(r.btw);
    const bruto = Math.round(aantal * prijs * 100) / 100;
    const ex = data.inclBtw ? bruto / (1 + pct / 100) : bruto;
    const btw = data.inclBtw ? bruto - ex : bruto * pct / 100;
    excl += ex; incl += ex + btw;
    perTarief[pct] = perTarief[pct] || { grondslag: 0, btw: 0 };
    perTarief[pct].grondslag += ex; perTarief[pct].btw += btw;
    return { omschrijving: String(r.omschrijving), aantal, prijs, pct, bedrag: bruto };
  });
  const rond = (n) => Math.round(n * 100) / 100;
  const tarieven = Object.keys(perTarief).map(Number).sort((a, b) => b - a).map((p) => ({ pct: p, grondslag: rond(perTarief[p].grondslag), btw: rond(perTarief[p].btw) }));
  return { regels: uit, tarieven, excl: rond(excl), btw: rond(incl - excl), incl: rond(incl) };
}

const STIJL = {
  basis: `
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{width:210mm;min-height:297mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:9.6pt;line-height:1.5;color:#1f2933}
.blad{min-height:297mm;padding:18mm 18mm 16mm;display:flex;flex-direction:column}
.inhoud{flex:1}
table{width:100%;border-collapse:collapse}
.r{text-align:right;white-space:nowrap}
.regels td,.regels th{padding:6px 0;vertical-align:top}
.regels td+td,.regels th+th{padding-left:10px}
.regels .oms{width:56%;overflow-wrap:anywhere}
.totalen{margin:14px 0 0 auto;width:72mm}
.totalen td{padding:3px 0}
.teksten{margin-top:14px}
.teksten p+p{margin-top:8px}
.kor{margin-top:10px;font-size:8.6pt}
.voet{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:8.2pt;margin-top:14px;break-inside:avoid}
.regels tr,.totalen,.teksten{break-inside:avoid}
.logo{max-height:18mm;max-width:60mm;object-fit:contain;display:block}
`,
  // 1 Helder: rustig en modern, één donkerblauwe accentkleur, dunne lijnen.
  1: `
body{font-family:"Inter","Helvetica Neue",Helvetica,Arial,"Liberation Sans",sans-serif}
.kop{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}
.merk{font-size:15pt;font-weight:700;color:#0f2a4a;letter-spacing:-.01em}
.vanregels{font-size:8.6pt;color:#52606d;margin-top:4px}
.titel{font-size:24pt;font-weight:700;color:#0f2a4a;letter-spacing:-.02em;text-align:right}
.meta{display:flex;gap:28px;margin:11mm 0 7mm;padding:10px 0;border-top:1px solid #d9e2ec;border-bottom:1px solid #d9e2ec}
.meta div{font-size:8.6pt;color:#52606d}.meta b{display:block;color:#1f2933;font-size:9.6pt}
.aanblok{margin-bottom:7mm}.aanblok .lbl{font-size:8.2pt;color:#52606d;text-transform:uppercase;letter-spacing:.06em}
.regels thead th{font-size:8.2pt;color:#52606d;font-weight:600;border-bottom:1.5px solid #0f2a4a;text-align:left}
.regels thead th.r{text-align:right}
.regels tbody td{border-bottom:1px solid #e4e7eb}
.totalen tr.eind td{border-top:1.5px solid #0f2a4a;padding-top:7px;font-weight:700;font-size:11pt;color:#0f2a4a}
.voet{border-top:1px solid #d9e2ec;padding-top:8px;color:#52606d}
`,
  // 2 Klassiek: Nederlandse zakelijke brief. Schreefletter, afzender rechts,
  // geadresseerde links op vensterhoogte, kaders om gegevens en regels.
  2: `
body{font-family:Georgia,"Times New Roman","Liberation Serif","DejaVu Serif",serif;color:#111;font-variant-numeric:lining-nums tabular-nums}
.kop{text-align:right}
.kop .logo{margin:0 0 6px auto}
.merk{font-size:16pt;font-weight:700}
.vanregels{font-size:8.6pt;margin-top:3px;color:#333;line-height:1.45}
.brief{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin:12mm 0 10mm}
.aanblok{font-size:10pt;line-height:1.45}.aanblok .lbl{display:none}
.meta{border:1px solid #111;font-size:8.8pt;width:72mm}
.meta td{padding:4px 8px;border-bottom:1px solid #bbb}.meta tr:last-child td{border-bottom:0}
.meta td:first-child{color:#444;width:44%}
.titel{font-size:20pt;font-weight:700;margin:0 0 6mm;letter-spacing:.01em}
.regels{border:1px solid #111}
.regels thead th{background:#ececec;font-weight:700;font-size:8.8pt;border-bottom:1px solid #111;text-align:left;padding:6px 8px}
.regels thead th.r{text-align:right}
.regels td,.regels th{padding:6px 8px;border-left:1px solid #bbb}
.regels td:first-child,.regels th:first-child{border-left:0}
.regels td+td,.regels th+th{padding-left:8px}
.regels tbody td{border-bottom:1px solid #ddd}
.totalen{border:1px solid #111;border-top:0;width:80mm;margin-top:0}
.totalen td{padding:4px 8px}
.totalen tr.eind td{background:#ececec;border-top:1px solid #111;font-weight:700;font-size:11pt;padding:6px 8px}
.voet{justify-content:center;border-top:1px solid #111;padding-top:8px;color:#333;font-size:8pt}
`,
  // 3 Kleur: gekleurde kopbalk met witte tekst, afgerond totaalblok.
  3: `
body{font-family:"Helvetica Neue",Helvetica,Arial,"Liberation Sans",sans-serif}
.blad{padding:0 0 16mm}
.kop{background:#0f766e;color:#fff;padding:14mm 18mm 10mm;display:flex;justify-content:space-between;align-items:flex-end;gap:20px}
.kop .logo{background:#fff;padding:6px;border-radius:6px;margin-bottom:8px}
.merk{font-size:15pt;font-weight:700}
.vanregels{font-size:8.6pt;color:#ccfbf1;margin-top:3px}
.titel{font-size:26pt;font-weight:800;text-align:right;line-height:1}
.inhoud,.voet{padding:0 18mm}
.meta{display:flex;gap:10px;margin:8mm 0 8mm}
.meta div{flex:1;background:#f0fdfa;border-radius:8px;padding:8px 12px;font-size:8.4pt;color:#3f6b66}.meta b{display:block;color:#0b3d38;font-size:9.8pt}
.aanblok{margin-bottom:8mm}.aanblok .lbl{font-size:8.2pt;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:.06em}
.regels thead th{background:#0f766e;color:#fff;font-weight:600;font-size:8.4pt;padding:7px 10px;text-align:left}
.regels thead th.r{text-align:right}
.regels td,.regels th{padding-left:10px;padding-right:10px}
.regels td+td,.regels th+th{padding-left:10px}
.regels tbody tr:nth-child(even) td{background:#f6fbfa}
.totalen{background:#f0fdfa;border-radius:10px;width:80mm;border-collapse:separate;border-spacing:0}
.totalen td{padding:4px 14px}
.totalen tr:first-child td{padding-top:10px}
.totalen tr.eind td{padding-bottom:10px}
.totalen tr.eind td{color:#0f766e;font-weight:800;font-size:12pt;padding-top:7px;border-top:1px solid #99d6cf}
.voet{color:#3f6b66;border-top:3px solid #0f766e;margin:18px 18mm 0;padding:8px 0 0}
`,
  // 4 Zijbalk: donkere kolom links met je gegevens en de betaalinformatie.
  4: `
body{font-family:"Helvetica Neue",Helvetica,Arial,"Liberation Sans",sans-serif}
.blad{padding:0;display:grid;grid-template-columns:64mm 1fr;min-height:297mm}
.zij{background:#1e293b;color:#cbd5e1;padding:18mm 9mm 14mm;display:flex;flex-direction:column;gap:9mm;font-size:8.6pt;line-height:1.55}
.zij .logo{background:#fff;padding:6px;border-radius:4px;max-width:46mm}
.zij .merk{color:#fff;font-size:13pt;font-weight:700;line-height:1.25}
.zij .vanregels{margin-top:5px}
.zij .lbl{color:#fbbf24;font-size:7.6pt;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-bottom:3px}
.zij .meta div{margin-bottom:6px}.zij .meta b{display:block;color:#fff;font-size:9.6pt;font-weight:600}
.zij .betaal{margin-top:auto}.zij .betaal span{display:block}
.hoofd{padding:18mm 16mm 14mm 14mm;display:flex;flex-direction:column}
.titel{font-size:30pt;font-weight:800;color:#1e293b;letter-spacing:-.02em;line-height:1;margin-bottom:10mm}
.titel small{display:block;font-size:10pt;font-weight:600;color:#64748b;letter-spacing:0;margin-top:6px}
.aanblok{margin-bottom:9mm}.aanblok .lbl{font-size:7.6pt;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:.12em;margin-bottom:2px}
.regels thead th{font-size:7.8pt;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #1e293b;text-align:left}
.regels thead th.r{text-align:right}
.regels tbody td{border-bottom:1px solid #e2e8f0}
.regels .oms{width:50%}
.totalen{width:70mm}
.totalen tr.eind td{background:#1e293b;color:#fff;font-weight:700;font-size:11pt;padding:8px 10px}
.totalen tr.eind td.r{color:#fbbf24}
`,
  // 5 Minimaal: grote letters, veel wit, alleen het totaal in kleur.
  5: `
body{font-family:"Helvetica Neue",Helvetica,Arial,"Liberation Sans",sans-serif;color:#18181b}
.blad{padding:20mm 20mm 16mm}
.kop{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;font-size:8.8pt}
.merk{font-weight:700;font-size:10pt}
.vanregels{color:#71717a;text-align:right;line-height:1.55}
.titel{font-size:44pt;font-weight:300;letter-spacing:-.03em;line-height:1;margin:16mm 0 10mm}
.raster{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:10mm;margin-bottom:12mm;font-size:9pt}
.raster .lbl,.meta div{color:#a1a1aa;font-size:7.8pt;text-transform:uppercase;letter-spacing:.14em}
.raster .lbl{margin-bottom:4px}
.meta div{margin-bottom:8px}.meta b{display:block;color:#18181b;font-size:9.4pt;letter-spacing:0;text-transform:none;font-weight:500;margin-top:2px}
.bedragblok b{display:block;font-size:22pt;font-weight:600;color:#e4572e;letter-spacing:-.02em;line-height:1.1;margin-top:4px}
.bedragblok .lbl{margin:0}
.regels{font-variant-numeric:tabular-nums}
.regels thead th{font-size:7.8pt;color:#a1a1aa;font-weight:500;text-transform:uppercase;letter-spacing:.14em;text-align:left;padding-bottom:8px}
.regels thead th.r{text-align:right}
.regels tbody td{border-top:1px solid #e4e4e7;padding:9px 0}
.totalen{font-variant-numeric:tabular-nums;width:76mm;margin-top:6mm}
.totalen td{color:#52525b}
.totalen tr.eind td{color:#18181b;font-weight:600;font-size:12pt;border-top:1px solid #18181b;padding-top:8px}
.voet{color:#a1a1aa;font-size:7.8pt;justify-content:space-between}
`,
  // 6 Zacht: warme zandkleur, witte afgeronde vlakken, terracotta accent.
  6: `
body{font-family:"Avenir Next","Nunito","Trebuchet MS","Helvetica Neue",Arial,"DejaVu Sans",sans-serif;color:#3d2c24;background:#f7efe6}
html{background:#f7efe6}
.blad{padding:14mm 14mm 12mm;background:#f7efe6}
.kaart{background:#fff;border-radius:14px;padding:9mm 10mm}
.kop{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:6mm}
.kop .logo{margin-bottom:6px}
.merk{font-size:15pt;font-weight:700;color:#3d2c24}
.vanregels{font-size:8.6pt;color:#8a6f62;margin-top:3px}
.titel{font-size:22pt;font-weight:700;color:#b4552d;text-align:right}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 6mm}
.meta div{background:#fff;border-radius:999px;padding:6px 14px;font-size:8.4pt;color:#8a6f62}.meta b{color:#3d2c24;margin-left:5px;font-weight:600}
.aanblok{margin-bottom:6mm;background:#fff;border-radius:14px;padding:6mm 10mm}.aanblok .lbl{font-size:8pt;font-weight:700;color:#b4552d;margin-bottom:2px}
.regels thead th{font-size:8.2pt;color:#8a6f62;font-weight:600;text-align:left;border-bottom:1.5px solid #f0e2d4}
.regels thead th.r{text-align:right}
.regels tbody td{border-bottom:1px solid #f5ece3}
.regels tbody tr:last-child td{border-bottom:0}
.totalen{width:78mm;border-collapse:separate;border-spacing:0}
.totalen td{padding:4px 12px}
.totalen tr.eind td{background:#b4552d;color:#fff;font-weight:700;font-size:11.5pt;padding:8px 12px}
.totalen tr.eind td:first-child{border-radius:10px 0 0 10px}.totalen tr.eind td:last-child{border-radius:0 10px 10px 0}
.teksten{margin-top:6mm}
.voet{color:#8a6f62;justify-content:center;font-size:8pt}
`,
};

export function factuurHtml(data, sjabloon) {
  const d = data || {};
  const t = T[d.taal === 'en' ? 'en' : 'nl'];
  const nr = [1, 2, 3, 4, 5, 6].includes(Number(sjabloon)) ? Number(sjabloon) : 1;
  const van = d.van || {}, aan = d.aan || {};
  const tot = factuurTotalen(d);
  const geld = (n) => new Intl.NumberFormat(t.geldLoc, { style: 'currency', currency: 'EUR' }).format(n || 0);
  const dag = (s) => { const x = /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) ? new Date(s + 'T12:00:00') : null; return x ? x.toLocaleDateString(t.datumLoc, { day: 'numeric', month: 'long', year: 'numeric' }) : esc(s || ''); };
  const offerte = d.soort === 'offerte';
  const korRegel = !String(van.btw || '').trim() && tot.btw === 0 && tot.regels.length > 0;
  const vul = (s) => String(s || '').replace(/\{betalingstermijn\}/g, d.termijn || '14').replace(/\{iban\}/g, van.iban || '').replace(/\{tnv\}/g, van.tnv || van.bedrijf || '').replace(/\{naam\}|\{name\}|\{recipient\.name\}/g, aan.naam || aan.bedrijf || t.klantStd);
  const teksten = offerte
    ? [vul(d.tekstBoven || t.stdBoven), vul(d.tekstOnder || t.stdOnder)]
    : [vul(d.voorwaarden || t.stdVoorwaarden)];
  const vanRegels = [van.adres, [van.postcode, van.plaats].filter(Boolean).join(' '), van.email, van.tel, van.web].filter((x) => String(x || '').trim());
  const aanRegels = [aan.bedrijf, aan.naam && aan.naam !== aan.bedrijf ? aan.naam : '', aan.adres, [aan.postcode, aan.plaats].filter(Boolean).join(' '), aan.kvk ? t.kvk + ' ' + aan.kvk : ''].filter((x) => String(x || '').trim());
  const logo = van.logo && /^(https?:|data:image\/)/.test(van.logo) ? '<img class="logo" src="' + esc(van.logo) + '" alt="">' : '';
  const titel = offerte ? t.offerte : t.factuur;
  const merk = logo + '<div class="merk">' + esc(van.bedrijf || '') + '</div>';
  const metaItems = [[t.nummer, esc(d.nummer || '')], [t.datum, dag(d.datum)], [offerte ? t.geldig : t.verval, dag(offerte ? d.geldigTot : d.verval)]];
  const metaDivs = metaItems.map((m) => '<div>' + m[0] + '<b>' + m[1] + '</b></div>').join('');
  const meta = '<div class="meta">' + metaDivs + '</div>';
  const aanBlok = '<div class="aanblok"><div class="lbl">' + t.aan + '</div>' + aanRegels.map((x) => '<div>' + esc(x) + '</div>').join('') + '</div>';
  const regels = '<table class="regels"><thead><tr><th class="oms">' + t.omschrijving + '</th><th class="r">' + t.aantal + '</th><th class="r">' + t.prijs + (d.inclBtw ? ' ' + t.incl.split(' ')[0] : '') + '</th><th class="r">' + t.btw + '</th><th class="r">' + t.bedrag + '</th></tr></thead><tbody>' +
    tot.regels.map((r) => '<tr><td class="oms">' + esc(r.omschrijving) + '</td><td class="r">' + String(r.aantal).replace('.', t.geldLoc === 'nl-NL' ? ',' : '.') + '</td><td class="r">' + geld(r.prijs) + '</td><td class="r">' + r.pct + '%</td><td class="r">' + geld(r.bedrag) + '</td></tr>').join('') + '</tbody></table>';
  const totalen = '<table class="totalen">' + (tot.btw > 0 ? '<tr><td>' + t.subtotaal + ' ' + t.excl + '</td><td class="r">' + geld(tot.excl) + '</td></tr>' : '') +
    tot.tarieven.filter((x) => x.pct > 0).map((x) => '<tr><td>' + t.btwOver(x.pct, geld(x.grondslag)) + '</td><td class="r">' + geld(x.btw) + '</td></tr>').join('') +
    '<tr class="eind"><td>' + t.totaal + (tot.btw > 0 ? ' ' + t.incl : '') + '</td><td class="r">' + geld(tot.incl) + '</td></tr></table>';
  const korP = korRegel ? '<p class="kor">' + t.kor + '</p>' : '';
  const boven = offerte ? '<div class="teksten" style="margin:0 0 8mm">' + alinea(teksten[0]) + '</div>' : '';
  const onder = offerte
    ? '<div class="teksten">' + alinea(teksten[1]) + (d.opmerking ? alinea(d.opmerking) : '') + korP + '</div>'
    : '<div class="teksten">' + teksten.filter((x) => String(x).trim()).map(alinea).join('') + (d.opmerking ? alinea(d.opmerking) : '') + korP + '</div>';
  const voetItems = [van.bedrijf, van.kvk ? t.kvk + ' ' + van.kvk : '', van.btw ? t.btwNr + ' ' + van.btw : '', van.iban ? t.iban + ' ' + van.iban + (van.tnv ? ' ' + t.tnv + ' ' + van.tnv : '') : ''].filter(Boolean);
  const voet = '<div class="voet">' + voetItems.map((x) => '<span>' + esc(x) + '</span>').join('') + '</div>';
  let blad;
  if (nr === 1) {
    blad = '<div class="inhoud"><div class="kop"><div>' + merk + '<div class="vanregels">' + vanRegels.map(esc).join('<br>') + '</div></div><div class="titel">' + titel + '</div></div>' + meta + aanBlok + boven + regels + totalen + onder + '</div>' + voet;
  } else if (nr === 2) {
    const metaTabel = '<table class="meta">' + metaItems.map((m) => '<tr><td>' + m[0] + '</td><td>' + m[1] + '</td></tr>').join('') + '</table>';
    blad = '<div class="inhoud"><div class="kop">' + merk + '<div class="vanregels">' + vanRegels.map(esc).join('<br>') + '</div></div><div class="brief">' + aanBlok + metaTabel + '</div><div class="titel">' + titel + '</div>' + boven + regels + totalen + onder + '</div>' + voet;
  } else if (nr === 3) {
    blad = '<div class="kop"><div>' + merk + '<div class="vanregels">' + vanRegels.map(esc).join(' · ') + '</div></div><div class="titel">' + titel + '</div></div><div class="inhoud">' + meta + aanBlok + boven + regels + totalen + onder + '</div>' + voet;
  } else if (nr === 4) {
    const betaal = voetItems.slice(1).map((x) => '<span>' + esc(x) + '</span>').join('');
    blad = '<aside class="zij"><div>' + merk + '<div class="vanregels">' + vanRegels.map(esc).join('<br>') + '</div></div><div class="meta">' + metaDivs + '</div>' + (betaal ? '<div class="betaal"><div class="lbl">' + t.betalen + '</div>' + betaal + '</div>' : '') + '</aside>' +
      '<main class="hoofd"><div class="inhoud"><div class="titel">' + titel + '<small>' + esc(d.nummer || '') + '</small></div>' + aanBlok + boven + regels + totalen + onder + '</div></main>';
  } else if (nr === 5) {
    const bedrag = '<div class="bedragblok"><div class="lbl">' + (offerte ? t.totaal : t.teBetalen) + '</div><b>' + geld(tot.incl) + '</b></div>';
    blad = '<div class="inhoud"><div class="kop"><div>' + merk + '</div><div class="vanregels">' + vanRegels.map(esc).join('<br>') + '</div></div><div class="titel">' + titel + '</div>' +
      '<div class="raster">' + aanBlok + meta + bedrag + '</div>' + boven + regels + totalen + onder + '</div>' + voet;
  } else {
    blad = '<div class="inhoud"><div class="kaart kop"><div>' + merk + '<div class="vanregels">' + vanRegels.map(esc).join(' · ') + '</div></div><div class="titel">' + titel + '</div></div>' + meta + aanBlok +
      '<div class="kaart">' + boven + regels + totalen + onder + '</div></div>' + voet;
  }
  return '<!doctype html><html lang="' + (d.taal === 'en' ? 'en' : 'nl') + '"><head><meta charset="utf-8"><title>' + esc(titel + ' ' + (d.nummer || '')) + '</title><style>' + STIJL.basis + STIJL[nr] + '</style></head><body><div class="blad">' + blad + '</div></body></html>';
}

export const SJABLONEN = [
  { nr: 1, naam: 'Helder', uitleg: 'Rustig en modern, blauwe lijnen', naamEn: 'Clean', uitlegEn: 'Calm and modern, blue lines' },
  { nr: 2, naam: 'Klassiek', uitleg: 'Zakelijke brief met kaders', naamEn: 'Classic', uitlegEn: 'Formal business letter, boxed' },
  { nr: 3, naam: 'Kleur', uitleg: 'Gekleurde kopbalk, opvallend', naamEn: 'Colour', uitlegEn: 'Bold coloured header' },
  { nr: 4, naam: 'Zijbalk', uitleg: 'Donkere kolom met je gegevens', naamEn: 'Sidebar', uitlegEn: 'Dark column with your details' },
  { nr: 5, naam: 'Minimaal', uitleg: 'Grote letters, veel ruimte', naamEn: 'Minimal', uitlegEn: 'Large type, lots of space' },
  { nr: 6, naam: 'Zacht', uitleg: 'Warme tinten, ronde vlakken', naamEn: 'Soft', uitlegEn: 'Warm tones, rounded panels' },
];
