<script lang="ts" setup>
import GameButton from '../../GameButton.vue';
import PlayIcon from '~icons/material-symbols/play-arrow';
import VoteIcon from '~icons/material-symbols/how-to-vote'
import { useEpicGameStore } from '../../../../stores/mode/epic/useEpic';

const { isHost, current_phase, store, start, startWithVote } = useEpicGameStore();

</script>
<template>
<GameButton v-if="current_phase.type == 'Waiting'" :disabled="!isHost" 
    @click.prevent="start" class="start-button"
    :title="isHost ? 'As host you can start the round' : 'Only host can start the round'"
>
    <template v-if="store.gamedata.wiki_page_pick_mode == 'random'">
        Start playing with random wiki page <PlayIcon/>
    </template>
    <template v-else>
        Start voting for wiki page <VoteIcon/>
    </template>

</GameButton>
<GameButton v-else-if="current_phase.type == 'Voting'" :disabled="!isHost" 
    @click.prevent="startWithVote" class="start-button"
    :title="isHost ? 'As host you can start the round' : 'Only host can start the round'"
>
    Start immediately with current vote <PlayIcon/>
</GameButton>
</template>
<style>

</style>
