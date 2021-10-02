
<template>
  <q-select outlined :options="allLangOptions"
    v-model="locale" emit-value map-options
    v-bind="$attrs" behavior="dialog">
    <template v-slot:prepend>
      <q-icon name="mdi-translate"></q-icon>
    </template>
  </q-select>
</template>
<style lang="scss">
</style>
<script lang="ts">
import { allLangOptions } from 'src/i18n';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LangSwitch',
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    return {
      locale,
      allLangOptions
    }
  }
});
</script>