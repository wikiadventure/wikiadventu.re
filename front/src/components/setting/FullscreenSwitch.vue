<template>
  <q-btn class="action-btn" push
      @click="$q.fullscreen.toggle()"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="t('fullscreen')"
    />
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    fullscreen: "Fullscreen"
  fr:
    fullscreen: "Plein écran"
</i18n>
