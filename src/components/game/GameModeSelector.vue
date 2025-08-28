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
body[theme^="dark"] {
  --gamemode-select-color1: lch(90.5% 55.25 181.75);
  --gamemode-select-color2: lch(50% 55.25 181.75);
  --gamemode-select-color3: lch(20% 55.25 181.75);
  --gamemode-select-color4: lch(10% 55.25 181.75);
}

body[theme^="light"] {
  --gamemode-select-color1: lch(10% 55.25 181.75);
  --gamemode-select-color2: #000;
  --gamemode-select-color3: lch(44.59% 42.08 159.8);
  --gamemode-select-color4: #fff;
}
.gamemode-select {
    min-width: 20ch;
    max-width: 90ch;
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid var(--gamemode-select-color2);
    background: var(--gamemode-select-color4);
    color: var(--gamemode-select-color1);
    /* can't customize color of select drop in firefox */
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: var(--gamemode-select-color2);
        border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
        background-color: var(--gamemode-select-color3);
    }
    &:is(:focus, :focus-visible) {
        outline: 2px solid var(--gamemode-select-color1);
    }
}
</style>
