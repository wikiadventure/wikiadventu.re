<template>
  <q-select class="compact-lang-switch"
    v-model="locale" :options="allLangOptions"
    dense standout emit-value
    v-bind="$attrs" behavior="dialog">
    <template v-slot:prepend>
      <q-icon name="mdi-translate"></q-icon>
    </template>
  </q-select>
</template>
<style lang="scss">
.compact-lang-switch {
  .q-field__append {
    display: none;
  }
  .q-field__control {
    background: transparent!important;
    div {
      color: var(--clr-reverse)!important;
    }
  }
}
</style>
<script lang="ts" setup>
import { allLangOptions } from 'src/i18n';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });
</script>