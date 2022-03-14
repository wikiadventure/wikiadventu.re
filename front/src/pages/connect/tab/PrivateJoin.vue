<template>
  <connect-form :title="t('joinPrivateLobby')">
    <id-input/>
    <password-input v-model="password"/>   
    <pseudo-input/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="t('join')"/>
    </template>
  </connect-form>
</template>
<script lang="ts" setup>
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import IdInput from 'src/components/form/IdInput.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const password = ref("");

function submit() {
  const connectEvent:ConnectEvent = {
    type: ConnectType.PrivateJoin,
    password: password.value
  }
  login(connectEvent);
}
</script>
<i18n lang="yaml">
  en:
    joinPrivateLobby: "Join a private party"
    join: "Join"
  fr:
    joinPrivateLobby: "Rejoindre une partie privée"
    join: "Rejoindre"
</i18n>
