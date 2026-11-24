// Factuur- en offertesjablonen voor Slim Light (23-11-2026).
// Eén bron voor twee plekken: het live voorbeeld op /slim-chatbot-instellingen
// en (na overstap) de pdf in n8n via Gotenberg (chromium, A4). Daarom gewoon
// JavaScript zonder afhankelijkheden: factuurHtml(data, sjabloon) geeft een
// compleet HTML-document terug.
//
// sjabloon: 1 Helder, 2 Klassiek, 3 Kleur (zelfde nummers als in de mastersheet).
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
    datumLoc: 'nl-NL', geldLoc: 'nl-NL', klantStd: 'heer of mevrouw',
  },
  en: {
    factuur: 'Invoice', offerte: 'Quote', nummer: 'Number', datum: 'Date', verval: 'Due date', geldig: 'Valid until',
    aan: 'To', omschrijving: 'Description', aantal: 'Qty', prijs: 'Price', btw: 'VAT', bedrag: 'Amount',
    subtotaal: 'Subtotal', btwOver: (p, b) => 'VAT ' + p + '% on ' + b, totaal: 'Total', excl: 'excl. VAT', incl: 'incl. VAT',
    kvk: 'Chamber of Commerce', btwNr: 'VAT ID', iban: 'IBAN', tnv: 'in the name of',
    kor: 'No VAT charged: exempt under the Dutch small business scheme (KOR).',
    stdVoorwaarden: 'Please transfer the amount within {betalingstermijn} days to {iban} in the name of {tnv}, quoting the invoice number.',
    stdBoven: 'Dear {naam},\n\nPlease find below our quote for the work described.',
    stdOnder: 'We trust this is clear and look forward to your approval.',
    datumLoc: 'en-GB', geldLoc: 'en-GB', klantStd: 'Sir or Madam',
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
  // 2 Klassiek: zakelijke brief, schreefletter, zwart-wit, gecentreerde kop.
  2: `
body{font-family:Georgia,"Times New Roman","Liberation Serif","DejaVu Serif",serif;color:#111}
.kop{text-align:center;padding-bottom:10px;border-bottom:3px double #111}
.kop .logo{margin:0 auto 8px}
.merk{font-size:17pt;letter-spacing:.04em;text-transform:uppercase}
.vanregels{font-size:8.6pt;margin-top:4px;color:#333}
.titel{font-size:13pt;letter-spacing:.3em;text-transform:uppercase;text-align:center;margin:8mm 0 2mm}
.meta{display:flex;justify-content:center;gap:26px;margin:0 0 9mm;font-size:8.8pt}
.meta div{color:#444}.meta b{font-weight:400;color:#111;margin-left:6px}
.aanblok{margin-bottom:8mm}.aanblok .lbl{font-style:italic;color:#444}
.regels thead th{font-weight:400;font-style:italic;border-bottom:1px solid #111;text-align:left}
.regels thead th.r{text-align:right}
.regels tbody td{border-bottom:1px dotted #999}
.totalen tr.eind td{border-top:1px solid #111;border-bottom:3px double #111;padding:6px 0;font-size:11pt}
.voet{justify-content:center;border-top:1px solid #111;padding-top:8px;color:#333}
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
};

export function factuurHtml(data, sjabloon) {
  const d = data || {};
  const t = T[d.taal === 'en' ? 'en' : 'nl'];
  const nr = [1, 2, 3].includes(Number(sjabloon)) ? Number(sjabloon) : 1;
  const van = d.van || {}, aan = d.aan || {};
  const tot = factuurTotalen(d);
  const geld = (n) => new Intl.NumberFormat(t.geldLoc, { style: 'currency', currency: 'EUR' }).format(n || 0);
  const dag = (s) => { const x = /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) ? new Date(s + 'T12:00:00') : null; return x ? x.toLocaleDateString(t.datumLoc, { day: 'numeric', month: 'long', year: 'numeric' }) : esc(s || ''); };
  const offerte = d.soort === 'offerte';
  const korRegel = !String(van.btw || '').trim() && tot.btw === 0 && tot.regels.length > 0;
  const vul = (s) => String(s || '').replace(/\{betalingstermijn\}/g, d.termijn || '14').replace(/\{iban\}/g, van.iban || '').replace(/\{tnv\}/g, van.tnv || van.bedrijf || '').replace(/\{naam\}|\{recipient\.name\}/g, aan.naam || aan.bedrijf || t.klantStd);
  const teksten = offerte
    ? [vul(d.tekstBoven || t.stdBoven), vul(d.tekstOnder || t.stdOnder)]
    : [vul(d.voorwaarden || t.stdVoorwaarden)];
  const vanRegels = [van.adres, [van.postcode, van.plaats].filter(Boolean).join(' '), van.email, van.tel, van.web].filter((x) => String(x || '').trim());
  const aanRegels = [aan.bedrijf, aan.naam && aan.naam !== aan.bedrijf ? aan.naam : '', aan.adres, [aan.postcode, aan.plaats].filter(Boolean).join(' '), aan.kvk ? t.kvk + ' ' + aan.kvk : ''].filter((x) => String(x || '').trim());
  const logo = van.logo && /^(https?:|data:image\/)/.test(van.logo) ? '<img class="logo" src="' + esc(van.logo) + '" alt="">' : '';
  const kop = nr === 3
    ? '<div class="kop"><div>' + logo + '<div class="merk">' + esc(van.bedrijf || '') + '</div><div class="vanregels">' + vanRegels.map(esc).join(' · ') + '</div></div><div class="titel">' + (offerte ? t.offerte : t.factuur) + '</div></div>'
    : nr === 2
      ? '<div class="kop">' + logo + '<div class="merk">' + esc(van.bedrijf || '') + '</div><div class="vanregels">' + vanRegels.map(esc).join(' &nbsp;|&nbsp; ') + '</div></div><div class="titel">' + (offerte ? t.offerte : t.factuur) + '</div>'
      : '<div class="kop"><div>' + logo + '<div class="merk">' + esc(van.bedrijf || '') + '</div><div class="vanregels">' + vanRegels.map(esc).join('<br>') + '</div></div><div class="titel">' + (offerte ? t.offerte : t.factuur) + '</div></div>';
  const meta = '<div class="meta"><div>' + t.nummer + '<b>' + esc(d.nummer || '') + '</b></div><div>' + t.datum + '<b>' + dag(d.datum) + '</b></div><div>' + (offerte ? t.geldig : t.verval) + '<b>' + dag(offerte ? d.geldigTot : d.verval) + '</b></div></div>';
  const aanBlok = '<div class="aanblok"><div class="lbl">' + t.aan + '</div>' + aanRegels.map((x) => '<div>' + esc(x) + '</div>').join('') + '</div>';
  const regels = '<table class="regels"><thead><tr><th class="oms">' + t.omschrijving + '</th><th class="r">' + t.aantal + '</th><th class="r">' + t.prijs + (d.inclBtw ? ' ' + t.incl.split(' ')[0] : '') + '</th><th class="r">' + t.btw + '</th><th class="r">' + t.bedrag + '</th></tr></thead><tbody>' +
    tot.regels.map((r) => '<tr><td class="oms">' + esc(r.omschrijving) + '</td><td class="r">' + String(r.aantal).replace('.', t.geldLoc === 'nl-NL' ? ',' : '.') + '</td><td class="r">' + geld(r.prijs) + '</td><td class="r">' + r.pct + '%</td><td class="r">' + geld(r.bedrag) + '</td></tr>').join('') + '</tbody></table>';
  const totalen = '<table class="totalen">' + (tot.btw > 0 ? '<tr><td>' + t.subtotaal + ' ' + t.excl + '</td><td class="r">' + geld(tot.excl) + '</td></tr>' : '') +
    tot.tarieven.filter((x) => x.pct > 0).map((x) => '<tr><td>' + t.btwOver(x.pct, geld(x.grondslag)) + '</td><td class="r">' + geld(x.btw) + '</td></tr>').join('') +
    '<tr class="eind"><td>' + t.totaal + (tot.btw > 0 ? ' ' + t.incl : '') + '</td><td class="r">' + geld(tot.incl) + '</td></tr></table>';
  const tekstBlok = '<div class="teksten">' + teksten.filter((x) => String(x).trim()).map(alinea).join('') + (d.opmerking ? alinea(d.opmerking) : '') + (korRegel ? '<p class="kor">' + t.kor + '</p>' : '') + '</div>';
  const voet = '<div class="voet">' + [van.bedrijf, van.kvk ? t.kvk + ' ' + van.kvk : '', van.btw ? t.btwNr + ' ' + van.btw : '', van.iban ? t.iban + ' ' + van.iban + (van.tnv ? ' ' + t.tnv + ' ' + van.tnv : '') : ''].filter(Boolean).map((x) => '<span>' + esc(x) + '</span>').join('') + '</div>';
  const boven = offerte ? '<div class="teksten" style="margin:0 0 8mm">' + alinea(teksten[0]) + '</div>' : '';
  const onder = offerte ? '<div class="teksten">' + alinea(teksten[1]) + (korRegel ? '<p class="kor">' + t.kor + '</p>' : '') + '</div>' : tekstBlok;
  return '<!doctype html><html lang="' + (d.taal === 'en' ? 'en' : 'nl') + '"><head><meta charset="utf-8"><title>' + esc((offerte ? t.offerte : t.factuur) + ' ' + (d.nummer || '')) + '</title><style>' + STIJL.basis + STIJL[nr] + '</style></head><body><div class="blad">' +
    (nr === 3 ? kop : '') + '<div class="inhoud">' + (nr === 3 ? '' : kop) + meta + aanBlok + boven + regels + totalen + onder + '</div>' + voet + '</div></body></html>';
}

export const SJABLONEN = [
  { nr: 1, naam: 'Helder', uitleg: 'Rustig en modern, donkerblauw' },
  { nr: 2, naam: 'Klassiek', uitleg: 'Zakelijke brief, zwart-wit' },
  { nr: 3, naam: 'Kleur', uitleg: 'Gekleurde kop, opvallend' },
];
