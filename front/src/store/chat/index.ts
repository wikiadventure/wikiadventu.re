
import { submitMessage } from "./actions";
import { messageInput, messages } from "./state";

export function chatSetup() {
  return {
    messages,
    messageInput,
    submitMessage
  }
}

export function chatReset() {
  messages.value = [];
  messageInput.value = "";
}

