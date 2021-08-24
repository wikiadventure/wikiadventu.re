const disheList:Array<string> = [
  "Cobbler",
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
    var randomDisheID = Math.floor(Math.random() * disheList.length);
    var randomActionID = Math.floor(Math.random() * actionList.length);
    return disheList[randomDisheID] + actionList[randomActionID];
}