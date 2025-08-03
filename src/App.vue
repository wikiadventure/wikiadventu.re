<script setup lang="ts">
import GameForm from './pages/gameForm.vue';
import Playground from './pages/Playground.vue';
import { inGame } from './stores/form';
</script>

<template>
<GameForm v-if="!inGame"/>
<Playground v-else/>
</template>

