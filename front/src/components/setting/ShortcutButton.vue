<template>
  <div>
    <q-btn class="action-btn" push
        @click="$refs.dialog.open = true"
        icon="fullscreen"
        label="shortcut"
        />
    <shortcut-dialog ref="dialog"/>
  </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import { getLabel, Lang } from 'src/i18n';
import ShortcutDialog from './ShortcutDialog.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ShortcutButton',
  components: { ShortcutDialog }
});
</script>