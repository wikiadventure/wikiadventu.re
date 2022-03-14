<template>
  <slide-menu ref="menu">
    <template v-slot:gameTab>
      <classic ref="tab"/>
    </template>
  </slide-menu>
</template>
<script lang="ts" setup>
import Classic from './tab/game/Classic.vue';
import SlideMenu from './slideMenu.vue';
import { ref } from 'vue';

const menu = ref<InstanceType<typeof SlideMenu>>();
const tab = ref<InstanceType<typeof Classic>>();
</script>
