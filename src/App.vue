<script setup lang="ts">
import GameForm from './pages/gameForm.vue';
import GamePlay from './pages/gamePlay.vue';
import { inGame } from './stores/form';
</script>

<template>
<GameForm v-if="!inGame"/>
<GamePlay v-else/>
</template>

