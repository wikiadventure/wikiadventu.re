<template>
  <q-input
    name="round" outlined hint="" type="number"
    v-model="round" :min="1" :max="50" :label="t('input.round')"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts">
import { round } from 'store/connect/extra/state';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'RoundSelect',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      t,
      round
    }
  }
});
</script>