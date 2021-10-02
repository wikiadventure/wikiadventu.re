<template>
  <connect-form :title="t('menu.joinTwitchLobby')">
    <id-input/>
    <password-input v-model="password"/>
    <pseudo-input/>
    <template v-slot:button>
      <connect-btn @click="submit(false)" :label="t('join')"/>
      <twitch-btn @click="submit(true)" :label="$q.screen.lt.sm ? t('join') : t('menu.button.joinWithTwitch') "/>
    </template>
  </connect-form>
</template>
<script lang="ts">
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import TwitchBtn from 'src/components/form/TwitchButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import IdInput from 'src/components/form/IdInput.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';

import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'TwitchJoin',
  components: { ConnectForm, ConnectBtn, TwitchBtn, PasswordInput, PseudoInput, IdInput },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const password = ref("");
    function submit(withTwitch:boolean) {
      var connectEvent:ConnectEvent = {
        type: withTwitch ? ConnectType.TwitchJoinWith : ConnectType.TwitchJoinWithout,
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