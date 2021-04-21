<template>
  <slide-menu>
    <template v-slot:gameTab>
      <classic ref="gameTab"/>
    </template>
  </slide-menu>
</template>
<style lang="scss">
</style>
<script lang="ts">
import Classic from './tab/game/Classic.vue';
import SlideMenu from './slideMenu.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ClassicSlideMenu',
  components: { SlideMenu, Classic }
});
</script>
