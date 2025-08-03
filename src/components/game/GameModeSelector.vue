<script lang="ts" setup>
import { all_gamemode, type Gamemode } from '../../stores/game';
import { useGameStore } from '../../stores/useGameStore';

const gamemode = defineModel<Gamemode>({ required: true });

const { isHost } = useGameStore();
</script>
<template>
    <select class="gamemode-select" name="gamemode" :disabled="isHost == false" v-model="gamemode">
        <option v-for="mode of all_gamemode" :value="mode">{{ mode }}</option>
    </select>
</template>
<style>
.gamemode-select {
    padding: 15px;
    min-width: 20ch;
    max-width: 90ch;
    &:disabled {
        color: red;
    }
}
</style>
