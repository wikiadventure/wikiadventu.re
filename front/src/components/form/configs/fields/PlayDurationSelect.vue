<template>
  <q-input
    name="playDuration" outlined hint="" type="number" shadow-text="s" class="reveal-shadow-text"
    v-model="playDuration" :min="0" :max="3600" :label="t('playDuration')"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts" setup>
import { playDuration } from 'store/connect/extra/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    playDuration: "Play phase duration in secondes"
  fr:
    playDuration: "Durée de la phase de jeu en secondes"
</i18n>
