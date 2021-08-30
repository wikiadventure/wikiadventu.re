import { seenMessages } from 'store/chat/state';

import { submitMessage } from "./actions";
import { messageInput, messages } from "./state";

export function chatSetup() {
  return {
    messages,
    messageInput,
    seenMessages,
    submitMessage
  }
}
