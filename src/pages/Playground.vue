<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useClassicGameStore } from '../stores/mode/classic/useClassic';

const { store } = useClassicGameStore();

const playgroundComponent = computed(() => {
  if (store.gamemode == "Classic") {
    return defineAsyncComponent(() => import("./mode/ClassicPlayground.vue"));
  } else {
    alert("No playground defined for gamemode " + store.gamemode);
    return "div";
  }
})

</script>
<template>
<component :is="playgroundComponent" />
</template>
<style>

</style>
