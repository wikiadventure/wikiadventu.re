import { debounce } from "quasar";
import { lang } from "store/lobby/state";
import { loadSuggestions } from "store/wiki/action";
import { sendResetVote } from "store/ws/packetSender/vanilla/resetVote";
import { sendVote } from "store/ws/packetSender/vanilla/vote";
import { suggestions, vote, voteInput } from "./state";
import { i18n } from "src/boot/i18n";


export function deleteVote() {
  vote.value.label = undefined;
  vote.value.title = undefined;
  vote.value.description = undefined;
  vote.value.thumbnail = undefined;
  sendResetVote();
};

export async function noDebounceLoadInputSuggestions() {
  suggestions.value = await loadSuggestions(voteInput.value, lang.value);
};
export const loadInputSuggestions = debounce(noDebounceLoadInputSuggestions, 250);

export async function searchVote(v:string) {
  var suggestion = await loadSuggestions(v, lang.value, 1);
  if (suggestion.length == 0) {
    vote.value.title = undefined;
    vote.value.description = i18n.global.t('gameTab.vote.noPageFoundDescription')
    vote.value.label = v;
    vote.value.thumbnail = undefined;
  } else {
    vote.value.title = suggestion[0].title;
    vote.value.label = suggestion[0].title;
    vote.value.description = suggestion[0].description || i18n.global.t('gameTab.vote.noVoteDescription');
    vote.value.thumbnail = suggestion[0].thumbnail;
    
  }
  sendVote(v);
}