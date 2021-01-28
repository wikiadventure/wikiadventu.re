<template>
  <div>
    <game-slide-menu ref="gameMenu"/>
    <wait v-if="lobbyState == 'Waiting'" />
    <wiki-page ref="wikiPage" v-else />
    <wiki-page v-show="showEndPage" endPage/>
    <page-history v-show="showPageHistory" />
    <round-win v-show="showRoundWin" />
    <leaderboard v-show="showLeaderboard" />
    <audio id="winSound">
      <source src="sounds/win.ogg" type="audio/ogg">
      <source src="sounds/win.mp3" type="audio/mpeg">
    </audio>
    <audio id="loseSound">
      <source src="sounds/lose.ogg" type="audio/ogg">
      <source src="sounds/lose.mp3" type="audio/mpeg">
    </audio>
    <audio id="countDownSound">
      <source src="sounds/countDown.ogg" type="audio/ogg">
      <source src="sounds/countDown.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import GameSlideMenu from "../layouts/lobby/GameSlideMenu.vue";
import WikiPage from "../layouts/lobby/WikiPage.vue";
import RoundWin from "../layouts/lobby/screen/RoundWin.vue";
import Leaderboard from "../layouts/lobby/screen/Leaderboard.vue";
import Wait from "../layouts/lobby/screen/Wait.vue";
import PageHistory from "../layouts/lobby/screen/PageHistory.vue";

import { GameState, LobbyState, Player, VoteResult, WinRound } from "../store/gameData/state";

import  { ManageScreenEvent } from "../mixins/manageScreen";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Game',
  components: { GameSlideMenu, WikiPage, RoundWin, Leaderboard, Wait, PageHistory },
  data(): {
    showRoundWin:boolean,
    showLeaderboard:boolean,
    showPageHistory:boolean,
    showEndPage:boolean,
    winAudio:HTMLAudioElement | null,
    loseAudio:HTMLAudioElement | null,
    countDownAudio:HTMLAudioElement | null,
    unsubscribeAction:() => void,
    unsubscribeMutation:() => void
  } {
    return {
      showRoundWin: false,
      showLeaderboard: false,
      showPageHistory: false,
      showEndPage: false,
      winAudio: null,
      loseAudio: null,
      countDownAudio: null,
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
    lobbyState():LobbyState {
      return this.$store.state.gameData.lobbyState;
    },
    gameMenu: {
      get: function ():Boolean {
        var vm = this as any;
        return vm.$refs.gameMenu.showMenu;
      },
      set: function (v:boolean) {
        var vm = this as any;
        vm.$refs.gameMenu.showMenu = v;
      }
    },
    roundWin: {
      get: function ():Boolean {
        return this.showRoundWin;
      },
      set: function (v:boolean) {
        var vm = this;
        if (v) this.showRoundWin = v;
        else setTimeout(() => {this.showRoundWin  = v}, 200);
        Vue.nextTick().then(function () {
          document.getElementById("round-win").style.opacity = Number(v).toString(); 
        });
      }
    },
    leaderboard: {
      get: function ():Boolean {
        return this.showLeaderboard;
      },
      set: function (v:boolean) {
        var vm = this;
        if (v) this.showLeaderboard = v;
        else setTimeout(() => {this.showLeaderboard  = v}, 200);
        Vue.nextTick().then(function () {
          document.getElementById("leaderboard").style.opacity = Number(v).toString(); 
        });;
      }
    },
    pageHistory: {
      get: function ():Boolean {
        return this.showPageHistory;
      },
      set: function (v:boolean) {
        var vm = this;
        if (v) this.showPageHistory = v;
        else setTimeout(() => {this.showPageHistory  = v}, 200);
        Vue.nextTick().then(function () {
          document.getElementById("page-history").style.opacity = Number(v).toString(); 
        });;
      }
    },
    endPage: {
      get: function ():Boolean {
        return this.showEndPage;
      },
      set: function (v:boolean) {
        var vm = this;
        if (v) this.showEndPage = v;
        else setTimeout(() => {this.showEndPage  = v}, 200);
        Vue.nextTick().then(function () {
          document.getElementById("endPage").style.opacity = Number(v).toString(); 
        });;
      }
    },
  },
  mounted() {
    this.$store.dispatch('gameData/connect');
    this.$root.$on('manage-screen', this.manageScreen);//for exit button
    this.winAudio = document.getElementById("winSound") as HTMLAudioElement;
    this.loseAudio = document.getElementById("loseSound") as HTMLAudioElement;
    this.countDownAudio = document.getElementById("countDownSound") as HTMLAudioElement;
  },
  methods: {
    manageScreen(payload:ManageScreenEvent) {
      switch (payload.target) {
        case "game-menu":
          return this.gameMenu = payload.state;
        case "round-win":
          return this.roundWin = payload.state;
        case "page-history":
          return this.pageHistory = payload.state;
        case "leaderboard":
          return this.leaderboard = payload.state;
        case "wiki-end-page":
          return this.endPage = payload.state;
        default: return;
      }
    },
    onGameState(payload:GameState) {
      var vm = this;
      switch (payload.state) {
        case LobbyState.RoundFinish:
          if (!vm.winner) return;
          return;
        case LobbyState.GameFinish:
          vm.leaderboard = true;
          setTimeout(() => {vm.leaderboard = false}, payload.time*1000);
          return;
        case LobbyState.Voting:
          vm.pageHistory = false;
          vm.gameMenu = true;
          if (payload.time > 3) setTimeout(() => {vm.countDownAudio.play()}, payload.time*1000-3000);
          return;
        case LobbyState.Playing:
          vm.$q.notify({
            type: 'annonce',
            position: 'bottom-right',
            message: vm.$t('phase.notify.'+payload.state) as string
          });
          return;
      }
    },
    onWinRound(payload:WinRound) {
      var vm = this;
      if (payload.id == vm.$store.state.gameData.self) this.winAudio.play();
      else this.loseAudio.play();
      vm.roundWin = true;
      setTimeout(() => {vm.roundWin = false}, 5000);
      return;

    },
    onVoteResult(payload:VoteResult) {
      var vm = this;
      vm.$q.notify({
        type: 'annonce',
        position: 'top',
        message: vm.$t('gameTab.endPage') as string + " : " + payload.end
      });
    },
    onVolume(payload:number) {
      this.winAudio.volume = payload;
    },
    onMute(payload:boolean) {
      this.winAudio.muted = payload;
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
          return vm.pageHistory = true;
        case "gameData/onVoteResult":
          return vm.onVoteResult(action.payload);
      }
    });
    vm.unsubscribeMutation = vm.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case "gameData/volume":
          return this.onVolume(mutation.payload);
        case "gameData/mute":
          return this.onMute(mutation.payload);
      }
    });
  },
  beforeDestroy() {
    this.$store.dispatch('gameData/reset');
    this.unsubscribeAction!();
    this.unsubscribeMutation!();
  }
});
</script>