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
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Message } from '../../../store/gameData/state';

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
    }
  }
});
</script>
