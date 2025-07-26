<script lang="ts" setup>
import { all_gamemode } from '../../stores/game';
import { useGameStore } from '../../stores/useGameStore';

const { isHost, store } = useGameStore();
</script>
<template>
    {{ isHost }}
    <select class="gamemode-select" name="gamemode" :disabled="isHost == false" v-model="store.gamemode">
        <option v-for="mode of all_gamemode" :value="mode">{{ mode }}</option>
    </select>
</template>
<style>
.gamemode-select {
    padding: 15px;
    &:disabled {
        color: red;
    }
}
</style>
