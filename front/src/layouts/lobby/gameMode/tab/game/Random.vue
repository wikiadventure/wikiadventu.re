<template>
  <div class="random-game-tab ">
    <div class="row justify-evenly text-center">
      <h4 class="q-ma-sm">{{ t('gameTab.round') }} {{ round }}</h4>
      <h4 class="q-ma-sm">{{ t('phase.'+gamePhase) }}</h4>
    </div>

    <q-separator spaced="md"/>

    <div class="row justify-evenly">
      <h6 class="q-ma-xs">{{ t('gameTab.timeLeft') }}</h6>
      <div class="row justify-evenly items-center"><h6 class="q-ma-xs">{{ timeLeft }}</h6><q-icon size="sm" name="mdi-alarm"/></div>
    </div>

    <q-separator spaced="md"/>

    <preview :wikiPreview="startPage" :beforeTitle="t('gameTab.start') + ' : '" />

    <q-separator spaced="sm"/>

    <preview :wikiPreview="endPage" :beforeTitle="t('gameTab.end') + ' : '" >
      <q-btn round dense flat icon="mdi-open-in-new" @click="showWikiEndPage = !showWikiEndPage, showGameMenu = !showGameMenu"/>
    </preview>

    <q-separator spaced="sm"/>

    <div class="row items-center justify-evenly q-ma-sm">
      <p class="q-my-none" :class="{ 'self': selfPlayer?.voteSkip }">{{ playersVoteSkip.length }} / {{ playersConnected.length }}</p>
      <q-btn class="action-btn q-ma-xs" push label="skip" icon="mdi-skip-forward" @click="sendVoteSkip()"/>
    </div>

    <q-separator spaced="sm"/>

    <div class="row items-center justify-evenly q-ma-sm">
      <q-btn class="action-btn q-ma-sm" push :label="t('gameTab.pageHistory')" icon="mdi-format-list-bulleted" @click="showPageHistory = !showPageHistory, showGameMenu = !showGameMenu"/>
    </div>
    
    <q-separator spaced="sm"/>

  </div>
</template>
<style lang="scss">
.random-game-tab  {
  font-size: 1.2em;
  min-height: 100%;
  .self {
    color: var(--w-color-dark-teal);
  }
}
</style>
<script lang="ts">
import Preview from "components/game/WikiPreview.vue";

import { defineComponent } from 'vue';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import { voteSetup } from 'store/vote';
import { sendVoteSkip } from 'store/ws/packetSender/vanilla/voteSkip';
import { lobbySetup } from 'store/lobby';
import { playerSetup } from 'store/player';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'RandomGameTab',
  components: { Preview },
  setup(){
    const { t } = useI18n({ useScope: 'global' });
    var {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage
    } = gameLayoutManagerSetup();

    var {
      startPage,
      endPage,
    } = voteSetup();

    var {
      round,
      gamePhase,
      timeLeft
    } = lobbySetup();

    var {
      selfPlayer,
      playersConnected,
      playersVoteSkip
    } = playerSetup();

    return {
      showGameMenu,
      showRoundWin,
      showPageHistory,
      showLeaderboard,
      showWikiEndPage,
      startPage,
      endPage,
      sendVoteSkip,
      round,
      gamePhase,
      timeLeft,
      selfPlayer,
      playersConnected,
      playersVoteSkip,
      t
    }
  }
});
</script>
