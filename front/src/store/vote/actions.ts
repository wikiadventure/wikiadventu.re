import { WikiSuggestion, WikiVote, WikiPreview } from './type';
import { debounce } from "quasar";
import { lang } from "store/lobby/state";
import { loadSuggestions } from "store/wiki/action";
import { sendResetVote } from "store/ws/packetSender/vanilla/resetVote";
import { sendVote } from "store/ws/packetSender/vanilla/vote";
import { suggestions, vote, voteInput } from "./state";
import { i18n } from "src/boot/i18n";

export function resetPreview(p:WikiPreview) {
  p.title = undefined;
  p.description = undefined;
  p.thumbnail = undefined;
}

export function resetVote() {
  vote.input = "";
  vote.label = undefined;
  resetPreview(vote);
}

export function deleteVote() {
  resetVote();
  sendResetVote();
};

export async function noDebounceLoadInputSuggestions(vote:string, l=lang.value) {
  console.log("vote : "+voteInput.value);
  suggestions.value = await loadSuggestions(vote, l);
};
export const loadInputSuggestions = debounce(noDebounceLoadInputSuggestions, 250);

export async function searchVote(v:string) {
  var suggestion = await loadSuggestions(v, lang.value, 1);
  if (suggestion.length == 0) {
    vote.title = undefined;
    vote.description = i18n.global.t('gameTab.vote.noPageFoundDescription')
    vote.label = v;
    vote.thumbnail = undefined;
  } else {
    vote.title = suggestion[0].title;
    vote.label = suggestion[0].title;
    vote.description = suggestion[0].description || i18n.global.t('gameTab.vote.noVoteDescription');
    vote.thumbnail = suggestion[0].thumbnail;
    
  }
  sendVote(v);
}

export async function submitSuggestion(s:WikiSuggestion) {
  if (s.title == null) return;
  vote.input = s.title;
  Object.assign(vote, s);
  vote.title
}