<template>
  <div>
    <game-slide-menu/>
    <wiki-page ref="wikiPage"/>
    <round-win id="roundWin" v-if="showWinRound" :winner="winner ? winner.pseudo : ''"></round-win>
    <leaderboard v-if="showLeaderboard"></leaderboard>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import GameSlideMenu from "../layouts/lobby/GameSlideMenu.vue";
import WikiPage from "../layouts/lobby/WikiPage.vue";
import RoundWin from "../layouts/lobby/screen/RoundWin.vue"

import { defineComponent } from '@vue/composition-api';
import { LobbyState, Player } from "../store/gameData/state";
import Leaderboard from "../layouts/lobby/screen/Leaderboard.vue";

export default defineComponent({
  name: 'Index',
  components: { GameSlideMenu, WikiPage, RoundWin, Leaderboard },
  data(): {
    showWinRound:boolean,
    showLeaderboard:boolean,
    unsubscribe:() => void
  } {
    return {
      showWinRound: false,
      showLeaderboard: false,
      unsubscribe: () => {}
    }
  },
  computed: {
    winner():Player {
      var players = this.$store.state.gameData.players as Player[];
      var winner = players.find(p => p.id == this.$store.state.gameData.winnerId );
      return winner;
    }
  },
  mounted() {
    this.$store.dispatch('gameData/connect');
  },
  created() {
    var vm = this;
    vm.unsubscribe = vm.$store.subscribeAction((action, state) => {
      if (action.type === 'gameData/onGameState') {
        if ( action.payload!.state == LobbyState.RoundFinish ) {
          if (!vm.winner) return;
          vm.showWinRound = true;
          Vue.nextTick().then(function () {
            document.getElementById("roundWin").style.opacity = "1";
            setTimeout(() => {document.getElementById("roundWin").style.opacity = "0";}, action.payload!.time*1000-200);
            setTimeout(() => {vm.showWinRound = false}, action.payload!.time*1000);
          });
        }
        else if ( action.payload!.state == LobbyState.GameFinish ) {
          vm.showLeaderboard = true;
          Vue.nextTick().then(function () {
            document.getElementById("leaderboard").style.opacity = "1";
            setTimeout(() => {document.getElementById("leaderboard").style.opacity = "0";}, action.payload!.time*1000-200);
            setTimeout(() => {vm.showLeaderboard = false}, action.payload!.time*1000);            
          });
        }
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe!();
  }
});
</script>