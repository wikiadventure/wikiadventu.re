<template>
    <q-btn class="action-btn show-page-history" push :label="t('pageHistory')" icon="mdi-format-list-bulleted" @click="showPageHistory = !showPageHistory, showPageHistory = !showGameMenu"/>
</template>
<style lang="scss">
.show-page-history {
  align-self: center;
}
</style>
<script lang="ts" setup>
import { showPageHistory, showGameMenu } from 'store/gameLayoutManager/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    pageHistory: "skip"
  fr:
    pageHistory: "Historique du dernier gagnant"
</i18n>
