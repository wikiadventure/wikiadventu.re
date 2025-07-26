export const langs = {
  en : "English",//English
  fr : "Français",//French
  de : "Deutsch",//German
  // es : "Español",//Spanish
  // it : "Italiano",//Italian
  eo : "Esperanto",//Esperanto
  // pt : "Português",//Portugues
  // el : "Eλληνικά",//Greek
  // sv : "Svenska",//Swedish
} as const;


export type LangType = typeof langs;

export type LangLabel = LangType[keyof LangType];

export type LangCode = keyof LangType;

export const langsKey = Object.keys(langs) as LangCode[];
