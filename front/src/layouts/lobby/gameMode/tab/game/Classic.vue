<template>
  <div class="classic-game-tab">
    <div class="row justify-evenly text-center">
      <h4 class="q-ma-sm">{{ $t('gameTab.round') }} {{ $store.state.gameData.round }}</h4>
      <h4 class="q-ma-sm">{{ $t('phase.'+$store.state.gameData.gamePhase) }}</h4>
    </div>

    <q-separator spaced="md"/>

    <div class="row justify-evenly">
      <h6 class="q-ma-xs">{{ $t('gameTab.timeLeft') }}</h6>
      <div class="row justify-evenly items-center"><h6 class="q-ma-xs">{{ timeLeft }}</h6><q-icon size="sm" name="mdi-alarm"/></div>
    </div>

    <q-separator spaced="md"/>

    <vote-input/>

    <q-separator spaced="sm"/>

    <preview :wikiPreview="startPage" />

    <q-separator spaced="sm"/>

    <preview :wikiPreview="endPage">
      <q-btn round dense flat icon="mdi-open-in-new" @click="showWikiEndPage = !showWikiEndPage, showGameMenu = !showGameMenu"/>
    </preview>

    <q-separator spaced="sm"/>

    <div class="row items-center justify-evenly q-ma-sm">
      <p class="q-my-none" :class="{ 'self': hasVoteSkip }">{{ totalVoteSkip }} / {{ connectedPlayers }}</p>
      <q-btn class="action-btn q-ma-xs" push label="skip" icon="mdi-skip-forward" @click="$store.dispatch('gameData/voteSkip')"/>
    </div>

    <q-separator spaced="sm"/>

    <div class="row items-center justify-evenly q-ma-sm">
      <q-btn class="action-btn q-ma-sm" push :label="$t('gameTab.pageHistory')" icon="mdi-format-list-bulleted" @click="showPageHistory = !showPageHistory, showGameMenu = !showGameMenu"/>
    </div>
    
    <q-separator spaced="sm"/>

  </div>
</template>
<style lang="scss">
.classic-game-tab {
  font-size: 1.2em;
  .self {
    color: var(--w-color-dark-teal);
  }
}
</style>
<script lang="ts">
import VoteInput from 'src/components/game/VoteInput.vue';
import { Player } from 'src/store/gameData/state';
import preview from "components/game/WikiPreview.vue";
import previewSetup from "src/mixins/wiki/preview";
import manageScreenSetup from "src/mixins/game/manageScreen";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ClassicGameTab',
  components: { VoteInput, preview },
  setup(){
    var {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage
    } = manageScreenSetup();
    const { pagePreview, startPage, endPage } = previewSetup();
    return {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage,
      pagePreview,
      startPage,
      endPage
    }
  },
  computed: {
    timeLeft():string {
      return Math.floor(this.$store.state.gameData.timeLeft/1000).toString();
    },
    connectedPlayers():number {
      return (this.$store.state.gameData.players as Player[]).filter(p => p.isConnected).length;
    },
    totalVoteSkip():number {
      return (this.$store.state.gameData.players as Player[]).filter(p => p.isConnected && p.voteSkip).length;
    },
    hasVoteSkip():boolean {
      return this.$store.getters['gameData/selfPlayer'] != null ? this.$store.getters['gameData/selfPlayer'].voteSkip : false;
    }
  }
});
</script>
