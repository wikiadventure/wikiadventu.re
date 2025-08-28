<script setup lang="ts">
import { ref, onMounted, watch, computed, useTemplateRef, onUnmounted, toRef } from "vue";
import { ShadowRoot } from "vue-shadow-dom";
import WikiPageContent from "./wikiPageContent";
import type { LangCode } from "../../i18n/lang";
import { isMobile } from "../../composables/useTheme";
import SafemodeInterrupt from "../game/safemode/SafemodeInterrupt.vue";
import { useSafemode } from "../game/safemode/useSafemode.tsx";
import { useWikiStyleSheets } from "./useWikiPage.ts";
import { computedAsync } from "@vueuse/core";
// import { useThemeStore } from "@/composables/useTheme";

export type LinkClickContext = {
    anchorElement:HTMLAnchorElement,
    currentPageTitle:string,
    currentWikiLang:LangCode,
}

const currentPageIsMobile = ref(isMobile.value);

const props = defineProps<{
    disable: boolean;
    title: string;
    wikiPageTitle: string;
    anchor:null | string;
    wikiLang: LangCode,
    onLinkClick?: (url:string, ctx:LinkClickContext) => void
}>();

const emit = defineEmits<{
    (e: 'wikiLink', value: [title:string, id:number]): void
}>();

const wikiRef = useTemplateRef<HTMLDivElement | null>("wikiRef");
const shadowRootRef = useTemplateRef<InstanceType<typeof ShadowRoot> | null>("shadowRootRef");
const wikiPage = ref(new WikiPageContent());
const loading = ref(false);

const wikiLangRef = toRef(props, 'wikiLang');

const { wikiStyleSheets, wikiHtmlClasses } = useWikiStyleSheets(wikiLangRef, currentPageIsMobile);

const {
    safemodeInterrupted, safemodeActiveState,
    SharpEdgeBlurFilter, safemodeStyleSheet
} = useSafemode();

const shadowRootStyleSheets = computedAsync(async () => {
    const [wikiSheets, safemodeSheets] = await Promise.all([wikiStyleSheets.value,safemodeStyleSheet]);
    return wikiSheets.concat(safemodeSheets);
}, []);

let isRequestingWikiPage = false;


const requestWikiPage = async (pageTitle: string) => {
    if (isRequestingWikiPage) return;
    isRequestingWikiPage = true;
    loading.value = true;
    safemodeInterrupted.value = false;

    try {
        await fetchArticle(pageTitle, wikiLangRef.value);
        currentPageIsMobile.value = wikiPage.value.isMobile;
        isRequestingWikiPage = false;
        wikiPage.value = Object.assign(new WikiPageContent(), wikiPage.value);
        emit('wikiLink', [wikiPage.value.parsedTitle, wikiPage.value.pageid]);
        setTimeout(() => {
            if (props.anchor == null) (shadowRootRef.value?.$el as HTMLDivElement).parentElement?.scrollTo({top: 0, left: 0, behavior: "instant"});
            else scrollToAnchor(props.anchor);
            loading.value = false;
        }, 25);
    } catch (error) {
        console.error(error);
        loading.value = false;
        isRequestingWikiPage  = false;
    }
};

const onLinkClick = (link: HTMLAnchorElement) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;

    if (!props.disable && link.classList.contains("wikiLink")) {
        const url = linkHref.substring(6);
        const doc = wikiRef.value;
        doc?.setAttribute("data-has-been-redirected", "false");
        props.onLinkClick?.(url, {
            anchorElement: link,
            currentPageTitle: wikiPage.value.parsedTitle,
            currentWikiLang: wikiPage.value.lang,
        });
        

    } else if (linkHref.startsWith("#")) {
        scrollToAnchor(decodeURI(linkHref.substring(1)));
    }
};

const fetchArticle = async (title: string, wikiLang:LangCode) => {
    return await wikiPage.value.fetch(title, wikiLang, isMobile.value);
};

const scrollToAnchor = (id: string) => {
    if (wikiRef.value) {
        scrollToID(id, wikiRef.value);
    }
};

const scrollToID = (id: string, scrollContainer?: HTMLElement | Document | ShadowRoot) => {
    if (!scrollContainer) scrollContainer = document;
    const element = scrollContainer.querySelector(`#${id}`);
    if (element) element.scrollIntoView();
};

function redirectLinks() {
    const doc = wikiRef.value;
    if (doc == null) return;
    if (doc.childNodes.length == 0) {
        setTimeout(redirectLinks, 0); // Retry after a short delay
        return;
    }
    if (doc.getAttribute("data-has-been-redirected") == "true") return;
    doc.setAttribute("data-has-been-redirected", "true");
    
    const links = doc.querySelectorAll("a, area");
    links.forEach((link) => {
        const href = link.getAttribute("href");
        const classes = link.classList;
        if (!href) return;

        if (href.startsWith("#")) {
            classes.add("anchorLink");
        } else if (href.startsWith("/wiki/")) {
            if (href.includes(":")) {
                const sub = href.substring(6);
                const decoded = decodeURI(sub).replace(/_/g, " ");
                if (wikiPage.value.links.find((l) => l.title === decoded && l.ns === 0)) {
                    classes.add("wikiLink");
                } else {
                    classes.add("portalLink");
                }
            } else {
                classes.add("wikiLink");
            }
        } else {
            classes.add("notWikiLink");
        }
    });
}

function handleClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest("a, area") as HTMLAnchorElement | null;
    if (target) {
        e.preventDefault();
        e.stopPropagation();
        onLinkClick(target as HTMLAnchorElement);
    }
};

onMounted(() => {
    const doc = wikiRef.value!;
    doc?.addEventListener("click", handleClick);
    const observer = new MutationObserver(() => {
        redirectLinks();
    });
    
    observer.observe(doc, { childList: true, subtree: true });
});

onUnmounted(() => {
    const doc = wikiRef.value;
    doc?.removeEventListener("click", handleClick);
})

const wikiPageHtml = computed(() => wikiPage.value.doc?.body.firstElementChild?.innerHTML ?? "");


requestWikiPage(props.wikiPageTitle);
watch(() => props.wikiPageTitle, (_newValue, _oldValue) => {
  requestWikiPage(props.wikiPageTitle);
  // Perform actions here when the prop changes
});


</script>
<template>
<h1 class="wiki-title" style="text-align: center">{{ title }}</h1>
<SafemodeInterrupt v-model="safemodeInterrupted"/>
<h2 class="wiki-title">{{ wikiPage.parsedTitle }}</h2>
<ShadowRoot class="wiki-page" ref="shadowRootRef" :adopted-style-sheets="shadowRootStyleSheets">
    <SharpEdgeBlurFilter/>
    <div data-is-html :data-is-mobile="isMobile ? true : undefined"  
            :safemode="safemodeActiveState" role="article"
            :class="[...wikiHtmlClasses, 'wiki-page']" ref="wikiRef">
        <div data-is-body :class="['content', { disable: disable }]">
            <div class="mw-parser-output" v-html="wikiPageHtml">
            </div>    
        </div>
    </div>
</ShadowRoot>
</template>
<style>
.wiki-title {
    padding: 10px;
}
</style>
