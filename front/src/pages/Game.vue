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
import { chatReset } from 'store/chat/state';
import { gameLayoutManagerReset } from 'store/gameLayoutManager/state';
import { lobbyReset } from 'store/lobby/state';
import { playerReset } from 'store/player/state';
import { voteReset } from 'store/vote/state';

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
    chatReset();
    gameLayoutManagerReset();
    lobbyReset();
    playerReset();
    voteReset();
    const { t } = useI18n({ useScope: 'global' });
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
