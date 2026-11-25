// Reviews en scores. De gegevens staan in reviews.json, zodat de n8n-flow
// "Site: reviews bijwerken" ze elke maand kan bijwerken zonder code te raken
// (afgesproken uitzondering op deploy-na-akkoord: alleen dat ene bestand).
// Teksten letterlijk van Google en de Moneybird-expertpagina. 'vertaling' is de
// Engelse vertaling van Google zelf; die tonen we op Engelse pagina's met het
// label "Translated by Google".
// Niet tonen (lijst 'uitgesloten' in reviews.json, de flow leest die ook):
// Serena Arendzen (partner), de anonieme Moneybird-review van 26-10-2026
// (familie), Iona Susanto (4 sterren, kanttekening), Santino Heij (gaat over
// NettoCheck, niet de dienst) en Sri Kurniati (moeder van Edwin Postma van Make
// Bouw, die zelf al een review gaf).
import data from './reviews.json';

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

export const google: { score: string; aantal: number; profiel: string } = data.google;
export const moneybird: { adviser: string; score: string; aantal: number; profiel: string } = data.moneybird;
export const reviews: Review[] = data.reviews as Review[];
