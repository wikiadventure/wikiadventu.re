<template>
  <q-input outlined v-model="id" name="lobbyID" :label="t('input.lobbyID')" 
  spellcheck="false" v-bind="$attrs"
  hint="" :dense="$q.screen.lt.sm">
  </q-input>
</template>

<script lang="ts">
import { id } from 'store/connect/state';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'IdInput',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      id,
      t
    }
  }
});
</script>