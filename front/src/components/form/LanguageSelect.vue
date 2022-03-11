<template>
  <q-select
    class="language-select"
    v-model="lang" name="lang" outlined hint=""
    :options="allLangOptions" :label="t('input.langSelect')" 
    :display-value="getLabel(lang)" emit-value map-options
    :dense="$q.screen.lt.sm" v-bind="$attrs"
  >
  </q-select>
</template>
<style lang="scss">
.language-select {
  min-width: 26ch;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { allLangOptions, getLabel } from 'src/i18n';
import { lang } from 'store/connect/state';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LangSelect',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      allLangOptions,
      getLabel,
      lang,
      t
    }
  }
});
</script>