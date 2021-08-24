import { ref } from "vue";
import { WikiPreview, WikiSuggestion, WikiVote } from "./type";

export const vote = ref<WikiVote>({input:""});
export const voteInput = ref("");
export const voteInputFocus = ref(false);
export const suggestions = ref<WikiSuggestion[]>([]);
export const startPage = ref<WikiPreview>({});
export const endPage = ref<WikiPreview>({});

