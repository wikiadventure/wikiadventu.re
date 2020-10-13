import { Lang } from '../state';

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
const disheList:Array<string> = [
  "Cobbler",
  "Faggots",
  "Scones",
  "Brownie",
  "Cookie",
  "Muffins",
  "Tea",
  "PopCorn"
];
const actionList:Array<string> = [
  "Monster",
  "Devourer",
  "Smasher",
  "Lawyer",
  "Zealot",
  "Leader",
  "Dealer",
  "Manager"
];
function getEnglish():string {


    var randomDisheID = Math.floor(Math.random() * Math.floor(disheList.length));
    var randomActionID = Math.floor(Math.random() * Math.floor(actionList.length));
    return disheList[randomDisheID] + actionList[randomActionID];
}




