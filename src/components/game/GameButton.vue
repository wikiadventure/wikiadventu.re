<script lang="ts" setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
</script>
<template>
<button class="game-button" v-bind="attrs">
    <span>
        <slot></slot>
    </span>
</button>
</template>
<style>
.game-button {
    --border: 3px solid var(--front-color);
    color: var(--front-color);
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
        filter: drop-shadow(0 0 8px cyan);
    }
    > span {
        padding: 10px 20px;
        background: var(--back-color);
        border-radius: 8px;
        display: block;
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
    &:is(:focus, :focus-visible) {
     outline: none;
     --border: 3px solid cyan;
    }
    &::before {
        content: "";
        position: absolute;
        z-index: -1;
        inset: 0;
        transform: translateY(10px);
        border-radius: 8px;
        border: var(--border);
        background: var(--back-color);
        filter: brightness(0.9);
    }
}
</style>
