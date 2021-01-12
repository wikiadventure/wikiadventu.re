const disheList:Array<string> = [
  "Lasagne",
  "Gateau",
  "Lanterne",
  "Tomate",
  "Fromage",
  "Pain",
  "Kouing-Amann",
  "Flan",
  "Choucroute",
  "Chocolat",
  "Macaron",
  "Bouquet",
  "Camembert",
  "Munster",
  "Roquefort",
  "Croissant",
  "Gruyère",
  "Emmental",
  "Frites",
  "Moules",
  "Saucisse",
  "Camembert",
  "Beurre"
];
const actionList:Array<string> = [
  "Chef",
  "Escargot",
  "Commis",
  "Voleur de",
  "Braconnier",
  "Oiseau",
  "Tortue",
  "Poisson",
  "Grenouille",
  "Pigeon",
  "Champion",
  "Ragondin",
  "Pilote",
  "Maréchal",
  "Sergent",
  "Colonel",
  "Dealer de",
  "Président"
];
export function getFrench():string {
    var randomDisheID = Math.floor(Math.random() * Math.floor(disheList.length));
    var randomActionID = Math.floor(Math.random() * Math.floor(actionList.length));
    return actionList[randomActionID] + disheList[randomDisheID];
}
