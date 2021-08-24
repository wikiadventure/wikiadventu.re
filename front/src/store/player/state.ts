import { ref } from "vue";
import { Player } from "./type";

export const uuid = ref("");
export const players = ref<Player<unknown>[]>([]);
export const selfId = ref(-1);
export const ownerId = ref(-2);
export const winnerId = ref(-3);
export const winnerPageHistory= ref<string[]>([]);
export const winnerTime = ref(-1); 
