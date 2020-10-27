<template>
  <div>
  <div><p>{{ lobbyState }}</p><p>{{ timeLeft }}</p></div>
    <div id="vote"><p>Your vote :</p><p id="playerVote"></p></div>
    <q-form class="voteForm">
      <input tabindex=1 id="inputVote" class="uiInput" placeholder="${votePlaceholder}" autocomplete="off" /><button class="uiSubmit" id="voteSubmit">&#10004;</button>
    </q-form>
    <div><p>Start page :</p><p>{{ startPage }}</p></div>
    <div><p>End page :</p><p>{{ endPage }}</p></div>
  </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Message } from '../../store/gameData/state';

export default defineComponent({
  name: 'GameTabPanel',
  data() {
    return {
      message: ""
    }
  },
  computed: {
    startPage():string {
      return this.$store.state.gameData.startPage;
    },
    endPage():string {
      return this.$store.state.gameData.endPage;
    },
    lobbyState():string {
      return this.$store.state.gameData.lobbyState;
    },
    timeLeft():string {
      return this.$store.state.gameData.timeLeft;
    }
  },
  methods: {
   
  }
});
</script>
