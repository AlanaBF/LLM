export const LANGUAGES = [
  { code: 'fr', label: 'French', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', label: 'German', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'it', label: 'Italian', flag: '🇮🇹', speechCode: 'it-IT' },
] as const;

export type LangCode = typeof LANGUAGES[number]['code'];
