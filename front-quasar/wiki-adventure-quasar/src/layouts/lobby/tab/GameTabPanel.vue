<template>
  <div id="gameTab">
    <div class="row q-ma-md"><h3 class="q-ma-none flex-grow text-center">{{ $t('gameTab.round') }} {{ round }}</h3></div>
    <div class="row items-baseline q-ma-sm"><h4 class="q-ma-none flex-fix">{{ $t('gameTab.phase') }}</h4><h5 class="q-ma-none q-ml-sm text-center flex-grow">{{ $t('phase.'+lobbyState) }}</h5></div>
    <q-separator spaced="lg"/>
    <div class="row items-baseline q-ma-sm"><h4 class="q-ma-none flex-fix">{{ $t('gameTab.timeLeft') }}</h4><h5 class="q-ma-none q-ml-sm text-center flex-grow">{{ timeLeft }}</h5></div>
    <q-separator  spaced="lg"/>
    <div id="vote" class="row items-baseline q-ma-sm"><p class="q-ma-none flex-fix">{{ $t('gameTab.vote') }} :</p><p class="q-ma-none q-ml-sm text-left flex-grow">{{ vote }}</p><q-btn round dense flat icon="mdi-delete" class="voteDelete" @click="resetVote()"></q-btn></div>
    <q-form class="voteForm q-ma-sm">
      <q-input dense class="voteInput" @keydown.enter.prevent="submitVote()" maxlength="255" outlined v-model="voteInput" :label="$t('gameTab.submitVote')" spellcheck="false">
        <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" @click="submitVote()"/>
        </template>
      </q-input>
    </q-form>
    <q-separator spaced="lg"/>
    <div class="row items-baseline q-ma-sm"><p class="q-ma-none flex-fix">{{ $t('gameTab.startPage') }} :</p><p class="q-ma-none q-ml-sm text-left flex-grow">{{ startPage }}</p></div>
    <div class="row items-baseline q-ma-sm"><p class="q-ma-none flex-fix">{{ $t('gameTab.endPage') }} :</p><p class="q-ma-none q-ml-sm text-left flex-grow">{{ endPage }}</p></div>
    <q-separator  spaced="lg"/>
    <div class="row items-baseline q-ma-sm"><q-btn class="path-btn" push :label="$t('gameTab.pageHistory')" icon="mdi-format-list-bulleted" @click="openPageHistory()"/></div>
    <q-separator  spaced="lg"/>
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
.flex-grow {
  flex:1;
}
.flex-fix {
  flex: 0 0 auto;
}
.body--dark .path-btn {
  background: var(--w-color-dark-teal);
  color: var(--w-color-dark-blue);          
}
.body--light .path-btn {
  background: var(--w-color-almost-black);
  color: var(--w-color-blue-white);
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Message } from '../../../store/gameData/state';
import  { ManageScreenEvent } from "../../../mixins/manageScreen";

export default defineComponent({
  name: 'GameTabPanel',
  data() {
    var vm = this as any;
    return {
      vote: vm.$t('gameTab.randomPage'),
      voteInput: ""
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
    round():string {
      return this.$store.state.gameData.round;
    },
    timeLeft():string {
      return Math.ceil(this.$store.state.gameData.timeLeft).toString();
    }
  },
  methods: {
    submitVote(e:Event) {
      var vm:any = this;
      vm.$store.dispatch('gameData/sendVote', vm.voteInput);
      fetch("https://" + vm.$store.state.gameData.lang + ".wikipedia.org/w/api.php?action=query&origin=*&list=search&srlimit=1&srnamespace=0&srsearch=intitle:" + encodeURIComponent(vm.voteInput) + "&format=json&srprop=")
        .then(function(response){return response.json();})
        .then(function(response) {
          var trueTitle;
          if (typeof response.query.search[0] === 'undefined') trueTitle = "no page found";
          else trueTitle = response.query.search[0].title;
          vm.vote = vm.voteInput + " → " + trueTitle;
          vm.voteInput = "";
        });
        return;
    },
    resetVote(e:Event) {
      var vm:any = this;
      vm.$store.dispatch('gameData/resetVote');
      vm.vote = this.$t('gameTab.randomPage');
    },
    openPageHistory(e:Event) {
      var payload1:ManageScreenEvent = {
        target: "page-history",
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
