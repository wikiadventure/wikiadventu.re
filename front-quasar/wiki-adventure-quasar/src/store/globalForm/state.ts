import { Lang } from "src/i18n";

export interface GlobalForm {
  lang: Lang;
  pseudo: string;
  lobbyID: string;
}


const state: GlobalForm = {
  lang: Lang.en,
  pseudo: "",
  lobbyID: ""
};

export default state;
