<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import GameButton from './GameButton.vue';

const { isFullscreen, toggle } = useFullscreen();

</script>
<template>
<GameButton v-on:click="toggle" class="restart-button">
   <span v-if="isFullscreen">Exit fullscreen</span>
   <span v-else>Enter fullscreen</span>
</GameButton>
</template>
<style>

</style>
