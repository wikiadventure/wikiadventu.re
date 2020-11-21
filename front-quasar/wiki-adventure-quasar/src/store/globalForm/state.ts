export interface GlobalForm {
  lang: Lang;
  pseudo: string;
  lobbyID: string;
}

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

const state: GlobalForm = {
  lang: Lang.en,
  pseudo: "",
  lobbyID: ""
};

export default state;
