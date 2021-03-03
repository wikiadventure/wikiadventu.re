<template>
  <div id="gameTab">

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

    <div id="vote" class="row items-baseline q-ma-sm">
      <p class="q-ma-none col-strech">{{ $t('gameTab.vote') }} :</p>
      <p class="q-ma-none q-ml-sm text-left col-grow">{{ vote }}</p>
      <q-btn round dense flat icon="mdi-delete" class="voteDelete" @click="resetVote()"></q-btn>
    </div>
    <q-form class="voteForm q-ma-sm">
      <q-input dense class="voteInput" @keydown.enter.prevent="submitVote()" maxlength="255" outlined v-model="voteInput" :label="$t('gameTab.submitVote')" spellcheck="false">
        <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" @click="submitVote()"/>
        </template>
      </q-input>
    </q-form>

    <q-separator spaced="lg"/>

    <div class="row items-baseline q-ma-sm">
      <p class="q-ma-none col-strech">{{ $t('gameTab.startPage') }} :</p>
      <p class="q-ma-none q-ml-sm text-left col-grow">{{ startPage }}</p>
    </div>
    <div class="row items-baseline q-ma-sm">
      <p class="q-ma-none col-strech">{{ $t('gameTab.endPage') }} :</p>
      <p class="q-ma-none q-ml-sm text-left col-grow">{{ endPage }}</p>
    </div>

    <q-separator  spaced="lg"/>

    <div class="row items-baseline justify-evenly">
      <q-btn class="action-btn q-ma-sm" push :label="$t('gameTab.pageHistory')" icon="mdi-format-list-bulleted" @click="open('page-history')"/>
      <q-btn class="action-btn q-ma-sm" push :label="$t('gameTab.showEndPage')" icon="mdi-page-next-outline" @click="open('wiki-end-page')"/>
    </div>

    <q-separator  spaced="lg"/>

    <div class="row items-baseline justify-evenly">
      <p>{{ totalVoteSkip }} / {{ connectedPlayers }}</p>
      <q-btn class="action-btn q-ma-sm" push label="skip" icon="mdi-skip-forward" @click="voteSkip()"/>
    </div>
    
    <q-separator spaced="lg"/>

  </div>
</template>
<style lang="scss">
#gameTab {
  font-size: 120%;
}
.voteDelete {
  transition: all ease-in-out 0.2s;
}
.voteDelete:active {
  transform: rotate(145deg);
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import  { ManageScreenEvent } from "../../../mixins/manageScreen";
import { Player } from '../../../store/gameData/state';

export default defineComponent({
  name: 'GameTabPanel',
  data() {
    var vm = this as any;
    return {
      voteInput: ""
    }
  },
  computed: {
    vote():string {
      var v = this.$store.state.gameData.vote != null ? this.$store.state.gameData.vote : this.$t('gameTab.randomPage');  
      return v;
    },
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
    }
  },
  methods: {
    submitVote(e:Event) {
      var vm:any = this;
      vm.$store.dispatch('gameData/sendVote', vm.voteInput);
    },
    resetVote(e:Event) {
      var vm:any = this;
      vm.$store.dispatch('gameData/resetVote');
    },
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
