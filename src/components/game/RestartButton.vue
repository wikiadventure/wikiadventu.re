<script lang="ts" setup>
import { ref, toRaw } from 'vue';
import type { Gamemode } from '../../stores/game';
import { classic_initial_gamedata } from '../../stores/mode/classic/initialGamedata';
import { useGameStore } from '../../stores/useGameStore';
import GameButton from './GameButton.vue';
import RestartIcon from '~icons/codicon/debug-restart';
import { epic_initial_gamedata } from '../../stores/mode/epic/initialGamedata';

const props = defineProps<{
    withGamemode: Gamemode
}>();

const { isHost, store, wipeYjsDoc } = useGameStore();

const confirmOpen = ref(false);

async function restart(_e:Event) {
    const { gamedata, ...old_store } = toRaw(store);
    const gamemode = props.withGamemode;
    const old_store_clone = structuredClone(old_store);
    
    await wipeYjsDoc();
    const newStoreData = {
        creation_timestamp: old_store_clone.creation_timestamp,
        host_id: old_store_clone.host_id,
        version: old_store_clone.version,
        players: old_store_clone.players,
        gamemode: gamemode,
        gamedata: {}
    };
    if (gamemode == "Classic") {
        newStoreData.gamedata = classic_initial_gamedata();
    } else if (gamemode == "Epic") {
        newStoreData.gamedata = epic_initial_gamedata();
    }
    Object.assign(store, newStoreData);
    confirmOpen.value = false;
}

console.log(confirmOpen);

</script>
<template>
<GameButton :disabled="!isHost" 
    @click="confirmOpen = true" class="restart-button"
    :title="isHost ? 'As host you can restart the game' : 'Only host can restart the game'"
>
    Restart
    <RestartIcon/>
</GameButton>
<dialog class="restart-button-dialog" :open="confirmOpen">
    <span>Are you sure you want to restart with gamemode {{ props.withGamemode }}</span>
    <button @click="restart">yes</button>
    <button @click="confirmOpen = false" >no</button>
</dialog>
</template>
<style>
.restart-button {
    /* position: relative; */

}
.restart-button-dialog {
    gap: 1ch;
    flex-wrap: wrap;
    background: var(--back-color);
    color: var(--front-color);
    filter: drop-shadow(0 0 15px var(--front-color));
    border-radius: 10px;
    position: absolute;
    /* isolation: isolate; */
    z-index: 10;
    &[open] {
        display: flex;
    }
}
</style>
