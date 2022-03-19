import { ref } from "vue";
import { Player } from "./type";

export const uuid = ref("");
export const players = ref<Player[]>([]);
export const selfId = ref(-1);
export const ownerId = ref(-2);
export const winnerId = ref(-3);
export const winnerPageHistory= ref<string[]>([]);
export const winnerTime = ref(-1); 

export function playerReset() {
    players.value = [];
    selfId.value = -1;
    ownerId.value = -2;
    winnerId.value = -3;
    winnerPageHistory.value = [];
    winnerTime.value = -1;
}
