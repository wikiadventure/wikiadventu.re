<template>
  <connect-form :title="t('joinTwitchLobby')">
    <twitch-name-input/>
    <password-input v-model="password"/>
    <pseudo-input/>
    <template v-slot:button>
      <connect-btn @click="submit(false)" :label="t('join')"/>
      <twitch-btn @click="submit(true)" :label="$q.screen.lt.sm ? t('join') : t('joinWithTwitch') "/>
    </template>
  </connect-form>
</template>
<script lang="ts" setup>
import ConnectBtn from 'src/components/form/ConnectButton.vue';
import TwitchBtn from 'src/components/form/TwitchButton.vue';
import ConnectForm from 'src/components/form/ConnectForm.vue';
import PasswordInput from 'src/components/form/PasswordInput.vue';
import PseudoInput from 'src/components/form/PseudoInput.vue';
import TwitchNameInput from 'src/components/form/TwitchNameInput.vue';
import { ConnectEvent, ConnectType } from 'store/connect/type';
import { login } from 'store/connect/action';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const password = ref("");

function submit(withTwitch:boolean) {
  var connectEvent:ConnectEvent = {
    type: withTwitch ? ConnectType.TwitchJoinWith : ConnectType.TwitchJoinWithout,
    password: password.value
  }
  login(connectEvent);
}
</script>
<i18n lang="yaml">
  en:
    joinTwitchLobby: "Join a Twitch party"
    join: "Join"
    joinWithTwitch: "Join with Twitch"
  fr:
    joinTwitchLobby: "Rejoindre une partie Twitch"
    join: "Rejoindre"
    joinWithTwitch: "Rejoindre avec twitch"
     
</i18n>
