<template>
  <q-select
    v-model="lang" name="lang" outlined hint=""
    :options="options" :label="t('input.langSelect')" 
    :display-value="getLabel(lang)"
    :dense="$q.screen.lt.sm" v-bind="$attrs"
  >
  </q-select>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { allLangOptions, getLabel, Lang } from 'src/i18n';
import { lang } from 'store/connect/state';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LangSelect',
  setup() {
    const { t } = useI18n();
    return {
      allLangOptions,
      getLabel,
      lang,
      t
    }
  }
});
</script>