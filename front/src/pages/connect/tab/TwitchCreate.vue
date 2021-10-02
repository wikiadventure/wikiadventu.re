<template>
  <connect-form :title="t('menu.createTwitchLobby')">
    <lang-select/>
    <pseudo-input/>
    <password-input v-model="password"/>
    <game-loop-select/>
    <slot-select/>
    <template v-slot:button>
      <twitch-btn @click="submit" :label="t('menu.button.createWithTwitch')"/>
    </template>
  </connect-form>
</template>
<script lang="ts">
import TwitchBtn from 'src/components/form/TwitchButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import SlotSelect from 'src/components/form/SlotSelect.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';

import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'TwitchCreate',
  components: { ConnectForm, TwitchBtn, LangSelect, PasswordInput, PseudoInput, GameLoopSelect, SlotSelect },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const password = ref("");
    function submit() {
      var connectEvent:ConnectEvent = {
        type: ConnectType.TwitchCreate,
        password: password.value
      }
      login(connectEvent);
    }
    return {
      password,
      submit,
      t
    }
  }
});
</script>