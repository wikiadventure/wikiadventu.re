<template>
  <div>
    <game-slide-menu/>
    <wait v-if="lobbyState == 'Waiting'" />
    <wiki-page ref="wikiPage" v-else />
    <page-history v-if="lobbyState == 'RoundFinish'" :winner="winner ? winner.pseudo : ''"></page-history>
    <round-win id="roundWin" v-if="showRoundWin" :winner="winner ? winner.pseudo : ''"></round-win>
    <leaderboard v-if="showLeaderboard"></leaderboard>
    <audio id="winSound">
      <source src="sounds/win.ogg" type="audio/ogg">
      <source src="sounds/win.mp3" type="audio/mpeg">
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

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Index',
  components: { GameSlideMenu, WikiPage, RoundWin, Leaderboard, Wait, PageHistory },
  data(): {
    showRoundWin:boolean,
    showLeaderboard:Boolean,
    winAudio:HTMLAudioElement | null,
    unsubscribeAction:() => void,
    unsubscribeMutation:() => void
  } {
    return {
      showRoundWin: false,
      showLeaderboard: false,
      winAudio: null,
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
    roundWin: {
      get: function ():Boolean {
        return this.showRoundWin;
      },
      set: function (v:boolean) {
        var vm = this;
        if (v) this.showRoundWin = v;
        else setTimeout(() => {this.showRoundWin  = v}, 200);
        Vue.nextTick().then(function () {
          document.getElementById("roundWin").style.opacity = Number(v).toString(); 
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
    } 
  },
  mounted() {
    this.$store.dispatch('gameData/connect');
    this.$root.$on('close-screen', this.close);
    this.winAudio = document.getElementById("winSound") as HTMLAudioElement;
  },
  methods: {
    close(target:string) {
      console.log(target);
      switch (target) {
        case "round-win":
          return this.roundWin = false;
        case "leaderboard":
          return this.leaderboard = false;
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
      if (payload.id == vm.$store.state.gameData.self) {
        this.winAudio.play();
        vm.roundWin = true;
        setTimeout(() => {vm.roundWin = false}, 5000);
        return;
      }
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
          return this.onGameState(action.payload);
        case "gameData/onWinRound":
          return this.onWinRound(action.payload);
        case "gameData/onVoteResult":
          return this.onVoteResult(action.payload);
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