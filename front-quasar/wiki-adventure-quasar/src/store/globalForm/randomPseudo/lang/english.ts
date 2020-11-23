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
export function getEnglish():string {
    var randomDisheID = Math.floor(Math.random() * Math.floor(disheList.length));
    var randomActionID = Math.floor(Math.random() * Math.floor(actionList.length));
    return disheList[randomDisheID] + actionList[randomActionID];
}