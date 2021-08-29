<template>
  <q-btn class="action-btn" push
      @click="$q.fullscreen.toggle()"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="t('settingTab.fullscreen')"
    />
</template>
<style lang="scss">
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'FullscreenSwitch',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      t
    }
  }
});
</script>