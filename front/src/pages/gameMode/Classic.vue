<template>
  <div class="game-mode-classic absolute-full">
    <game-audio ref="gameAudio" />
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
.game-mode-classic {
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
import GameAudio from 'src/components/audio/GameAudio.vue';
import TouchSurfaceHandler from 'src/mixins/touchSurfaceHandler';

import { Player } from 'src/store/gameData/state';
import { GameState, WinRound, VoteResult, WsMessage, Rollback } from 'src/store/gameData/actions';
import manageScreenSetup from "src/mixins/game/manageScreen";
import subscribeActionSetup from "src/mixins/game/subscribeAction";

import { computed, ComputedRef, defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { PhaseType } from 'src/store/gameData/type/phase';
import { Store } from 'src/store';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';

export default defineComponent({
  name: 'ClassicMode',
  components: { ClassicSlideMenu, WikiPage, RoundWin, Leaderboard, Wait, PageHistory, GameAudio },
  setup() {
    var {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage
    } = manageScreenSetup();
    var winner:ComputedRef<Player> = computed(() => Store.getters.gameData.winner);
    var gamePhase:ComputedRef<number> = computed(() => Store.state.gameData.gamePhase);
    var gameAudio = ref(null);
    var wikiPage = ref(null);
    var wikiEndPage = ref(null);
    var game = ref(null);
    
    function onGameState(payload:GameState) {
      switch (payload.phase) {
        case PhaseType.GameFinish:
          showLeaderboard.value = true;
          setTimeout(() => {showLeaderboard.value = false}, payload.time*1000);
          return;
        case PhaseType.Voting:
          Store.commit('gameData/deleteVote');
          showPageHistory.value = false;
          ///vm.$refs.game.$refs.menu.tab = "game";
          showGameMenu.value = true;
          var currentRound = Store.state.gameData.round;
          if (payload.time > 3) setTimeout(() => {if(Store.state.gameData.gamePhase == PhaseType.Voting && currentRound == Store.state.gameData.round) gameAudio.value.countDownAudio.play()}, payload.time*1000-3000);
          return;
        case PhaseType.Playing:
          Notify.create({
            type: 'annonce',
            position: 'bottom-right',
            message: i18n.t('phase.notify.'+payload.phase) as string
          });
          return;
      }
    }

    function onWinRound(payload:WinRound) {
      if (payload.id == Store.state.gameData.self) gameAudio.value.winAudio.play();
      else gameAudio.value.loseAudio.play();
      showRoundWin.value = true;
      setTimeout(() => showRoundWin.value = false, 5000);
      return;

    }

    function onVoteResult(payload:VoteResult) {
      wikiPage.value.requestWikiPage(payload.start);
      wikiEndPage.value.requestWikiPage(payload.end);
      Notify.create({
        type: 'annonce',
        position: 'top',
        message: i18n.t('gameTab.end') as string + " : " + payload.end
      });
    }

    function onMessage(payload:WsMessage) {
      if (!(game.value.$refs.menu.showMenu && game.value.$refs.menu.tab == "chat")) {
        gameAudio.value.notifAudio.play();
      } 
    }

    function onRollback(payload:Rollback) {
      wikiPage.value.requestWikiPage(payload.page);
      /*vm.$q.notify({
        type: 'error',
        position: 'top',
        message: vm.$t('gameTab.endPage') as string + " : " + payload.end
      });*/
    }

    var { unsubscribeAction } = subscribeActionSetup(onGameState, onWinRound, null, onVoteResult, onMessage, onRollback);

    var touchSurfaceHandler:TouchSurfaceHandler = null;
    function keyDown(e:KeyboardEvent) {
      if (e.defaultPrevented) return;
      if (e.ctrlKey && e.altKey && e.key == " ") {
        showWikiEndPage.value = !showWikiEndPage.value;
      }
    }
    onMounted(
      () => {
        console.log(wikiEndPage.value);
        Store.dispatch('gameData/connect');
        document.body?.addEventListener("keydown", keyDown, false);
        touchSurfaceHandler = new TouchSurfaceHandler(document.documentElement, showGameMenu, showWikiEndPage, game.value.$refs.menu.$el, wikiEndPage.value.$el);
      }
    );
    onUnmounted(
      () => {
        document.body?.removeEventListener("keydown", keyDown, false);
        touchSurfaceHandler.destroy();
        Store.dispatch('gameData/reset');
      }
    )

    return {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage,
      unsubscribeAction,
      winner,
      touchSurfaceHandler,
      gamePhase,
      gameAudio,
      wikiPage,
      wikiEndPage,
      game
    };
  },
  beforeRouteLeave (to, from, next) {
    const answer = window.confirm(this.$t('exitWarn') as string);
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
});
</script>