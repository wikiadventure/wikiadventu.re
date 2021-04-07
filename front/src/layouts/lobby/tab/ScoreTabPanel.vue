<template>
  <div id="scoreTab">
    <div class="row items-baseline justify-evenly"><h4>{{ $t('scoreTab.title') }}</h4></div>
    <q-separator spaced="md"/>
    <div class="row items-baseline justify-evenly"><q-btn class="action-btn" push :label="$t('scoreTab.leaderboard')" icon="mdi-format-list-bulleted" @click="openLeaderBoard()"/></div>
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
import { ManageScreenEvent } from '../../../mixins/manageScreen';
import { Player } from '../../../store/gameData/state';

export default defineComponent({
  name: 'ScoreTabPanel',
  data() {
    return {
    }
  },
  computed: {
    playersByScore():Player[] {
      return this.$store.getters['gameData/playersByScore'];
    }
  },
  methods: {
    openLeaderBoard(e:Event) {
      var payload:ManageScreenEvent = {
        target: "leaderboard",
        state: true
      }
      this.$root.$emit("manage-screen", payload);
    },
    isSelf(id:number):boolean {
      return this.$store.state.gameData.self == id;
    },
    isOwner(id:number):boolean {
      return this.$store.state.gameData.owner == id;
    }
  }
});
</script>
