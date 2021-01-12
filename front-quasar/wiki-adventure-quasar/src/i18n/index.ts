import en from './en';
import fr from './fr';

export default {
  "en": en,
  "fr": fr
};

export enum Lang {
  en = "EN",
  fr = "FR",
  de = "DE",
  es = "ES",
  it = "IT",
  eo = "EO",
  pt = "PT"
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
