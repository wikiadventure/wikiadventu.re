import { gameMenuTab, showGameMenu } from "store/gameLayoutManager/state";
import { computed } from "vue";
import { messages, seenMessages } from "./state";


export const unseenMessagesNumber = computed(() => {
    if (gameMenuTab.value == "chat" && showGameMenu.value ) seenMessages.value = messages.value.length;
    const n = messages.value.length - seenMessages.value;
    const b = n > 9 ? "9+" : n.toString();
    return b;
});
