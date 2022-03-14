<template>
  <div class="classic-game-tab">
    
    <game-phase/>

    <q-separator spaced="md"/>

    <time-left/>

    <q-separator spaced="md"/>

    <start-page-preview/>

    <q-separator spaced="md"/>

    <end-page-preview/>

    <q-separator spaced="md"/>

    <vote-skip/>

    <q-separator spaced="md"/>

    <show-page-history/>
    
    <q-separator spaced="md"/>

  </div>
</template>
<style lang="scss">
.random-game-tab {
  min-height: 100%;
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
}
</style>
<script lang="ts" setup>
import EndPagePreview from 'src/components/game/preview/EndPagePreview.vue';
import StartPagePreview from "src/components/game/preview/StartPagePreview.vue";
import ShowPageHistory from 'src/components/game/ShowPageHistory.vue';
import GamePhase from 'src/components/game/GamePhase.vue';
import VoteSkip from 'src/components/game/VoteSkip.vue';
import TimeLeft from 'src/components/game/TimeLeft.vue';
</script>
