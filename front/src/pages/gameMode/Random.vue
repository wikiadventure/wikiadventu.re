<template>
  <div class="game-mode-random absolute-full">
    <wait v-if="gamePhase == 0" />
    <wiki-page ref="wikiPage" v-else />
    <wiki-page ref="wikiEndPage" class="right-panel" :class="{ 'hideEndPage': !showWikiEndPage }" endPage/>
    <transition name="fade"><page-history v-show="showPageHistory" /></transition>
    <transition name="fade"><leaderboard v-show="showLeaderboard" /></transition>
    <transition name="fade"><round-win v-show="showRoundWin" /></transition>
    <classic-slide-menu ref="game"/>
  </div>
</template>
<style lang="scss">
.game-mode-random {
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.right-panel {
  transition: transform 0.15s ease-in-out;
  filter: drop-shadow(3px 3px 15px black);
}
.hideEndPage {
  transform: translate3d(100%,0,0);
}
</style>
<script lang="ts">
import ClassicSlideMenu from 'src/layouts/lobby/gameMode/Classic.vue';
import WikiPage from 'src/layouts/lobby/WikiPage.vue';
import RoundWin from 'src/layouts/lobby/screen/RoundWin.vue';
import Leaderboard from 'src/layouts/lobby/screen/Leaderboard.vue';
import Wait from 'src/layouts/lobby/screen/Wait.vue';
import PageHistory from 'src/layouts/lobby/screen/PageHistory.vue';

import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import { VanillaPhaseType } from 'store/lobby/game/phase/type';
import { lobbySetup } from 'store/lobby';
import { onRollback, WsRollback } from 'store/ws/packetHandler/vanilla/rollback';
import { onGamePhase, WsGamePhase } from 'store/ws/packetHandler/vanilla/gamePhase';
import { onWinRound, WsWinRound } from 'store/ws/packetHandler/vanilla/winRound';
import { onVoteResult, WsVoteResult } from 'store/ws/packetHandler/vanilla/voteResult';
import { countDownSound } from 'store/audio/vanilla/countDown';
import TouchSurfaceHandler from 'src/script/touchSurfaceHandler';
import { connect } from 'store/ws/action';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'RandomMode',
  components: { ClassicSlideMenu, WikiPage, RoundWin, Leaderboard, Wait, PageHistory },
  setup() {
    connect();
    const { t } = useI18n();
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

    var wikiPage = ref<InstanceType<typeof WikiPage>>();
    var wikiEndPage = ref<InstanceType<typeof WikiPage>>();
    var game = ref<InstanceType<typeof ClassicSlideMenu>>();

    function gamePhaseEvent(payload:WsGamePhase) {
      switch (payload.phase) {
        case VanillaPhaseType.GameFinish:
          showLeaderboard.value = true;
          setTimeout(() => {showLeaderboard.value = false}, payload.time*1000);
          return;
        case VanillaPhaseType.Playing:
          showPageHistory.value = false;
          Notify.create({
            type: 'annonce',
            position: 'bottom-right',
            message: t('phase.notify.'+payload.phase) as string
          });
          return;
      }
    }

    var unsubGamePhase = onGamePhase.subscribe(gamePhaseEvent);

    function winRoundEvent(payload:WsWinRound) {
      showRoundWin.value = true;
      setTimeout(() => showRoundWin.value = false, 5000);
      return;
    }

    var unsubWinRound = onWinRound.subscribe(winRoundEvent);

    function voteResultEvent(payload:WsVoteResult) {
      wikiPage.value?.requestWikiPage(payload.start);
      wikiEndPage.value?.requestWikiPage(payload.end);
      Notify.create({
        type: 'annonce',
        position: 'top',
        message: t('gameTab.end') as string + " : " + payload.end
      });
    }

    var unsubVoteResult = onVoteResult.subscribe(voteResultEvent);

    function rollbackEvent(payload:WsRollback) {
      wikiPage.value?.requestWikiPage(payload.page);
      /*Notify.create({
        type: 'error',
        position: 'top',
        message: t('gameTab.endPage') as string + " : " + payload.end
      });*/
    }

    var unsubRollback = onRollback.subscribe(rollbackEvent);

    var touchSurfaceHandler:TouchSurfaceHandler;

    onMounted(() => {
        touchSurfaceHandler = new TouchSurfaceHandler(document.documentElement, showGameMenu, showWikiEndPage, game.value?.menu?.$el as any, wikiEndPage.value?.$el);
    });
    onUnmounted(() => {
        touchSurfaceHandler.destroy();   
        unsubGamePhase();
        unsubWinRound();
        unsubVoteResult();
        unsubRollback();  
    });

    return {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage,
      gamePhase,
      wikiPage,
      wikiEndPage,
    };
  }
});
</script>