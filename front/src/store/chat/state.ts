import { ref } from "vue";
import { Message } from "./type";

export const messages= ref<Message[]>([]);
export const messageInput= ref("");
export const seenMessages = ref(0);

export function chatReset() {
    messages.value = [];
    messageInput.value = "";
    seenMessages.value = 0;
}