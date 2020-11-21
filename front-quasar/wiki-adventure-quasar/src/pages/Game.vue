<template>
  <div>
    <game-slide-menu/>
    <wiki-page ref="wikiPage"/>
    <round-win v-if="showWinRound" :winner="winner"></round-win>
  </div>
</template>
<script lang="ts">
import GameSlideMenu from "../layouts/lobby/GameSlideMenu.vue";
import WikiPage from "../layouts/lobby/WikiPage.vue";
import RoundWin from "../layouts/lobby/screen/RoundWin.vue"

import { defineComponent } from '@vue/composition-api';
import { Player } from "../store/gameData/state";

export default defineComponent({
  name: 'Index',
  components: { GameSlideMenu, WikiPage, RoundWin },
  data(): {
    showWinRound:boolean,
    winner:string,
    unsubscribe:() => void
  } {
    return {
      showWinRound: false,
      winner: "",
      unsubscribe: () => {}
    }
  },
  mounted() {
    this.$store.dispatch('gameData/connect');
  },
  created() {
    this.unsubscribe = this.$store.subscribeAction((action, state) => {
      if (action.type === 'gameData/onWinRound') {
        var playerList = this.$store.state.gameData.players as Player[];
        var player = playerList.find(p => p.id > action.payload!.id);
        this.winner = player!.pseudo;
        this.showWinRound = true;
        setTimeout(() => {this.showWinRound = false}, 4000);
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe!();
  }
});
</script>