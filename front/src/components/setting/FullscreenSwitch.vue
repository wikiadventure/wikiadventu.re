<template>
  <q-btn class="action-btn" push
      @click="$q.fullscreen.toggle()"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="$t('settingTab.fullscreen')"
    />
</template>
<style lang="scss">
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'FullscreenSwitch'
});
</script>