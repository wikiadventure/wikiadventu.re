import { Lang } from "src/i18n";
import { GameLoopType } from "../gameData/type/gameLoop";

export interface GlobalForm {
  lang: Lang;
  pseudo: string;
  lobbyID: string;
  gameLoop: number;
  slot: number;
  connecting: boolean;
}

const state: GlobalForm = {
  lang: Lang.en,
  pseudo: "",
  lobbyID: "",
  gameLoop: GameLoopType.Classic,
  slot: 15,
  connecting: false
};

export default state;
