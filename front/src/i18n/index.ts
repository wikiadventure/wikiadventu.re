import { computed } from "vue";
import { i18n } from "src/boot/i18n";
import en from './en';
import fr from './fr';

export type MessageSchema = typeof en;

export default {
  en: en,
  fr: fr
};

/**
 * Lang that currently have translation
 */
export type SupportedLang = Lang.en | Lang.fr;

/* The wikipedia lang extension used
  it's en for english wikipedia which
  result to the en.wikipedia.org */
export enum Lang {
  en = "en",//English
  fr = "fr",//French
  de = "de",//German
  es = "es",//Spanish
  it = "it",//Italian
  eo = "eo",//Esperanto
  pt = "pt",//Portugues
  el = "el",//Greek
  sv = "sv",//Swedish
}

// Denomination in original language
export function getLabel(lang:string):string {
  switch (lang) {
    case Lang.en: return "English";
    case Lang.de: return "Deutsch";
    case Lang.fr: return "Français";
    case Lang.es: return "Español";
    case Lang.it: return "italiano";
    case Lang.eo: return "Esperanto";
    case Lang.pt: return "Português";
    case Lang.el: return "Eλληνικά";
    case Lang.sv: return "Svenska";
    default: return lang;
  }
}

export const langLabel = computed(()=>{
  //return getLabel(i18n.global.locale);
  switch (i18n.global.locale) {
    case Lang.en: return "English";
    case Lang.de: return "Deutsch";
    case Lang.fr: return "Français";
    case Lang.es: return "Español";
    case Lang.it: return "italiano";
    case Lang.eo: return "Esperanto";
    case Lang.pt: return "Português";
    case Lang.el: return "Eλληνικά";
    case Lang.sv: return "Svenska";
    default: return i18n.global.locale;
  }
});

export const allLangOptions:Array<{ value:string, label:string }> = [];
for (var v in Lang) {
  var option:{ value:string, label:string } = {value: v, label: getLabel(v)};
  allLangOptions.push(option);
}
