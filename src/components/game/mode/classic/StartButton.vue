<script lang="ts" setup>
import { getRandomPage } from '../../../../composables/useWiki';
import { useGameStore } from '../../../../stores/useGameStore';

const { isHost, current_phase, store, current_round } = useGameStore();

async function start(e:Event) {
    e.preventDefault();
    // store.gamedata.round.current++;
    const timestamp = Date.now();
    if (store.gamedata.wiki_page_pick_mode == "vote") {
        store.gamedata.gamephase[timestamp] = {
            duration: store.gamedata.votephase_duration,
            round: store.gamedata.round.current,
            type: "Voting"
        }
        return;
    }
    const [ start, end ] = await getRandomPage(store.gamedata.wiki_lang, 2);
    current_round.value = {
        wiki_lang: store.gamedata.wiki_lang,
        start,
        end
    }
    for (const player of Object.values(store.players)) {
        store.gamedata.player_data[player.id] ??= {};
        store.gamedata.player_data[player.id][store.gamedata.round.current] ??= { score: 0 , page_vote: null, history: {} };
        store.gamedata.player_data[player.id][store.gamedata.round.current].history[timestamp] = {
            id: start.id,
            title: start.title,
        }
    }
    store.gamedata.gamephase[timestamp] = {
        duration: store.gamedata.playphase_duration,
        round: store.gamedata.round.current,
        type: "Playing"
    }
}


</script>
<template>
<button v-if="current_phase.type == 'Waiting'" :disabled="!isHost" 
    v-on:click="start" class="start-button"
    :title="isHost ? 'As host you can start the round' : 'Only host can start the round'"
>
    <span>Start</span>
</button>
</template>
<style>
.start-button {
    --border: 3px solid #000;
    padding: 0;
    font-size: 1.5em;
    height: calc(1lh + 20px);
    justify-self: center;
    position: relative;
    border-radius: 8px;
    background: transparent;
    border: none;
    > span {
        padding: 10px 20px;
        background: #eee;
        border-radius: 8px;
        border: var(--border);
    }
    &:active {
        transform: translateY(10px);
        &::before {
            transform: translateY(0);
        }
    }
    &:hover > span {
        filter: brightness(1.1);
    }
    &::before {
        content: "";
        position: absolute;
        z-index: -1;
        inset: 0;
        transform: translateY(10px);
        border-radius: 8px;
        border: var(--border);
        background: #ddd;
    }
}
</style>
