<script lang="ts" setup>
import { all_wiki_page_pick_mode } from '../../stores/game';
import { useGameStore } from '../../stores/useGameStore';

const { isHost, store } = useGameStore();
</script>
<template>
<fieldset class="wiki-page-pick-mode-select">
    <legend>Wiki page selection :</legend>

    <label v-for="mode in all_wiki_page_pick_mode">
        <input type="radio" :name="mode" :value="mode" v-model="store.gamedata.wiki_page_pick_mode" :disabled="!isHost"/>
        {{  mode }}
    </label>
</fieldset>
</template>
<style>
.wiki-page-pick-mode-select {
    max-width: 75ch;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
}
</style>
