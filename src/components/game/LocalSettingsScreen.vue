<script lang="ts" setup>
import { useLocalSetting } from '../../composables/useLocalSetting';
import SafemodeInterrupt from './safemode/SafemodeInterrupt.vue';
import { useSafemode } from './safemode/useSafemode';
import "./safemode/safemode.css";
import { computed, watch } from 'vue';

const open = defineModel<boolean>({ required: true });

const { SharpEdgeBlurFilter, safemodeActiveState, safemodeActive } = useSafemode();

const { safemode } = useLocalSetting();

watch(safemodeActiveState, () => {
    console.log({
        safemode: safemode.value,
        safemodeActive: safemodeActive.value,
        safemodeActiveState: safemodeActiveState.value,
    })
})

const safemodeInverted = computed({
  get: () => !safemode.value,
  set: (value:boolean) => safemode.value = !value
});

</script>
<template>
<dialog :open="open" class="local-settings-screen">
    <SharpEdgeBlurFilter/>
    <button @click="open = false">x</button>
    <h2>Settings</h2>
    <fieldset class="safemode-setting-container" :safemode="safemodeActiveState">
        <legend>Safemode</legend>
        <div>
            <SafemodeInterrupt v-model="safemodeInverted"/>
            <img src="/favicon.svg" alt="Wiki Adventure icon to demonstrate the blur">
            <span v-if="!safemode">Toggle to blur Wikipedia image.</span>
            <span v-else>Toggle to disable blur on Wikipedia image.</span>
            <span>Can be interrupted on each wikipedia page.</span>
            <span>Usefull if you stream on twitch.</span>
        </div>

    </fieldset>
</dialog>
</template>
<style>
.local-settings-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    isolation: isolate;
    inset: 0;
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 10px;
    background: var(--back-color);
    color: var(--front-color);
    border: none;
    > button {
        position: fixed;
        top: 15px;
        right: 25px;
        border-radius: 50px;
        &:hover {
            cursor: pointer;
        }
    }
    .safemode-setting-container {
        width: fit-content;
        border-radius: 10px;
        > div {
            display: flex;
            flex-wrap: wrap;
            gap: 2ch;
            align-items: center;
        }
    }
}
</style>
