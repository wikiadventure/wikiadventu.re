import { useLocalStorage } from "@vueuse/core";
import { ref, watch } from "vue";


export const username  = useLocalStorage("username", "");
export const player_id = useLocalStorage("player_id", crypto.randomUUID());
export const room_name = useLocalStorage("room_name", "");
export const password  = ref("");

export const inGame = ref(false);

watch(inGame, (newValue,_oldValue) => {
    if (!newValue) return;
    const params = new URLSearchParams({
        room: room_name.value
    });
    console.log();
    window.history.pushState({}, "", "/#"+params.toString());
})
