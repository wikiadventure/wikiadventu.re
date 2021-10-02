<template>
  <slide-menu ref="menu">
    <template v-slot:gameTab>
      <random ref="tab"/>
    </template>
  </slide-menu>
</template>
<script lang="ts">
import Random from './tab/game/Random.vue';
import SlideMenu from './slideMenu.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RandomSlideMenu',
  components: { SlideMenu, Random },
    setup() {
    const menu = ref<InstanceType<typeof SlideMenu>>();
    const tab = ref<InstanceType<typeof Random>>();
    return {
      menu,
      tab
    }
  }
});
</script>
