import { Lang } from "src/i18n"
import { startTimer } from "./actions"
import { VanillaLoopType } from "./game/loop/type";
import { VanillaPhaseType } from "./game/phase/type";
import { lang, slot, gameLoop, gamePhase, timeController, timeLeft, round, currentRound, timeStamp, type } from "./state"
import { LobbyType } from "./type";


export function lobbySetup() {
    return {
      lang,
      type,
      slot,
      gameLoop,
      gamePhase,
      timeController,
      timeLeft,
      timeStamp,
      round,
      currentRound,
      startTimer
    }
}
