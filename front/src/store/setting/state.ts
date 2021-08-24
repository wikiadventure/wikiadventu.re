import { newShortcut } from "src/script/keyboardShortcut";
import { ref } from "vue";

export const volume = ref(0.3);
export const mute = ref(false);
export const safeMode = ref(false);
export const safeModeInterrupted = ref(false);

newShortcut(()=>safeModeInterrupted.value = !safeModeInterrupted.value, "q", true, true);
