<template>
  <slide-menu ref="menu">
    <template v-slot:gameTab>
      <random ref="tab"/>
    </template>
  </slide-menu>
</template>
<script lang="ts" setup>
import Random from './tab/game/Random.vue';
import SlideMenu from './slideMenu.vue';
import { ref } from 'vue';

const menu = ref<InstanceType<typeof SlideMenu>>();
const tab = ref<InstanceType<typeof Random>>();
</script>
