import en from './en';
import fr from './fr';

export default {
  "en": en,
  "fr": fr
};

export enum Lang {
  en = "en",
  fr = "fr",
  de = "de",
  es = "es",
  it = "it",
  eo = "eo",
  pt = "pt"
}

export function getLabel(lang:string):string {
  switch (lang) {
    case Lang.en:
      return "English";
    case Lang.de:
      return "Deutsch";
    case Lang.fr:
      return "Français";
    case Lang.es:
      return "Español";
    case Lang.it:
      return "italiano";
    case Lang.eo:
      return "Esperanto";
    case Lang.pt:
      return "Português"; 
    default:
      return "";
  }
}
