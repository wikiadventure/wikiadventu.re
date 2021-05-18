<template>
  <q-form class="voteForm q-ma-sm">
    <div id="vote" class="row items-center q-ma-sm">
      <p class="q-ma-none col-strech">{{ $t('gameTab.vote') }} :</p>
      <p class="q-ma-none q-ml-sm text-left col">{{ vote }}</p>
      <q-btn round dense flat icon="mdi-delete" class="voteDelete" @click="resetVote()"></q-btn>
    </div>
    <q-input @focus="voteInputFocus = true" @blur="blur()" 
            dense class="voteInput" @keydown.enter.prevent="submitVote(voteInput)" 
            maxlength="255" outlined v-model="voteInput" :label="$t('gameTab.submitVote')" 
            spellcheck="false" >
      <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" @click="submitVote(voteInput)"/>
      </template>
    </q-input>
    <div class="suggest" v-if="voteInputFocus">
      <div v-for="s in suggestions" :key="s.title" @click.stop="submitVote(s.title)">
        <img v-if="s.thumbnail !== null" :src="s.thumbnail.source" :width="s.thumbnail.width" :height="s.thumbnail.height" />
        <h3>{{ s.title }}</h3>
        <p>{{ s.description }}</p>
      </div>
    </div>
  </q-form>
</template>
<style lang="scss">
.voteDelete {
  transition: all ease-in-out 0.2s;
  &:active {
    transform: rotate(145deg);
  }
}
.suggest {
  z-index: 2;
  position: absolute;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  display: grid;
  &>div {
    border-bottom: 1px solid #8885;
    cursor: pointer;
    background: inherit;
    padding: 10px;
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-rows: calc(1.5rem + 10px) auto;
    grid-template-areas: 
    "i t t"
    "i d d";
    &:last-child {
      border: none;
    }
    img {
      grid-area: i;
      width: 80px;
      height: 80px;
      border-radius: 3px;
    }
    h3 {
      grid-area: t;
      margin: 5px 15px;
      font-size: 1.5rem;
      line-height: 1.5rem;
    }
    p {
      grid-area: d;
      margin: 5px 15px;
      font-size: 1rem;
      line-height: 1rem;
    }
    &:hover {
      filter: brightness(1.2);
    }
  }
}
.body--dark {
  .suggest {
    background: var(--wa-color-dark-blue);
  }
}
.body--light {
  .suggest {
    background: var(--wa-color-light-teal);
  }
}
</style>
<script lang="ts">
import { debounce } from 'quasar';
import { WikiSuggestion } from 'src/store/gameData/state';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: "VoteInput",
  data():{
    voteInputFocus: boolean,
  } {
    return {
      voteInputFocus: false,
    }
  },
  computed: {
    vote():string {
      var v = this.$store.state.gameData.vote != null ? this.$store.state.gameData.vote : this.$t('gameTab.randomPage');  
      return v;
    },
    voteInput: {
      get():string {
        return this.$store.state.gameData.voteInput;
      },
      set(v:String) {
        this.$store.commit('gameData/voteInput', v);
        this.loadSuggestions();
      } 
    },
    suggestions():WikiSuggestion[] {
      return this.$store.state.gameData.suggestions;
    }
  },
  methods: {
    submitVote(v:string) {
      this.$store.dispatch('gameData/sendVote', v);
    },
    resetVote() {
      this.$store.dispatch('gameData/resetVote');
    },
    loadSuggestions() {
      this.$store.commit('gameData/loadSuggestions');
    },
    blur() {
      setTimeout(() => this.voteInputFocus = false, 250);
    }
  },
  created() {
    this.loadSuggestions = debounce(this.loadSuggestions, 250);
  }
})
</script>
