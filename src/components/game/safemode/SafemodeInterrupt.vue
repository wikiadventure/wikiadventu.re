<script lang="ts" setup>
import { useMagicKeys, whenever } from '@vueuse/core';
import { useAttrs } from 'vue';
import DeblurIcon from '~icons/material-symbols/deblur';
const model = defineModel<boolean>();

const rawAttrs = useAttrs();
const { class: _class, name, ...attrs } = rawAttrs;
const keys = useMagicKeys();
whenever(keys.Shift_Ctrl_X, () => model.value = !model.value);

</script>
<template>
<label :class="'safemode-interrupt ' + (_class??'')">
    <input type="checkbox" :name="(name as string) ?? 'safemode-interrupt'" v-bind="attrs" v-model="model">
    <DeblurIcon/>
</label>
</template>
<style>
.safemode-interrupt {
    --padding: 2px;
    --size: 4ch;
    justify-self: center;
    display: block;
    height: var(--size);
    width: calc(var(--size) * 2);
    position: relative;
    background: transparent;
    border: 2px solid greenyellow;
    border-radius: var(--size);
    padding: var(--padding);
    &:has(input:checked) {
        border-color: red;
    }

    > svg {
        position: absolute;
        left: var(--padding);
        margin: 0;
        padding: calc(var(--padding) * 2);
        height: calc(100% - var(--padding) * 2 );
        width: auto;
        aspect-ratio: 1;
        border-radius: var(--size);
        background: #000;
        color: greenyellow;
        transition: all linear .2s;
        filter: drop-shadow(0 0 10px greenyellow);
    }
    input:checked + svg {
        left: 100%;
        transform: translateX(calc(-100% - var(--padding)));
        color: red;
        filter: drop-shadow(0 0 10px red);
    }
    > input {
        display: none;
    }
}
</style>