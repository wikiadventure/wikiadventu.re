<template>
  <q-input
    name="voteDuration" outlined hint="" type="number" shadow-text="s" class="reveal-shadow-text"
    v-model="voteDuration" :min="0" :max="3600" :label="t('voteDuration')"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts" setup>
import { voteDuration } from 'store/connect/extra/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    voteDuration: "Vote phase duration in secondes"
  fr:
    voteDuration: "Durée de la phase de vote en secondes"
</i18n>