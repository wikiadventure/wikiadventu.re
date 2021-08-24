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

export function lobbyReset() {
  lang.value = Lang.en;
  type.value = LobbyType.Public;
  slot.value = 0;
  gameLoop.value = VanillaLoopType.Classic;
  gamePhase.value = VanillaPhaseType.Waiting;
  timeController.value = new AbortController();
  timeLeft.value = 0
  timeStamp.value = 0
  round.value = 0
  currentRound.value = 0
}