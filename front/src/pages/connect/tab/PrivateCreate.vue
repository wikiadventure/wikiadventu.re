<template>
  <connect-form createLobby :title="t('createPrivateLobby')">
    <lang-select/>
    <password-input v-model="password"/>
    <pseudo-input/>
    <game-loop-select/>
    <slot-select/>
    <config/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="t('create')"/>
    </template>
  </connect-form>
</template>
<script lang="ts" setup>
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import SlotSelect from 'src/components/form/SlotSelect.vue';
import Config from 'src/components/form/GameLoopConfig.vue';
import { login } from 'store/connect/action';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const password = ref("");

function submit() {
  const connectEvent:ConnectEvent = {
    type: ConnectType.PrivateCreate,
    password: password.value
  }
  login(connectEvent);
}
</script>
<i18n lang="yaml">
  en:
    createPrivateLobby: "Create a private party"
    create: "Create"
  fr:
    createPrivateLobby: "Créer une partie privée"
    create: "Créer"
</i18n>