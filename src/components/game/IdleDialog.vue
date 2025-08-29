<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import { useIdle, useTimestamp } from '@vueuse/core';
import { idleDisconnected, inGame } from '../../stores/form';

const { disconnect } = useGameStore();

const { idle: idle5 } = useIdle(5*60*1000);
const { idle: idle7_50, lastActive } = useIdle(7.5*60*1000);

watch(idle7_50, (newValue) => {
    if (!newValue) return;
    disconnect();
    idleDisconnected.value = true;
    inGame.value = false;
});

const t = useTimestamp();
const idleSinceInSeconds = computed(() => {
    const idleSince = t.value - lastActive.value;
    return Math.floor(idleSince / 1000);
});

const minutes = computed(() => Math.floor(idleSinceInSeconds.value / 60));
const seconds = computed(() => idleSinceInSeconds.value % 60);
</script>

<template>
<dialog class="idle-dialog" v-if="idle5" :open="idle5">
    <section>
        <div>You've been idle for 5min.</div>
        <div>You will be disconnected at 7min30 of idle.</div>
        <div>Idle since {{ minutes }}min{{ seconds }}.</div>
    </section>
</dialog>
</template>

<style>
.idle-dialog {
    position: absolute;
    z-index: 1000;
    inset: 0;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    min-width: 100vw;
    place-items: center;
    background: #0000;
    backdrop-filter: blur(2px) brightness(.75);
    &[open] {
        display: grid;
    }
    > section {
        background: var(--back-color);
        color: var(--front-color);
        font-size: 2em;
        text-align: center;
        border-radius: 10px;
        padding: 30px;
        border: 2px solid var(--front-color);
    }
}
</style>
