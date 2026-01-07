<script setup lang="ts">
import { computed, defineAsyncComponent, onUnmounted } from 'vue';
import { resetGameStore, useGameStore } from '../stores/useGameStore';
import IdleDialog from '../components/game/IdleDialog.vue';

const { store } = useGameStore();

const playgroundComponent = computed(() => {
  if (store.gamemode == "Classic") {
    return defineAsyncComponent(() => import("./mode/ClassicPlayground.vue"));
  } else if (store.gamemode == "Epic") {
    return defineAsyncComponent(() => import("./mode/EpicPlayground.vue"));
  } else {
    return "div";
  }
});

onUnmounted(() => resetGameStore());

</script>
<template>
<component :is="playgroundComponent" />
<IdleDialog/>
</template>
<style>
</style>
