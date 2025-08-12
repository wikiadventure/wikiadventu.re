<script lang="ts" setup>
import preview from "./WikiPreview.vue";
import { loadSuggestions, type WikiContentPreview } from "../../composables/useWiki";
import { ref, useTemplateRef, watch } from 'vue';
import { watchDebounced } from '@vueuse/core'
import type { LangCode } from "../../i18n/lang";

const props = defineProps<{
    wikiLang: LangCode,
    placeholder: string
}>()

const emit = defineEmits(['update:wikiContentPreview']);

const wikiContentPreview = defineModel<WikiContentPreview | null>({required: true});

const input = ref("");

const suggestions = ref<WikiContentPreview[]>([]);

const container = useTemplateRef<HTMLDivElement>('container');

watchDebounced(input, async t => {
    const s = await loadSuggestions(t, props.wikiLang);
    s != null && (suggestions.value = s);
}, { debounce: 250 });

watch(() => props.wikiLang, (_newValue, _oldValue) => {
    suggestions.value = [];
});

function handleSelect(w: WikiContentPreview) {
    console.log(w);
    wikiContentPreview.value = w;
    console.log(wikiContentPreview.value);
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

function handleArrowNav(e: KeyboardEvent) {
    console.log(e);
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    if (container.value == null) return;
    e.preventDefault();
    // The input and all the suggestion items are focusable.
    const focusableItems = Array.from(
        container.value.querySelectorAll<HTMLElement>('input, [wiki-title-suggest] [tabindex="0"]')
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
    } else {
        (document.activeElement as HTMLElement)?.blur();
    }
}

</script>
<template>
    <div class="wiki-title-input" ref="container" @keyup="handleArrowNav">
        <input v-model="input" name="vote-input" :placeholder="props.placeholder" autocomplete="off" >
        <div wiki-title-suggest>
            <preview    v-for="s in suggestions" :wiki-content-preview="s" :key="s.id"
                        @keypress.enter="handleSelect(s);" @click.stop="handleSelect(s);" 
                        disable-goto-wiki accesskey="enter" />
        </div>
        <preview :disableGotoWiki="true" :wiki-content-preview="wikiContentPreview" :key="wikiContentPreview?.id" tabindex="-1"/>
    </div>
</template>
<style >
body[theme^="dark"] {
  .wiki-title-input {
    --border-color: #eee;
    --suggestion-focus-mix-color: #fff5;
  }
}

body[theme^="light"] {
  .wiki-title-input {
    --border-color: #111;
    --suggestion-mix-color: transparent;
  }
}

.wiki-title-input {
    --border: 1px solid var(--border-color);
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
        background: var(--back-color);
        color: var(--front-color);
        text-overflow: ellipsis;
        &:is(:focus, :focus-visible) {
            outline: 2 solid cyan;
            /* outline: var(--border); */
            outline-offset: 1px;
            border: var(--border-focus);
        }
    }
    > [wiki-preview] {
        background:  var(--back-color);
    }
    &:focus-within [wiki-title-suggest] {
        display: flex;
    }
    &:has( > [wiki-preview]:is(:focus, :focus-visible)) [wiki-title-suggest] {
        display: none;
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
        background: color-mix(in srgb, var(--back-color) 50%, transparent);
        [wiki-preview] {
            border-bottom: var(--border);
            cursor: pointer;
            &:last-child {
                border-bottom: none;
                border-radius: 0 0 10px 10px;
            }
            &:is(:hover, :focus, :focus-visible) {
                background: color-mix(in srgb, var(--back-color) 80%, var(--suggestion-focus-mix-color));
            }
            &:is(:focus, :focus-visible) {
                outline: 2px solid cyan;
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
