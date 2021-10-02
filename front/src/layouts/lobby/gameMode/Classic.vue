<template>
  <slide-menu ref="menu">
    <template v-slot:gameTab>
      <classic ref="tab"/>
    </template>
  </slide-menu>
</template>
<script lang="ts">
import Classic from './tab/game/Classic.vue';
import SlideMenu from './slideMenu.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ClassicSlideMenu',
  components: { SlideMenu, Classic },
  setup() {
    const menu = ref<InstanceType<typeof SlideMenu>>();
    const tab = ref<InstanceType<typeof Classic>>();
    return {
      menu,
      tab
    }
  }
});
</script>
