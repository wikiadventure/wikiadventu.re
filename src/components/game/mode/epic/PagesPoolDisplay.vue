<script lang="ts" setup>
import { useEpicGameStore } from '../../../../stores/mode/epic/useEpic';

const { current_pages_pool } = useEpicGameStore();

</script>
<template>
<div class="pages-pool-display">
    <span v-for="page in current_pages_pool">{{ page.title }}</span>
</div>
</template>
<style>
.pages-pool-display {
    display: flex;
}
</style>
