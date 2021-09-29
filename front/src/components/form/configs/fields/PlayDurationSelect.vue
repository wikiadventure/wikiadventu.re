<template>
  <q-input
    name="playDuration" outlined hint="" type="number" shadow-text="s" class="reveal-shadow-text"
    v-model="playDuration" :min="0" :max="3600" :label="t('input.playDuration')"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts">
import { playDuration } from 'store/connect/extra/state';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PlayDurationSelect',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      t,
      playDuration
    }
  }
});
</script>