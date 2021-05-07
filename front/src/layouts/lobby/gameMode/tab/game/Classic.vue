<template>
  <div class="classic-game-tab">

    <div class="row justify-evenly q-ma-md text-h3">{{ $t('gameTab.round') }} {{ round }}</div>

    <q-separator spaced="lg"/>

    <div class="row items-baseline q-ma-sm">
      <h4 class="q-ma-none col-strech">{{ $t('gameTab.phase') }}</h4>
      <h5 class="q-ma-none q-ml-sm text-center col-grow">{{ $t('phase.'+gamePhase) }}</h5>
    </div>

    <q-separator spaced="lg"/>

    <div class="row items-baseline q-ma-sm">
      <h4 class="q-ma-none col-strech">{{ $t('gameTab.timeLeft') }}</h4>
      <h5 class="q-ma-none q-ml-sm text-center col-grow">{{ timeLeft }}</h5>
    </div>

    <q-separator  spaced="lg"/>

    <vote-input/>

    <q-separator spaced="lg"/>

    <div class="row items-baseline q-ma-sm">
      <p class="q-ma-none col-strech">{{ $t('gameTab.startPage') }} :</p>
      <p class="q-ma-none q-ml-sm text-left col">{{ startPage }}</p>
    </div>
    <div class="row items-baseline q-ma-sm">
      <p class="q-ma-none col-strech">{{ $t('gameTab.endPage') }} :</p>
      <p class="q-ma-none q-ml-sm text-left col">{{ endPage }}</p>
    </div>

    <q-separator  spaced="lg"/>

    <div class="row items-center justify-evenly">
      <q-btn class="action-btn q-ma-sm" push :label="$t('gameTab.pageHistory')" icon="mdi-format-list-bulleted" @click="open('page-history')"/>
      <q-btn class="action-btn q-ma-sm" push :label="$t('gameTab.showEndPage')" icon="mdi-page-next-outline" @click="open('wiki-end-page')"/>
    </div>

    <q-separator  spaced="lg"/>

    <div class="row items-center justify-evenly">
      <p class="q-my-none" :class="{ 'self': hasVoteSkip }">{{ totalVoteSkip }} / {{ connectedPlayers }}</p>
      <q-btn class="action-btn q-ma-sm" push label="skip" icon="mdi-skip-forward" @click="voteSkip()"/>
    </div>
    
    <q-separator spaced="lg"/>

  </div>
</template>
<style lang="scss">
.classic-game-tab {
  font-size: 1.2em;
}
.self {
  color: var(--w-color-dark-teal);
}
</style>
<script lang="ts">
import  { ManageScreenEvent } from 'src/mixins/manageScreen';
import VoteInput from 'src/components/game/VoteInput.vue';
import { Player } from 'src/store/gameData/state';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ClassicGameTab',
  components: { VoteInput },
  computed: {
    startPage():string {
      return this.$store.state.gameData.startPage;
    },
    endPage():string {
      return this.$store.state.gameData.endPage;
    },
    gamePhase():number {
      return this.$store.state.gameData.gamePhase;
    },
    round():string {
      return this.$store.state.gameData.round;
    },
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
  },
  methods: {
    voteSkip(e:Event) {
      var vm:any = this;
      vm.$store.dispatch('gameData/voteSkip');
    },
    open(target:string) {
      var payload1:ManageScreenEvent = {
        target: target,
        state: true
      }
      var payload2:ManageScreenEvent = {
        target: "game-menu",
        state: false
      }
      this.$root.$emit("manage-screen", payload1);
      this.$root.$emit("manage-screen", payload2);
    }
  }
});
</script>
