/// <reference types="vite/client" />

// content/nieuws/nieuws.json via de alias in vite.config.ts. Formaat: content/README.md.
type NieuwsItem = {
  id: string;
  datum: string;
  kanaal?: 'profiel' | 'pagina';
  titel?: string | null;
  tekst: string;
  afbeelding?: string | null;
  urlProfiel?: string | null;
  urlPagina?: string | null;
  taal?: 'nl' | 'en' | 'ja';
  cluster?: string;
  blogSlug?: string | null;
  // impressies blijft buiten de bundel (vite.config.ts); de app ziet alleen de rang.
  rang?: number;
  media?: NieuwsMedia;
};
type NieuwsMedia =
  | { type: 'carrousel'; pdf: string; paginas: string[]; tekstPerPagina: string[] }
  | { type: 'video'; src: string; poster?: string; transcript: string };
declare module '@nieuws' {
  const items: NieuwsItem[];
  export default items;
}
