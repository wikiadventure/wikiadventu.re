<script lang="ts" setup>
import {
    SelectRoot,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectPortal
} from "reka-ui";
import { theme } from "../composables/useTheme";
import IconDark  from "~icons/material-symbols/dark-mode-outline-rounded";
import IconLight from "~icons/material-symbols/light-mode-rounded";
import IconOs    from "~icons/material-symbols/settings-night-sight-outline-rounded";

</script>
<template>
<select-root v-model="theme">
    <select-trigger class="theme-picker select">
        <select-value>
            <IconLight v-if="theme == 'light'"/>
            <IconDark  v-if="theme == 'dark'"/>
            <IconOs    v-if="theme == 'os'"/>
        </select-value>
    </select-trigger>

    <select-portal>
        <select-content align="end" position="popper" class="theme-picker pop-up">
            <select-item value="light"><IconLight/> <span>light</span> </select-item>
            <select-item value="dark"> <IconDark/>  <span>dark</span>  </select-item>
            <select-item value="os">   <IconOs/>    <span>system</span></select-item>
        </select-content>
    </select-portal>
</select-root>
</template>
<style>
.theme-picker.select {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 15px;
    /* min-width: 5ch; */
    min-height: 3rem;
    border-radius: 5px;
    border: 1px solid var(--front-color);
    background: var(--back-color);
    color: var(--front-color);
    > svg {
        display: none;
    }
    > span {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1ch;
        > svg {
            color: currentColor;
        }
        > span {
            display: none;
        }
    }
}

.theme-picker.pop-up {
    z-index: 3;
    background: var(--back-color);
    color: var(--front-color);
    border-radius: 0 0 5px 5px;
    box-shadow: var(--box-shadow);
    border: 1px solid var(--front-color);
    div[role="option"] {
        display: flex;
        padding: 15px;
        gap: 1ch;
        cursor: pointer;
        &:not(:last-child) {
            border: 1px solid #8884;
        }
        &:is(:focus, :focus-visible, [data-highlighted]) {
            /* background: var(--back-focus-color);
            border: 2px solid cyan; */
            &[data-state="checked"] {
                /* background: hsl(210, 50%, 87%); */
            }
        }
        > span {
            display: flex;
            gap: 1ch;
        }
        &[data-state="checked"] {
            color: #1976d2;
        }
    }
}
</style>
