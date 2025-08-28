<script lang="ts" setup>
import { useAttrs } from 'vue';

const rawAttrs = useAttrs();
const { class: _drop, ...attrs } = rawAttrs; 
</script>
<template>
<button class="game-button" v-bind="attrs">
    <span>
        <slot></slot>
    </span>
</button>
</template>
<style>
body[theme^="dark"] {
  --game-button-color1: lch(90.5% 55.25 181.75);
  --game-button-color2: lch(50% 55.25 181.75);
  --game-button-color3: lch(20% 55.25 181.75);
  --game-button-color4: lch(10% 55.25 181.75);
}

body[theme^="light"] {
  --game-button-color1: lch(10% 55.25 181.75);
  --game-button-color2: #000;
  --game-button-color3: #fff;
  --game-button-color4: lch(44.59% 42.08 159.8);
}

.game-button {
    --border: 3px solid var(--game-button-color2);
    color: var(--game-button-color1);
    padding: 0;
    font-size: 1.5em;
    justify-self: center;
    position: relative;
    border-radius: 8px;
    background: transparent;
    border: none;
    margin-bottom: 10px;
    cursor: pointer;
    transition: filter ease-in-out .2s;
    &:hover {
        filter: drop-shadow(0 0 8px --game-button-color1) drop-shadow(0 0 16px --game-button-color2);
    }
    > span {
        padding: 10px 20px;
        background: var(--game-button-color3);
        border-radius: 8px;
        display: block;
        border: var(--border);
        > svg {
            vertical-align: middle;
        }
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
    &:is(:focus, :focus-visible) {
     outline: none;
     --border: 3px solid var(--game-button-color1);
    }
    &::before {
        content: "";
        position: absolute;
        z-index: -1;
        inset: 0;
        transform: translateY(10px);
        border-radius: 8px;
        border: var(--border);
        background: var(--game-button-color4);
        filter: brightness(0.9);
    }
}
</style>
