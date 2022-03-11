import { Lang } from "src/i18n";
import { ref } from "vue";
import { LobbyType } from "./type";
import { GamePhaseType, VanillaPhaseType } from "./game/phase/type";
import { GameLoopType, VanillaLoopType } from "./game/loop/type";

export const id = ref("");
export const lang = ref(Lang.en);
export const type = ref(LobbyType.Public);
export const slot = ref(0);
export const gameLoop = ref<GameLoopType>(VanillaLoopType.Classic);
export const gamePhase = ref<GamePhaseType> (VanillaPhaseType.Waiting);
export const time = ref(0);// The duration of the round
export const timeController = ref(new AbortController());// The time Controller is responsible to update the time left
export const timeLeft = ref(0);// Time left until the end of the round updated live to be display on screen
export const timeStamp = ref(0);// A timestamp of when the current round start used by the Time Controller
export const round = ref(0);
export const currentRound = ref(0);

export function lobbyReset() {
    gamePhase.value = VanillaPhaseType.Waiting;
    time.value = 0;
    timeController.value = new AbortController();
    timeLeft.value = 0
    timeStamp.value = 0
    round.value = 0
    currentRound.value = 0
}
