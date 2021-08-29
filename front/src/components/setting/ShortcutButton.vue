<template>
  <div>
    <q-btn class="action-btn" push
        @click="$refs.dialog.open = true"
        icon="mdi-keyboard"
        :label="t('shortcut.title')"
        />
    <shortcut-dialog ref="dialog"/>
  </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import { getLabel, Lang } from 'src/i18n';
import ShortcutDialog from './ShortcutDialog.vue';

import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ShortcutButton',
  components: { ShortcutDialog },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      t
    }
  }
});
</script>