import { deleteVote, loadInputSuggestions, searchVote, submitSuggestion } from "./actions";
import { vote, suggestions, startPage, endPage, voteInput, voteInputFocus } from "./state";

export function voteSetup() {
  return {
    vote,
    voteInput,
    voteInputFocus,
    suggestions,
    startPage,
    endPage,
    deleteVote,
    searchVote,
    submitSuggestion,
    loadInputSuggestions
  }
}
