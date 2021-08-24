import { Lang } from 'src/i18n';
import { lang, pseudo } from '../state';
import { getEnglish } from './lang/english';
import { getFrench } from './lang/french';

export function getRandomPseudo(lang:Lang):string {
    switch (lang) {
      case Lang.en:
        return getEnglish();
      case Lang.de:
        return "Anonymous";
      case Lang.fr:
        return getFrench();
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

export function randomizePseudo() {
  pseudo.value = getRandomPseudo(lang.value);
}
