<template>
  <q-input outlined v-model="twitchName" name="twitchName" :label="t('input.twitchName')" 
    spellcheck="false" v-bind="$attrs"
    hint="" :dense="$q.screen.lt.sm">
  </q-input>
</template>
<script lang="ts">
import { twitchName } from 'store/connect/twitch/state';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'IdInput',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      twitchName,
      t
    }
  }
});
</script>