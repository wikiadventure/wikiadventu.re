<template>
  <q-input outlined v-model="id" name="lobbyID" :label="t('lobbyID')" 
    spellcheck="false" v-bind="$attrs"
    hint="" :dense="$q.screen.lt.sm">
  </q-input>
</template>
<script lang="ts" setup>
import { id } from 'store/connect/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    lobbyID: "Party ID"
  fr:
    lobbyID: "ID de la partie"
</i18n>