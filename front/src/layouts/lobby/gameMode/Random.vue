<template>
  <slide-menu ref="menu">
    <template v-slot:gameTab>
      <random ref="tab"/>
    </template>
  </slide-menu>
</template>
<style lang="scss">
</style>
<script lang="ts">
import Random from './tab/game/Random.vue';
import SlideMenu from './slideMenu.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RandomSlideMenu',
  components: { SlideMenu, Random }
});
</script>
