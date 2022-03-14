<template>
    <preview :wikiPreview="startPage" :beforeTitle="t('startPagePreview')" />
</template>
<script lang="ts" setup>
import Preview from "src/components/game/WikiPreview.vue";
import { startPage } from 'store/vote/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    startPagePreview: "Start : "
  fr:
    startPagePreview: "Départ : "
</i18n>
