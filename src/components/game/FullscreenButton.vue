<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import GameButton from './GameButton.vue';
import EnterFullScreenIcon from '~icons/material-symbols/fullscreen';
import ExitFullScreenIcon from '~icons/material-symbols/fullscreen-exit'

const { isFullscreen, toggle } = useFullscreen();

</script>
<template>
<GameButton v-on:click="toggle" class="fullscreen-button">
   <template v-if="isFullscreen">
      Exit fullscreen <ExitFullScreenIcon/>
   </template>
   <template v-else>
      Enter fullscreen <EnterFullScreenIcon/>
   </template>
</GameButton>
</template>
<style>

</style>
