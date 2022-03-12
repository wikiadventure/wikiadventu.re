<template>
  <q-select
    class="language-select"
    v-model="lang" name="lang" outlined hint=""
    :options="allLangOptions" :label="t('langSelect')" 
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
<script lang="ts" setup>
import { allLangOptions, getLabel } from 'src/i18n';
import { lang } from 'store/connect/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    langSelect: "Wiki language"
  fr:
    langSelect: "Langue du wiki"
</i18n>