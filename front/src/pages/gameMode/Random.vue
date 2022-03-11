<template>
  <div class="game-mode-random absolute-full">
    <wait v-if="gamePhase == 0" />
    <wiki-page ref="wikiPage" v-else />
    <wiki-page ref="wikiEndPage" class="right-panel" :class="{ 'hideEndPage': !showWikiEndPage }" endPage>
      <exit-btn class="q-ma-md" @click="showWikiEndPage = false"/>
    </wiki-page>
    <transition name="fade"><page-history v-show="showPageHistory" /></transition>
    <transition name="fade"><leaderboard v-show="showLeaderboard" /></transition>
    <transition name="fade"><round-win v-show="showRoundWin" /></transition>
    <random-slide-menu ref="game"/>
  </div>
</template>
<style lang="scss">
.game-mode-random {
  overflow: hidden;
}
.right-panel {
  transition: transform 0.15s ease-in-out;
  filter: drop-shadow(3px 3px 15px black);
}
.hideEndPage {
  transform: translate3d(100%,0,0);
}
</style>
<script lang="ts" setup>
import RandomSlideMenu from 'src/layouts/lobby/gameMode/Random.vue';
import WikiPage from 'src/layouts/lobby/WikiPage.vue';
import RoundWin from 'src/layouts/lobby/screen/RoundWin.vue';
import Leaderboard from 'src/layouts/lobby/screen/Leaderboard.vue';
import Wait from 'src/layouts/lobby/screen/Wait.vue';
import PageHistory from 'src/layouts/lobby/screen/PageHistory.vue';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import { VanillaPhaseType } from 'store/lobby/game/phase/type';
import { lobbySetup } from 'store/lobby';
import { onRollback, rollbackHandler, WsRollback } from 'store/ws/packetHandler/vanilla/rollback';
import { gamePhaseHandler, onGamePhase, WsGamePhase } from 'store/ws/packetHandler/vanilla/gamePhase';
import { onWinRound, winRoundHandler, WsWinRound } from 'store/ws/packetHandler/vanilla/winRound';
import { onVoteResult, voteResultHandler, WsVoteResult } from 'store/ws/packetHandler/vanilla/voteResult';
import TouchSurfaceHandler from 'src/script/touchSurfaceHandler';
import { connect } from 'store/ws/action';
import { useI18n } from 'vue-i18n';
import { PacketHandlers } from 'store/ws/packetHandler';
import { messageHandler } from 'store/ws/packetHandler/vanilla/message';
import { pathHandler } from 'store/ws/packetHandler/vanilla/path';
import { playerJoinHandler } from 'store/ws/packetHandler/vanilla/playerJoin';
import { playerLeftHandler } from 'store/ws/packetHandler/vanilla/playerLeft';
import { setOwnerHandler } from 'store/ws/packetHandler/vanilla/setOwner';
import { updateScoreHandler } from 'store/ws/packetHandler/vanilla/updateScore';
import { voteSkipHandler } from 'store/ws/packetHandler/vanilla/voteSkip';
import { sendValidate } from 'store/ws/packetSender/vanilla/validate';

PacketHandlers.splice(0, PacketHandlers.length);
PacketHandlers.push(
  messageHandler,
  gamePhaseHandler,
  pathHandler,
  playerJoinHandler,
  playerLeftHandler,
  rollbackHandler,
  setOwnerHandler,
  updateScoreHandler,
  voteResultHandler,
  voteSkipHandler,
  winRoundHandler);

connect();
const { t } = useI18n({ useScope: 'global' });
var $q = useQuasar();
var {
  showGameMenu,
  showRoundWin,
  showPageHistory,
  showLeaderboard,
  showWikiEndPage,
  gameMenuTab
} = gameLayoutManagerSetup();

var {
  gamePhase,
  round
} = lobbySetup();


var wikiPage = ref<InstanceType<typeof WikiPage> | null>(null);
var wikiEndPage = ref<InstanceType<typeof WikiPage> | null>(null);

var game = ref<InstanceType<typeof RandomSlideMenu>>();

function gamePhaseEvent(payload: WsGamePhase) {
  switch (payload.phase) {
    case VanillaPhaseType.GameFinish:
      showLeaderboard.value = true;
      setTimeout(() => { showLeaderboard.value = false }, payload.time * 1000);
      return;
    case VanillaPhaseType.Playing:
      Notify.create({
        type: 'annonce',
        position: 'bottom-right',
        message: t('phase.notify.' + payload.phase) as string
      });
      return;
  }
}

const unsubGamePhase = onGamePhase.subscribe(gamePhaseEvent);

function winRoundEvent(payload: WsWinRound) {
  showRoundWin.value = true;
  setTimeout(() => showRoundWin.value = false, 5000);
  return;
}

const unsubWinRound = onWinRound.subscribe(winRoundEvent);

function voteResultEvent(payload: WsVoteResult) {
  wikiPage.value?.requestWikiPage(payload.start);
  wikiEndPage.value?.requestWikiPage(payload.end);
  Notify.create({
    type: 'annonce',
    position: 'top',
    message: t('gameTab.end') as string + " : " + payload.end
  });
}

const unsubVoteResult = onVoteResult.subscribe(voteResultEvent);

function rollbackEvent(payload: WsRollback) {
  wikiPage.value?.requestWikiPage(payload.page);
  //TODO: notify user of rollback (we chould put it in store)
  /*Notify.create({
    type: 'error',
    position: 'top',
    message: t('gameTab.endPage') + " : " + payload.end
  });*/
}

const unsubRollback = onRollback.subscribe(rollbackEvent);

var touchSurfaceHandler: TouchSurfaceHandler;

onMounted(() => {
  touchSurfaceHandler = new TouchSurfaceHandler(document.documentElement, showGameMenu, showWikiEndPage, game.value?.menu?.$el as any, wikiEndPage.value?.$el);
  if (!wikiPage.value || !wikiEndPage.value) return;
  wikiPage.value.onWikiLink
  wikiPage.value.title = t("wikiPage.tipsTitle");
  wikiPage.value.content = t("wikiPage.tipsContent" + ($q.platform.is.mobile ? "Mobile" : ""));
  wikiEndPage.value.title = t("wikiPage.noEndPageYet");
});

onUnmounted(() => {
  touchSurfaceHandler.destroy();
        touchSurfaceHandler.destroy();   
  touchSurfaceHandler.destroy();
  unsubGamePhase();
  unsubWinRound();
  unsubVoteResult();
  unsubRollback();
        unsubRollback();  
  unsubRollback();
});
</script>