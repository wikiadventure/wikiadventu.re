<script lang="ts" setup>
import { player_id } from '../../stores/form';
import { useGameStore } from '../../stores/useGameStore';

const { store } = useGameStore();
</script>
<template>
<pre class="DEBUG">
player id : {{ player_id }}
Store:
{{ JSON.stringify(store, null, 2) }}
</pre>
</template>
<style>
.DEBUG {
    max-width: 100%;
    text-align: start;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
}
</style>
