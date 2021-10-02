<template>
  <q-input class="pseudo-input" outlined v-model="pseudo" :label="t('input.pseudo')"
          name="pseudo" spellcheck="false" :dense="$q.screen.lt.sm"
          v-bind="$attrs"
          >
          <!--:rules="[ v => v.length >= 3 || t('input.hint.minChars3'),
                    v => v.length <= 25 || t('input.hint.maxChars25'),
                    v => !v.match(/[<>:|%$\/\\]/g) || t('input.hint.restrictedChars')]"-->
    <template v-slot:append>
      <q-icon class="iconBtn" name="mdi-dice-5" @click="randomizePseudo()"></q-icon>
    </template>
  </q-input>
</template>
<style lang="scss">
.pseudo-input .iconBtn{
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
  &:active {
    transform: scale(1) rotate(360deg);
  }
}
</style>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { connectSetup } from 'store/connect'
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PseudoInput',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    var {
      pseudo,
      randomizePseudo
    } = connectSetup();
    
    return {
      pseudo,
      randomizePseudo,
      t
    }
  }
});
</script>