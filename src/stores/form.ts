import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";


export const username  = useLocalStorage("username", "");
export const player_id = useLocalStorage("player_id", crypto.randomUUID());
export const room_name = useLocalStorage("room_name", "");
export const password = ref("");

export const inGame = ref(false);