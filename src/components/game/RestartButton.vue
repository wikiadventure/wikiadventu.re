<script lang="ts" setup>
import type { Gamemode } from '../../stores/game';
import { classic_initial_gamedata } from '../../stores/mode/classic/initialGamedata';
import { useGameStore } from '../../stores/useGameStore';
import GameButton from './GameButton.vue';

const props = defineProps<{
    withGamemode: Gamemode
}>();

const { isHost, store, wipeYjsDoc } = useGameStore();

async function restart(_e:Event) {
    if (props.withGamemode == "Classic") {
        console.log("START WIPE");
        await wipeYjsDoc();
        console.log("COMPLETE WIPE");
        store.gamedata = classic_initial_gamedata();
    }
}


</script>
<template>
<GameButton :disabled="!isHost" 
    v-on:click="restart" class="restart-button"
    :title="isHost ? 'As host you can restart the game' : 'Only host can restart the game'"
>
   Restart
    <!-- TODO: add confirmation dialog -->
</GameButton>
</template>
<style>

</style>
