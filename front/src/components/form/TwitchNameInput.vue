<template>
  <q-input outlined v-model="twitchName" name="twitchName" :label="t('twitchName')" 
    spellcheck="false" v-bind="$attrs"
    hint="" :dense="$q.screen.lt.sm">
  </q-input>
</template>
<script lang="ts" setup>
import { twitchName } from 'store/connect/twitch/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    twitchName: "Twitch username"
  fr:
    twitchName: "Pseudo Twitch"
</i18n>