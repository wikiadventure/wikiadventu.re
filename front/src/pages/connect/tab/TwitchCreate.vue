<template>
  <connect-form :title="t('createTwitchLobby')">
    <lang-select/>
    <pseudo-input/>
    <password-input v-model="password"/>
    <game-loop-select/>
    <slot-select/>
    <template v-slot:button>
      <twitch-btn @click="submit" :label="t('createWithTwitch')"/>
    </template>
  </connect-form>
</template>
<script lang="ts" setup>
import TwitchBtn from 'src/components/form/TwitchButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import LangSelect from 'src/components/form/LanguageSelect.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import GameLoopSelect from 'src/components/form/GameLoopSelect.vue';
import SlotSelect from 'src/components/form/SlotSelect.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const password = ref("");

function submit() {
  const connectEvent:ConnectEvent = {
    type: ConnectType.TwitchCreate,
    password: password.value
  }
  login(connectEvent);
}
</script>
<i18n lang="yaml">
  en:
    createTwitchLobby: "Create a Twitch party"
    createWithTwitch: "Create with Twitch"
  fr:
    createTwitchLobby: "Créer une partie Twitch"
    createWithTwitch: "Créer avec Twitch"
</i18n>
