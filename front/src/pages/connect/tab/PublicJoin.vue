<template>
  <connect-form :title="t('joinPublicLobby')">
    <lang-select/>
    <id-input/>
    <pseudo-input/>
    <game-loop-select/>
    <template v-slot:button>
      <connect-btn @click="submit" :label="t('join')"/>
    </template>
  </connect-form>
</template>
<script lang="ts" setup>
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import IdInput from 'src/components/form/IdInput.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

function submit() {
  const connectEvent:ConnectEvent = {
    type: ConnectType.PublicJoin
  }
  login(connectEvent);
}
</script>
<i18n lang="yaml">
  en:
    joinPublicLobby: "Join a public party"
    join: "Join"
  fr:
    joinPublicLobby: "Rejoindre une partie publique"
    join: "Rejoindre"
</i18n>
