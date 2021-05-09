<template>
  <div class="game-mode-classic absolute-full">
    <game-audio ref="gameAudio" />
    <wait v-if="gamePhase == 0" />
    <wiki-page ref="wikiPage" v-else />
    <transition name="fade"><page-history v-show="showPageHistory" /></transition>
    <transition name="fade"><leaderboard v-show="showLeaderboard" /></transition>
    <transition name="fade"><round-win v-show="showRoundWin" /></transition>
    <wiki-page ref="rightPanel" class="right-panel" :class="{ 'hideEndPage': !showRightPanel }" endPage/>
    <classic-slide-menu ref="game"/>
  </div>
</template>
<style lang="scss">
.game-mode-classic {
  overflow-x: hidden;
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

import  { ManageScreenEvent } from 'src/mixins/manageScreen';

import { defineComponent } from '@vue/composition-api';
import { PhaseType } from 'src/store/gameData/type/phase';

export default defineComponent({
  name: 'ClassicMode',
  components: { ClassicSlideMenu, WikiPage, RoundWin, Leaderboard, Wait, PageHistory, GameAudio },
  data(): {
    showRoundWin:boolean,
    showLeaderboard:boolean,
    showPageHistory:boolean,
    showRightPanel:boolean,
    touchSurfaceHandler:TouchSurfaceHandler,
    onDestroy:() => void,
    unsubscribeAction:() => void,
    unsubscribeMutation:() => void
  } {
    return {
      showRoundWin: false,
      showLeaderboard: false,
      showPageHistory: false,
      showRightPanel: false,
      touchSurfaceHandler: null,
      onDestroy: () => {},
      unsubscribeAction: () => {},
      unsubscribeMutation:() => {}
    }
  },
  beforeRouteLeave (to, from, next) {
    const answer = window.confirm(this.$t('exitWarn') as string);
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
  computed: {
    winner():Player {
      return this.$store.getters.gameData.winner;
    },
    gamePhase():number {
      return this.$store.state.gameData.gamePhase;
    },
    gameMenu: {
      get: function ():Boolean {
        var vm = this as any;
        return vm.$refs.game.$refs.menu.showMenu;
      },
      set: function (v:boolean) {
        var vm = this as any;
        vm.$refs.game.$refs.menu.showMenu = v;
      }
    }
  },
  mounted() {
    var vm = this as any;
    this.$store.dispatch('gameData/connect');
    this.$root.$on('manage-screen', this.manageScreen);//for exit button
    function keyDown(e:KeyboardEvent) {
      if (e.defaultPrevented) return;
      if (e.ctrlKey && e.altKey && e.key == " ") {
        vm.showRightPanel = !vm.showRightPanel;
      }
    }
    document.body!.addEventListener("keydown", keyDown, false);
    vm.touchSurfaceHandler = new TouchSurfaceHandler( document.documentElement, this );
    this.onDestroy = function () {
      document.body!.removeEventListener("keydown", keyDown, false);
    }
  },
  methods: {
    manageScreen(payload:ManageScreenEvent) {
      switch (payload.target) {
        case "game-menu":
          return this.gameMenu = payload.state != null ? payload.state : !this.gameMenu;
        case "round-win":
          return this.showRoundWin = payload.state != null ? payload.state : !this.showRoundWin;
        case "page-history":
          return this.showPageHistory = payload.state != null ? payload.state : !this.showPageHistory;
        case "leaderboard":
          return this.showLeaderboard = payload.state != null ? payload.state : !this.showLeaderboard;
        case "wiki-end-page":
          return this.showRightPanel = payload.state != null ? payload.state : !this.showRightPanel;
        default: return;
      }
    },
    onGameState(payload:GameState) {
      var vm = this as any;
      switch (payload.phase) {
        case PhaseType.RoundFinish:
          if (!vm.winner) return;
          return;
        case PhaseType.GameFinish:
          vm.showLeaderboard = true;
          setTimeout(() => {vm.showLeaderboard = false}, payload.time*1000);
          return;
        case PhaseType.Voting:
          vm.$store.commit('gameData/deleteVote');
          vm.showPageHistory = false;
          vm.$refs.game.$refs.menu.tab = "game";
          vm.gameMenu = true;
          if (payload.time > 3) setTimeout(() => {if(vm.$store.state.gameData.gamePhase == PhaseType.Voting) vm.$refs.gameAudio.countDownAudio.play()}, payload.time*1000-3000);
          return;
        case PhaseType.Playing:
          vm.$q.notify({
            type: 'annonce',
            position: 'bottom-right',
            message: vm.$t('phase.notify.'+payload.phase) as string
          });
          return;
      }
    },
    onWinRound(payload:WinRound) {
      var vm = this as any;
      if (payload.id == vm.$store.state.gameData.self) vm.$refs.gameAudio.winAudio.play();
      else vm.$refs.gameAudio.loseAudio.play();
      vm.showRoundWin = true;
      setTimeout(() => {vm.showRoundWin = false}, 5000);
      return;

    },
    onVoteResult(payload:VoteResult) {
      var vm = this as any;
      vm.$refs.wikiPage.requestWikiPage(payload.start);
      vm.$refs.rightPanel.requestWikiPage(payload.end);
      vm.$q.notify({
        type: 'annonce',
        position: 'top',
        message: vm.$t('gameTab.endPage') as string + " : " + payload.end
      });
    },
    onMessage(payload:WsMessage) {
      var vm = this as any;
      if (!(vm.$refs.game.$refs.menu.showMenu && vm.$refs.game.$refs.menu.tab == "chat")) {
        vm.$refs.gameAudio.notifAudio.play();
      } 
    },
    onRollback(payload:Rollback) {
      var vm = this as any;
      vm.$refs.wikiPage.requestWikiPage(payload.page);
    }
  },
  created() {
    var vm = this;
    vm.unsubscribeAction = vm.$store.subscribeAction((action, state) => {
      switch (action.type) {
        case "gameData/onGameState":
          return vm.onGameState(action.payload);
        case "gameData/onWinRound":
          return vm.onWinRound(action.payload);
        case "gameData/onPath":
          return vm.showPageHistory = true;
        case "gameData/onVoteResult":
          return vm.onVoteResult(action.payload);
        case "gameData/onMessage":
          return vm.onMessage(action.payload);
        case "gameData/onRollback":
          return vm.onRollback(action.payload);
      }
    });
    vm.unsubscribeMutation = vm.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
      }
    });
  },
  beforeDestroy() {
    this.onDestroy();
    this.$store.dispatch('gameData/reset');
    this.unsubscribeAction!();
    this.unsubscribeMutation!();
  }
});
</script>