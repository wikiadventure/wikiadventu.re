<script lang="ts" setup>
import { useGameStore } from '../../stores/useGameStore';

const { store } = useGameStore();
</script>
<template>
<div class="round-win">
    <span>{{ store.gamedata.round_data[store.gamedata.round.current].winner ?? "No winner for this round" }}</span>
</div>
</template>
<style>
.round-win {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: #000;
    > span {
        color: #b2ffff;
        font-size: 3rem;
        font-weight: bolder;
        filter: drop-shadow(0 0 5px cyan);
    }
}
</style>
