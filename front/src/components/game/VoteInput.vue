<template>
  <q-form class="vote-input">
    <preview :wikiPreview="vote" class="vote">
      <q-btn round dense flat icon="mdi-delete" class="voteDelete" @click="deleteVote()"></q-btn>
    </preview>
    
    <q-input ref="input" 
            @focus="voteInputFocus = true" @blur="unfocus()"
            @keydown.enter.prevent="blur();sendVote(vote.input)" 
            v-model="voteInput" :label="t('gameTab.vote.submitVote')" 
            maxlength="255" outlined dense class="q-ma-sm" spellcheck="false" >
      <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" @click="blur();searchVote(voteInput)"/>
      </template>
    </q-input>
    
    <div class="suggest" v-if="voteInputFocus">
      <preview v-for="s in suggestions" :wikiPreview="s" :key="s.title" @click.stop="blur();submitSuggestion(s)" />
    </div>
  </q-form>
</template>
<style lang="scss">
.vote-input {
  .voteDelete {
    transition: all ease-in-out 0.2s;
    &:active {
      transform: rotate(145deg);
    }
  }
  .suggest {
    z-index: 2;
    overflow: hidden;
    position: absolute;
    display: grid;
    width: 98%;
    margin: 0 1%;
    background: var(--clr-alt);
    border: 1px solid #8885;
    border-radius: 10px;
    .wiki-preview {
      background: inherit;
      border-bottom: 1px solid #8885;
      cursor: pointer;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
          filter: brightness(1.1);
      }
    }
    
  }
}
</style>
<script lang="ts">
import preview from "./WikiPreview.vue";

import { defineComponent, ref, watch } from 'vue';
import { voteSetup } from 'store/vote';
import { sendVote } from 'store/ws/packetSender/vanilla/vote';
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VoteInput",
  components: { preview },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const {
      vote,
      voteInput,
      voteInputFocus,
      suggestions,
      deleteVote,
      searchVote,
      submitSuggestion,
      loadInputSuggestions
    } = voteSetup();

    watch(voteInput, (v)=>loadInputSuggestions(v));

    const input = ref<HTMLElement>();
    //the set time out is a hack to prevent vue from remove (v-if) the suggestions before it handle the click event on it
    //nextTick don't work for some reason
    function unfocus(){setTimeout(() => voteInputFocus.value = false,250)};
    function blur(){input.value?.blur()};
    
    return {
      vote,
      voteInput,
      voteInputFocus,
      suggestions,
      deleteVote,
      searchVote,
      submitSuggestion,
      sendVote,
      unfocus,
      blur,
      t
    }
  }
})
</script>
