import { Lang } from 'src/i18n';
import { getEnglish } from './lang/english';

export function getRandomPseudo(lang:string):string {
    switch (lang) {
      case Lang.en:
        return getEnglish();
      case Lang.de:
        return "Anonymous";
      case Lang.fr:
        return "Anonymous";
      case Lang.es:
        return "Anonymous";
      case Lang.it:
        return "Anonymous";
      case Lang.eo:
        return "Anonymous";
      case Lang.pt:
        return "Anonymous"; 
      default:
        return "Anonymous";
    }
}