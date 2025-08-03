<script lang="ts" setup>
import type { Gamemode } from '../../stores/game';
import { classic_initial_gamedata } from '../../stores/mode/classic/initialGamedata';
import { useGameStore } from '../../stores/useGameStore';

const props = defineProps<{
    withGamemode: Gamemode
}>();

const { isHost, store } = useGameStore();

async function restart(_e:Event) {
    if (props.withGamemode == "Classic") {
        store.gamedata = classic_initial_gamedata();
    }
}


</script>
<template>
<button :disabled="!isHost" 
    v-on:click="restart" class="restart-button"
    :title="isHost ? 'As host you can restart the game' : 'Only host can restart the game'"
>
    <span>Restart</span>
    <!-- TODO: add confirmation dialog -->
</button>
</template>
<style>
.restart-button {
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
