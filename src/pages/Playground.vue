<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useGameStore } from '../stores/useGameStore';
import IdleDialog from '../components/game/IdleDialog.vue';

const { store } = useGameStore();

const playgroundComponent = computed(() => {
  if (store.gamemode == "Classic") {
    return defineAsyncComponent(() => import("./mode/ClassicPlayground.vue"));
  } else {
    return "div";
  }
})

</script>
<template>
<component :is="playgroundComponent" />
<IdleDialog/>
</template>
<style>
</style>
