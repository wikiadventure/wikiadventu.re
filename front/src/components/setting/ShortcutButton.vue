<template>
  <div>
    <q-btn class="action-btn" push
        @click="dialog && (dialog.open = true)"
        icon="mdi-keyboard"
        :label="t('shortcuts')"
        />
    <shortcut-dialog ref="dialog"/>
  </div>
</template>
<script lang="ts" setup>
import ShortcutDialog from './ShortcutDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
const dialog = ref<InstanceType<typeof ShortcutDialog>>();
</script>
<i18n lang="yaml">
  en:
    shortcuts: "Shortcuts"
  fr:
    shortcuts: "Raccourcis"
</i18n>
