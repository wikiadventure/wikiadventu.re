
import { ref } from "@vue/composition-api";

var showGameMenu = ref(false);
var showRoundWin = ref(false);
var showPageHistory = ref(false);
var showLeaderboard = ref(false);
var showWikiEndPage = ref(false);

export default function setup() {
  return {
    showGameMenu,
    showRoundWin,
    showPageHistory,
    showLeaderboard,
    showWikiEndPage
  }
}