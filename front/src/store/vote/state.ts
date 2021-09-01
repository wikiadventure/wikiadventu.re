import { ref, reactive } from "vue";
import { resetPreview, resetVote } from "./actions";
import { WikiPreview, WikiSuggestion, WikiVote } from "./type";

export const vote = reactive<WikiVote>({input:""});
export const voteInput = ref("");
export const voteInputFocus = ref(false);
export const suggestions = ref<WikiSuggestion[]>([]);
export const startPage = reactive<WikiPreview>({});
export const endPage = reactive<WikiPreview>({});

export function voteReset() {
    resetVote();
    voteInput.value = "";
    voteInputFocus.value = false;
    suggestions.value = [];
    resetPreview(startPage);
    resetPreview(endPage);
}
  