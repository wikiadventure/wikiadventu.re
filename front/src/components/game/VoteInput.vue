<template>
  <q-form class="vote-input">
    <preview :wikiPreview="votePreview" class="vote">
      <q-btn round dense flat icon="mdi-delete" class="voteDelete" @click="deleteVote()"></q-btn>
    </preview>
    
    <q-input ref="voteInput" @focus="voteInputFocus = true" 
            @blur="setTimeout(() => voteInputFocus = false, 250)"
            @change="loadInputSuggestion()"
            dense class="q-ma-sm" @keydown.enter.prevent="unfocus();sendVote(vote)" 
            maxlength="255" outlined v-model="voteInput" :label="t('gameTab.vote.submitVote')" 
            spellcheck="false" >
      <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" @click="unfocus();searchVote(voteInput)"/>
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
import preview from "components/game/WikiPreview.vue";

import { defineComponent, ref } from 'vue';
import { voteSetup } from 'store/vote';
import { sendVote } from 'store/ws/packetSender/vanilla/vote';
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VoteInput",
  components: { preview },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    var {
      vote,
      voteInput,
      voteInputFocus,
      deleteVote,
      loadInputSuggestions
    } = voteSetup();

    var input = ref<any>();

    function unfocus(){(input.value.blur() as any).blur()};
    
    return {
      vote,
      voteInput,
      voteInputFocus,
      deleteVote,
      loadInputSuggestions,
      sendVote,
      unfocus,
      t
    }
  }
})
</script>
