<script lang="ts" setup>
import ControlIcon from '~icons/material-symbols/tv-options-input-settings'
import PlaygroundIcon from '~icons/solar/gamepad-bold';
import EndIcon from '~icons/material-symbols-light/sports-score-rounded';

function scrollToId(id:string) {
    document.getElementById(id)?.scrollIntoView({behavior:'instant'});
}
</script>
<template>
<nav class="desktop-nav">
    <ul>
        <li>
            <button @click="scrollToId('control-area')">
                <ControlIcon/>
                <span>Menu</span>
            </button>
        </li>
        <li>
            <button @click="scrollToId('play-area')">
                <PlaygroundIcon/>
                <span>Wiki playground</span>
            </button>
        </li>
        <li>
            <button @click="scrollToId('end-page-area')">
                <EndIcon/>
                <span>Wiki end page</span>
            </button>
        </li>
    </ul>
</nav>
</template>
<style>
.desktop-nav {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    min-width: 20ch;
    max-width: 85vw;
    min-height: 1.5lh;

    &:after {
        content: "";
        position: absolute;
        border: 2px solid var(--front-color);
        border-radius: 0 0 30px 30px;
        height: 0;
        width: 50%;
        z-index: -1;
        margin: -1.56lh 25% 0 25%;
    }

    > ul {
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
        overflow: hidden;
        top: -3lh;
        transition: linear .2s top;
        display: flex;
        border-radius: 0 0 10px 10px;
        border: 1px solid grey;
        > li {
            flex: 1 1 max-content;
        }
        > li:not(:first-child) {
            border-left: 1px solid grey;
        }
        button {
            border: none;
            background: var(--back-color);
            color: var(--front-color);
            width: 100%;
            height: 100%;
            padding: 5px;
        }
        svg {
            vertical-align: middle;
        }

    }
    &:hover > ul {
        top: 0;

    }
}
@media screen and (width < 750px) {
    .desktop-nav {
        span {
            display: none;
        }
    }
}
</style>
