<template>
  <div id="scoreTab">
    <q-list separator>
      <q-item v-for="player in playersByScore" :key="player.id">
        <q-item-section avatar>
          <q-avatar>
            <!--<img src="https://cdn.quasar.dev/img/boy-avatar.png">-->
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ player.pseudo }}</q-item-section>
        <q-item-section>{{ player.score }}</q-item-section>
      </q-item>
      <!--<q-expansion-item v-for="player in players" :key="player.id" :label="player.pseudo">
        <q-card>
          <q-card-section>
          </q-card-section>
        </q-card>
      </q-expansion-item>-->
    </q-list>
  </div>
</template>
<style lang="scss">
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
    playersByScore():Array<Player> {
      return this.$store.getters.gameData.playersByScore;
    }
  },
  methods: {
    openLeaderBoard(e:Event) {
      var payload:ManageScreenEvent = {
        target: "leaderboard",
        state: true
      }
      this.$root.$emit("manage-screen", payload);
    }
  }
});
</script>
