<template>
    <component :is="'Classic'"/>
</template>
<style>
</style>
<script lang="ts">
import { defineComponent, computed, defineAsyncComponent } from 'vue';
import { ModLoopType, VanillaLoopType } from 'store/lobby/game/loop/type';
import { gameLoop } from 'store/connect/state';
import { onBeforeRouteLeave } from "vue-router";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Game',
  components: {
    "Classic": defineAsyncComponent(() =>
      import('./gameMode/Classic.vue')
    ),
    "Random": defineAsyncComponent(() =>
      import('./gameMode/Random.vue')
    ),
  },
  setup() {
    const { t } = useI18n();
    var gameLoopName = computed(()=> VanillaLoopType[gameLoop.value] || ModLoopType[gameLoop.value] );

    onBeforeRouteLeave((to, from, next) => {
      const answer = window.confirm(t('exitWarn') as string);
      if (answer) {
        next();
      } else {
        next(false);
      }
    });

    return {
      gameLoopName
    };
  }
})
</script>
