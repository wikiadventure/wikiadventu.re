<script lang="ts" setup>
import { ref, type FunctionalComponent, type SVGAttributes } from 'vue';
import { all_gamemode, type Gamemode } from '../../stores/game';
import { useGameStore } from '../../stores/useGameStore';
import MdiWikipedia from '~icons/mdi/wikipedia';
import MaterialSymbolsFormatListNumbered from '~icons/material-symbols/format-list-numbered'

const gamemodeIcons:Record<Gamemode, FunctionalComponent<SVGAttributes, {}, any, {}>> = {
    Classic: MdiWikipedia,
    Epic: MaterialSymbolsFormatListNumbered,
}

const gamemodeDescriptions:Record<Gamemode, string> = {
    Classic: "Classic experience where each player compete to find a target wiki page first by following wiki link.",
    Epic: "An epic journey where you must find wiki page from a list of them in order (or not).",
}

const gamemode = defineModel<Gamemode>({ required: true });

const isOpen = ref(false);

function toggleOpen() {
    isOpen.value = !isOpen.value;
}

function handleKeydown() {

}

const { isHost } = useGameStore();
</script>
<template>
    <button
        class="gamemode-select"
        :aria-haspopup="true" :aria-expanded="isOpen"
        @click.stop="toggleOpen" @keydown="handleKeydown"
    >
        {{ gamemode }}
    </button>
    <dialog
        class="gamemode-select" :open="isOpen"
    >
        <button @click="isOpen = false">X</button>
        <div>
            <label v-for="mode in all_gamemode" :is-selected="gamemode == mode" @click="gamemode = mode" @dblclick="isOpen = false">
                <input type="radio" name="gamemode-select-choice" :value="mode">
                <span>{{ mode }}</span>
                <component :is="gamemodeIcons[mode]"/>
                <p>{{ gamemodeDescriptions[mode] }}</p>
            </label>        
        </div>
    </dialog>
</template>
<style>
body[theme^="dark"] {
  --gamemode-select-color1: lch(90.5% 55.25 181.75);
  --gamemode-select-color2: lch(50% 55.25 181.75);
  --gamemode-select-color3: lch(20% 55.25 181.75);
  --gamemode-select-color4: lch(10% 55.25 181.75);
}

body[theme^="light"] {
  --gamemode-select-color1: lch(10% 55.25 181.75);
  --gamemode-select-color2: #000;
  --gamemode-select-color3: lch(44.59% 42.08 159.8);
  --gamemode-select-color4: #fff;
}
dialog.gamemode-select[open] {
    display: grid;
}
dialog.gamemode-select {
    position: absolute;
    place-items: center;
    top: 10px;
    width: calc(100vw - 30px);
    padding: 10px 20px;
    border-radius: 10px;
    margin: 0;
    border: 1px solid var(--gamemode-select-color2);
    background: var(--gamemode-select-color4);
    color: var(--gamemode-select-color1);
    /* can't customize color of select drop in firefox */
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: var(--gamemode-select-color2);
        border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
        background-color: var(--gamemode-select-color3);
    }
    &:is(:focus, :focus-visible) {
        outline: 2px solid var(--gamemode-select-color1);
    }
    > button {
        background: #0002;
        aspect-ratio: 1/1;
        border: 1px solid var(--gamemode-select-color2);
        padding: 5px;
        width: calc(10px + 2ch);
        height: calc(10px + 2ch);
        color: var(--gamemode-select-color1);
        border-radius: 20px;
    }
    > div {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 5px;
        gap: 10px;
        flex-wrap: wrap;
    }
    label[is-selected="true"] {
        border: 2px solid var(--gamemode-select-color1);
        outline: 2px solid var(--gamemode-select-color1);
    }
    label {
        background: #0001;
        border: 2px solid var(--gamemode-select-color2);
        border-radius: 10px;
        padding: 5px;
        display: flex;
        gap: 10px;
        flex-direction: column;
        flex: 0 1 40ch;
        max-width: 100%;
        > input {
            display: none;
        }
        > span {
            display: block;
            text-align: center;
            font-size: 1.5em;
            font-weight: bold;
        }
        > svg {
            font-size: 3em;
            align-self: center;
        }
        > p {
            text-align: center;
        }
    }
}

button.gamemode-select {
    min-width: 20ch;
    max-width: 90ch;
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid var(--gamemode-select-color2);
    background: var(--gamemode-select-color4);
    color: var(--gamemode-select-color1);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    
    &:is(:focus, :focus-visible) {
        outline: 2px solid var(--gamemode-select-color1);
    }
    &::after {
        content: "▼";
    }
}
</style>
