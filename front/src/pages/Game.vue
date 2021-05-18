<template>
    <component :is="gameMode"/>
</template>
<style>
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { GameLoopType } from 'src/store/gameData/type/gameLoop';

export default defineComponent({
  name: 'Game',
  components: {
    'Classic': () => import('./gameMode/Classic.vue'),
    'Random': () => import('./gameMode/Random.vue'),
  },
  computed: {
    gameMode() {
        return GameLoopType[this.$store.state.gameData.gameLoop];
    }
  }
})
</script>
