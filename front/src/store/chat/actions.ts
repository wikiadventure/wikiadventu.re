import { sendMessage } from "../ws/packetSender/vanilla/message";
import { messageInput } from "./state";

export function submitMessage() {
    sendMessage(messageInput.value);
    messageInput.value = "";
}
