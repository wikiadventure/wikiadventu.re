<template>
  <q-btn class="action-btn" push
      @click="$q.fullscreen.toggle()"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Go Fullscreen'"
    />
</template>
<style lang="scss">
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { getLabel, Lang } from '../../i18n';

export default defineComponent({
  name: 'FullscreenSwitch'
});
</script>