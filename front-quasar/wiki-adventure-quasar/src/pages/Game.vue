<template>
  <div>
    <game-slide-menu/>
    <wiki-page ref="wikiPage"/>
    <round-win id="roundWin" v-if="showRoundWin" :winner="winner ? winner.pseudo : ''"></round-win>
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
    showRoundWin:boolean,
    showLeaderboard:Boolean,
    unsubscribe:() => void
  } {
    return {
      showRoundWin: false,
      showLeaderboard: false,
      unsubscribe: () => {}
    }
  },
  computed: {
    winner():Player {
      var players = this.$store.state.gameData.players as Player[];
      var winner = players.find(p => p.id == this.$store.state.gameData.winnerId );
      return winner;
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
    }
  },
  created() {
    var vm = this;
    vm.unsubscribe = vm.$store.subscribeAction((action, state) => {
      if (action.type === 'gameData/onGameState') {
        if ( action.payload!.state == LobbyState.RoundFinish ) {
          if (!vm.winner) return;
          vm.roundWin = true;
          setTimeout(() => {vm.roundWin = false}, action.payload!.time*1000);
        }
        else if ( action.payload!.state == LobbyState.GameFinish ) {
          vm.leaderboard = true;
          setTimeout(() => {vm.leaderboard = false}, action.payload!.time*1000);
        }
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe!();
  }
});
</script>