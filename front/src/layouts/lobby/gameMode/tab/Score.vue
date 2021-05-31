<template>
  <div id="scoreTab">
    <h3 class="row items-baseline justify-evenly q-my-xs">{{ $t('scoreTab.title') }}</h3>
    <div class="row items-baseline justify-evenly"><q-btn class="action-btn" push :label="$t('scoreTab.leaderboard')" icon="mdi-format-list-bulleted" @click="showLeaderboard = !showLeaderboard"/></div>
    <q-separator spaced="md"/>
    <q-list separator>
      <q-item v-for="player in playersByScore" :key="player.id">
        <q-item-section avatar>            
          <q-icon v-if="isOwner(player.id)" color="teal" name="mdi-crown"></q-icon>
          <q-icon v-else-if="!player.isConnected" color="red" name="mdi-wifi-off"></q-icon>
        </q-item-section>
        <q-item-section :class="{ self: isSelf(player.id) }">{{ player.pseudo }}</q-item-section>
        <q-item-section>{{ player.score }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<style lang="scss">
.self {
  color: var(--wa-color-dark-teal);
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Player } from 'src/store/gameData/state';
import manageScreenSetup from "src/mixins/game/manageScreen";

export default defineComponent({
  name: 'ScoreTab',
  setup() {
    var {
      showLeaderboard,
    } = manageScreenSetup();
    return {
      showLeaderboard
    }
  },
  computed: {
    playersByScore():Player[] {
      return this.$store.getters['gameData/playersByScore'];
    }
  },
  methods: {
    isSelf(id:number):boolean {
      return this.$store.state.gameData.self == id;
    },
    isOwner(id:number):boolean {
      return this.$store.state.gameData.owner == id;
    }
  }
});
</script>
