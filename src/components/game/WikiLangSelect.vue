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

</style>
