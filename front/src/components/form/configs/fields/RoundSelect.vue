<template>
  <q-input
    name="round" outlined hint="" type="number"
    v-model="round" :min="1" :max="50" :label="t('round')"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts" setup>
import { round } from 'store/connect/extra/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    round: "Rounds"
  fr:
    round: "Manches"
</i18n>