import { deleteVote, loadInputSuggestions } from "./actions";
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
    loadInputSuggestions
  }
}
