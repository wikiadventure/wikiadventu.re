import { ref } from "vue";

export const showGameMenu = ref(false);
export const showRoundWin = ref(false);
export const showPageHistory = ref(false);
export const showLeaderboard = ref(false);
export const showWikiEndPage = ref(false);
export const gameMenuTab = ref("game");

export function gameLayoutManagerReset() {
    showGameMenu.value = false;
    showRoundWin.value = false;
    showPageHistory.value = false;
    showLeaderboard.value = false;
    showWikiEndPage.value = false;
    gameMenuTab.value = "game";
}
