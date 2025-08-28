<script lang="ts" setup>
import { endonym_to_langcode } from '../../composables/wikiLang';
import { useGameStore } from '../../stores/useGameStore';

const { store, isHost } = useGameStore();


</script>
<template>
<select class="wiki-lang-select" v-model="store.gamedata.wiki_lang" :disabled="!isHost">
    <option v-for="[langcode, label] in Object.entries(endonym_to_langcode)" :value="langcode">{{ label }}</option>
</select>
</template>
<style>
body[theme^="dark"] {
  --wiki-lang-select-color1: lch(90.5% 55.25 181.75);
  --wiki-lang-select-color2: lch(50% 55.25 181.75);
  --wiki-lang-select-color3: lch(20% 55.25 181.75);
  --wiki-lang-select-color4: lch(10% 55.25 181.75);
}

body[theme^="light"] {
  --wiki-lang-select-color1: lch(10% 55.25 181.75);
  --wiki-lang-select-color2: #000;
  --wiki-lang-select-color3: lch(44.59% 42.08 159.8);
  --wiki-lang-select-color4: #fff;
}

.wiki-lang-select {
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid var(--wiki-lang-select-color2);
    background: var(--wiki-lang-select-color4);
    color: var(--wiki-lang-select-color1);
    /* can't customize color of select drop in firefox */
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: var(--wiki-lang-select-color2);
        border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
        background-color: var(--wiki-lang-select-color3);
    }
    &:is(:focus, :focus-visible) {
        outline: 2px solid var(--wiki-lang-select-color1);
    }
}
</style>
