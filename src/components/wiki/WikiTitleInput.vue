<script lang="ts" setup>
import preview from "./WikiPreview.vue";
import { loadSuggestions, type WikiContentPreview } from "../../composables/useWiki";
import { ref, useTemplateRef, watch } from 'vue';
import { useVModels, watchDebounced } from '@vueuse/core'
import type { LangCode } from "../../i18n/lang";

const props = defineProps<{
    wikiContentPreview: WikiContentPreview | null,
    wikiLang: LangCode
}>()

const emit = defineEmits(['update:wikiContentPreview']);

const { wikiContentPreview, wikiLang } = useVModels(props, emit);

const input = ref("");

const suggestions = ref<WikiContentPreview[]>([]);

const container = useTemplateRef<HTMLDivElement>('container');

watchDebounced(input, async t => {
    const s = await loadSuggestions(t, wikiLang.value);
    s != null && (suggestions.value = s);
}, { debounce: 250 });


function handleSelect(w: WikiContentPreview) {
    wikiContentPreview.value = w;
    input.value = w.title ?? "";
    if (container.value == null) return;
    // Find all focusable elements in the document
    const focusableElements = Array.from(
        document.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details, [tabindex]:not([tabindex="-1"])'
        )
    );

    // Find the last focusable element within this component
    const componentFocusableElements = Array.from(container.value.querySelectorAll<HTMLElement>('[tabindex="0"], input'));
    const lastComponentElement = componentFocusableElements[componentFocusableElements.length - 1];

    if (lastComponentElement) {
        const lastIndex = focusableElements.indexOf(lastComponentElement);
        // Focus the next element in the document
        if (lastIndex > -1 && lastIndex + 1 < focusableElements.length) {
            focusableElements[lastIndex + 1]?.focus();
        }
    }
}

function handleSuggestionClick(w: WikiContentPreview) {
    handleSelect(w);
}

function handleSuggestionKeyPress(e: KeyboardEvent, w: WikiContentPreview) {
    if (e.key === 'Enter') {
        handleSelect(w);
    }
}



function handleArrowNav(e: KeyboardEvent) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    if (container.value == null) return;

    // The input and all the suggestion items are focusable.
    const focusableItems = Array.from(
        container.value.querySelectorAll<HTMLElement>('input, .wiki-title-suggest [tabindex="0"]')
    );

    if (focusableItems.length <= 1) return; // No suggestions to navigate to

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = focusableItems.indexOf(activeElement);

    e.preventDefault(); // Prevent default scrolling or cursor movement

    let nextIndex = -1;

    if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % focusableItems.length;
    } else if (e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
    }

    if (nextIndex !== -1) {
        focusableItems[nextIndex]?.focus();
    }
}

</script>
<template>
    <div wiki-title-input ref="container">
        <input v-model="input">
        <div wiki-title-suggest>
            <preview    v-for="s in suggestions" :wiki-content-preview="s" :key="s.id"
                        @keypress.enter="handleSelect(s);" @click.stop="handleSelect(s);" 
                        disable-goto-wiki accesskey="enter" />
        </div>
        <preview :wiki-content-preview="wikiContentPreview" :key="wikiContentPreview?.id" tabindex="-1"/>
    </div>
</template>
<style >
[wiki-title-input] {
    --border: 1px solid rgba(var(--heat-rgb), .5);
    --border-focus: 1px solid var(--heat-color);
    width: 100%;
    position: relative;
    backdrop-filter: blur(3px);
    z-index: 2;
    > input {
        border: var(--border);
        width: 100%;
        height: 3em;
        font-size: 1.5em;
        text-align: center;
        background: #0002;
        color: #eee;
        text-overflow: ellipsis;
        &:is(:focus, :focus-visible) {
            outline: var(--border);
            outline-offset: 1px;
            border: var(--border-focus);
        }
    }
    > [wiki-preview] {
        background: #0002;
    }
    &:focus-within [wiki-title-suggest] {
        display: flex;
    }
    [wiki-title-suggest] {
        z-index: 2;
        position: absolute;
        display: none;
        flex-direction: column;
        width: 100%;
        border: var(--border);
        border-top: none;
        border-radius: 0 0 10px 10px;
        background: #000a;
        [wiki-preview] {
            border-bottom: var(--border);
            cursor: pointer;
            &:last-child {
                border-bottom: none;
                border-radius: 0 0 10px 10px;
            }
            &:hover {
                background: #000a;
            }
        }
    }
    > [wiki-preview] {
        border: var(--border);
        border-top: none;
        border-radius: 0 0 15px 15px;
    }
}


</style>
