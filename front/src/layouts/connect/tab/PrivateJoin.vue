<template>
  <connect-form :title="t('menu.joinPrivateLobby')">
    <id-input/>
    <password-input v-model="password"/>   
    <pseudo-input/>
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
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import IdInput from 'src/components/form/IdInput.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';

import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PrivateJoin',
  components: { ConnectForm, ConnectBtn, PasswordInput, PseudoInput, IdInput },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const password = ref("");
    function submit() {
      var connectEvent:ConnectEvent = {
        type: ConnectType.PrivateJoin,
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
