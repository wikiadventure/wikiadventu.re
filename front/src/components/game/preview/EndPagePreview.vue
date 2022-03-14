<template>
    <preview :wikiPreview="endPage" :beforeTitle="t('endPagePreview')" >
        <q-btn round dense flat icon="mdi-open-in-new" @click="showWikiEndPage = !showWikiEndPage, showGameMenu = !showGameMenu"/>
    </preview>
</template>
<script lang="ts" setup>
import Preview from "src/components/game/WikiPreview.vue";
import { showGameMenu, showWikiEndPage } from "store/gameLayoutManager/state";
import { endPage } from 'store/vote/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    endPagePreview: "Finish : "
  fr:
    endPagePreview: "Arrivée : "
</i18n>
