<template>
  <q-form class="vote-input">
    <preview :wikiPreview="votePreview" class="vote">
      <q-btn round dense flat icon="mdi-delete" class="voteDelete" @click="resetVote()"></q-btn>
    </preview>
    
    <q-input @focus="voteInputFocus = true" @blur="blur()" 
            dense class="q-ma-sm" @keydown.enter.prevent="searchVote(voteInput)" 
            maxlength="255" outlined v-model="voteInput" :label="$t('gameTab.vote.submitVote')" 
            spellcheck="false" >
      <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" @click="searchVote(voteInput)"/>
      </template>
    </q-input>
    
    <div class="suggest" v-if="voteInputFocus">
      <preview :wikiPreview="s" v-for="s in suggestions" :key="s.title" @click.stop="submitVote(s)" />
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
  .wiki-preview {
    border-bottom: 1px solid #8885;
    cursor: pointer;
    background: inherit;
    :hover {
        filter: brightness(1.1);
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
import { WikiPreview, WikiSuggestion } from 'src/store/gameData/state';
import preview from "components/game/WikiPreview.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: "VoteInput",
  components: { preview },
  data():{
    voteInputFocus: boolean,
  } {
    return {
      voteInputFocus: false,
    }
  },
  computed: {
    votePreview():WikiPreview {
      let v = this.$store.state.gameData.vote;
      return {
        title: v.title || this.$t('gameTab.vote.noVoteTitle'),
        description: v.description == String.fromCharCode(24) ? this.$t('gameTab.vote.noPageFoundDescription') : (v.description || this.$t('gameTab.vote.noVoteDescription')),
        thumbnail: v.thumbnail
      };
    },
    voteInput: {
      get():string {
        return this.$store.state.gameData.vote.input;
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
    searchVote(v:string) {
      this.$store.dispatch('gameData/searchVote', v);
    },
    submitVote(s:WikiPreview) {
      this.$store.dispatch('gameData/submitVote', s);
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
