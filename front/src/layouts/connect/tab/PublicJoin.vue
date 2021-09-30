<template>
  <connect-form :title="t('menu.joinPublicLobby')">
    <lang-select/>
    <id-input/>
    <pseudo-input/>
    <game-loop-select/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="t('join')"/>
    </template>
  </connect-form>
</template>
<style lang="scss">

</style>
<script lang="ts">
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import IdInput from 'src/components/form/IdInput.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';

import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PublicJoin',
  components: { ConnectForm, ConnectBtn, LangSelect, PasswordInput, PseudoInput, IdInput, GameLoopSelect },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    function submit() {
      var connectEvent:ConnectEvent = {
        type: ConnectType.PublicJoin
      }
      login(connectEvent);
    }
    return {
      submit,
      t
    }
  }
});
</script>