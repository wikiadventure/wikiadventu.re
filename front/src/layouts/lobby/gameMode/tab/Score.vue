<template>
  <q-tab-panel name="score" class="score-tab">
    <h3 class="row items-baseline justify-evenly q-my-xs">{{ t('score') }}</h3>
    <!--TODO: move leaderboard button to component-->
    <div class="row items-baseline justify-evenly"><q-btn class="action-btn" push :label="t('leaderboard')" icon="mdi-format-list-bulleted" @click="showLeaderboard = !showLeaderboard"/></div>
    <q-separator spaced="md"/>
    <q-list separator>
      <q-item v-for="player in playersByScore" :key="player.id">
        <q-item-section avatar>            
          <q-icon v-if="player.id == ownerId" class="owner" name="mdi-crown"></q-icon>
          <q-icon v-else-if="!player.isConnected" color="red" name="mdi-wifi-off"></q-icon>
        </q-item-section>
        <q-item-section :class="{ self: player.id == selfId }">{{ player.pseudo }}</q-item-section>
        <q-item-section>{{ player.score }}</q-item-section>
      </q-item>
    </q-list>
  </q-tab-panel>
</template>
<style lang="scss">
.score-tab {
  padding: 0;
  .self, .owner {
    color: var(--clr-contrast)!important;
  }
  .self {
    font-weight: bolder;
  }
}
</style>
<script lang="ts" setup>
import { showLeaderboard } from 'store/gameLayoutManager/state';
import { playerSetup } from 'store/player';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const {
  playersByScore,
  ownerId,
  selfId
} = playerSetup();
</script>
<i18n lang="yaml">
  en:
    score: "Score"
    leaderboard: "Leaderboard"
  fr:
    send: "Scores"
    leaderboard: "Classement"
</i18n>
