<script lang="ts" setup>
import { useClassicGameStore } from '../../../../stores/mode/classic/useClassic';
import GameButton from '../../GameButton.vue';

const { isHost, current_phase, store, start, startWithVote } = useClassicGameStore();

</script>
<template>
<GameButton v-if="current_phase.type == 'Waiting'" :disabled="!isHost" 
    @click.prevent="start" class="start-button"
    :title="isHost ? 'As host you can start the round' : 'Only host can start the round'"
>
    {{ store.gamedata.wiki_page_pick_mode == "random" ? "Start playing with random wiki page" : "Start voting for wiki page" }}
</GameButton>
<GameButton v-else-if="current_phase.type == 'Voting'" :disabled="!isHost" 
    @click.prevent="startWithVote" class="start-button"
    :title="isHost ? 'As host you can start the round' : 'Only host can start the round'"
>
    Start immediately with current vote
</GameButton>
</template>
<style>

</style>
