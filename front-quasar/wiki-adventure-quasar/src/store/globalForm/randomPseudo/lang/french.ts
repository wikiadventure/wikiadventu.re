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
  "Voleur_de",
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
  "Dealer_de",
  "Président"
];
export function getEnglish():string {
    var randomDisheID = Math.floor(Math.random() * Math.floor(disheList.length));
    var randomActionID = Math.floor(Math.random() * Math.floor(actionList.length));
    return actionList[randomActionID] + "_" + disheList[randomDisheID];
}
