import { WikiSuggestion, WikiPreview } from './type';
import { debounce } from "quasar";
import { lang } from "store/lobby/state";
import { loadSuggestions } from "store/wiki/action";
import { sendResetVote } from "store/ws/packetSender/vanilla/resetVote";
import { sendVote } from "store/ws/packetSender/vanilla/vote";
import { suggestions, vote, voteInput } from "./state";
import { i18n } from "src/boot/i18n";

export function deleteVote() {
  vote.value = {input:""};
  sendResetVote();
};

export function resetPreview(p:WikiPreview) {
  p.title = undefined;
  p.description = undefined;
  p.thumbnail = undefined;
}

export async function noDebounceLoadInputSuggestions(vote:string, l=lang.value) {
  console.log("vote : "+voteInput.value);
  suggestions.value = await loadSuggestions(vote, l);
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

export async function submitSuggestion(s:WikiSuggestion) {
  if (s.title == null) return;
  
  vote.value = Object.assign({ input: s.title }, s);
  sendVote(s.title);
}