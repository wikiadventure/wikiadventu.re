<script lang="ts" setup>
import { player_id } from '../../stores/form';
import { useGameStore } from '../../stores/useGameStore';

const { isHost, store } = useGameStore();
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
    text-align: start;
}
</style>
