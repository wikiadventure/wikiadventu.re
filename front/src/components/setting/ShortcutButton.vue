<template>
  <div>
    <q-btn class="action-btn" push
        @click="dialog && (dialog.open = true)"
        icon="mdi-keyboard"
        :label="t('shortcut.title')"
        />
    <shortcut-dialog ref="dialog"/>
  </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import ShortcutDialog from './ShortcutDialog.vue';

import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ShortcutButton',
  components: { ShortcutDialog },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const dialog = ref<InstanceType<typeof ShortcutDialog>>();
    return {
      t,
      dialog
    }
  }
});
</script>