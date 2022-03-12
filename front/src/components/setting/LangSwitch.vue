
<template>
  <q-select outlined :options="allLangOptions"
    v-model="locale" emit-value map-options
    v-bind="$attrs" behavior="dialog">
    <template v-slot:prepend>
      <q-icon name="mdi-translate"></q-icon>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { allLangOptions } from 'src/i18n';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });
</script>