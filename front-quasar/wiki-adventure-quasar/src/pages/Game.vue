<template>
  <div>
    <game-slide-menu></game-slide-menu>
  </div>
</template>
<style>
</style>

<script lang="ts">
import GameSlideMenu from "layouts/GameSlideMenu.vue";

import { defineComponent } from '@vue/composition-api';
import { GameState, LobbyEvent, LobbyEventType, LobbyType, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, WinRound, WsMessage } from "../store/gameData/state";
import { IncomingMessage } from "http";

export default defineComponent({
  name: 'Index',
  components: { GameSlideMenu },
  mounted() {
    this.$store.dispatch('gameData/connect');
  }/*,
  beforeDestroy() {
    //store reset
  }*/
});
</script>
