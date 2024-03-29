import { newShortcut } from "src/script/keyboardShortcut";
import { showGameMenu, showRoundWin, showPageHistory, showLeaderboard, showWikiEndPage, gameMenuTab } from "./state";
import { watch } from "vue";
import { messages, seenMessages } from "store/chat/state";

export function gameLayoutManagerSetup() {
    return {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage,
      gameMenuTab
    }
}

watch(gameMenuTab, t => {
  if (t == "chat" && showGameMenu.value) seenMessages.value == messages.value.length;
});
watch(showGameMenu, s => {
  if (gameMenuTab.value == "chat" && s) seenMessages.value == messages.value.length;
});

newShortcut(()=>showGameMenu.value = !showGameMenu.value,"Shift",true,true,true);
newShortcut(()=>showWikiEndPage.value = !showWikiEndPage.value," ",true,true);
