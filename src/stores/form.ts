import { useLocalStorage } from "@vueuse/core";
import { ref, watch } from "vue";
import { getEnglishRandomUsername } from "./randomUsername/randomUsername";


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
    window.history.pushState({}, "", "/#"+params.toString());
});


export function connect(e?:Event) {
    e?.preventDefault();
    if (username.value.trim() == "") username.value = getEnglishRandomUsername();
    if (room_name.value.trim() == "") room_name.value = username.value + "-room";
    inGame.value = true;
}
