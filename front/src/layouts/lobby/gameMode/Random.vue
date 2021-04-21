<template>
  <slide-menu>
    <template v-slot:gameTab>
      <random ref="gameTab"/>
    </template>
  </slide-menu>
</template>
<style lang="scss">
</style>
<script lang="ts">
import Random from './tab/game/Random.vue';
import SlideMenu from './slideMenu.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'RandomSlideMenu',
  components: { SlideMenu, Random }
});
</script>
