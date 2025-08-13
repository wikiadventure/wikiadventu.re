<script setup lang="ts">
import { ref, onMounted, watch, computed, useTemplateRef, onUnmounted } from "vue";
import { ShadowRoot } from "vue-shadow-dom";
import WikiPageContent from "./wikiPageContent";
import wikiPageCssString from "./wikiPage.css?inline";
import type { LangCode } from "../../i18n/lang";
import { theme } from "../../composables/useTheme";
// import { useThemeStore } from "@/composables/useTheme";

export type LinkClickContext = {
    anchorElement:HTMLAnchorElement,
    currentPageTitle:string,
    currentWikiLang:LangCode,
}

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
const styleSheets = ref<CSSStyleSheet[]>([]);
const isMobile = ref(window.innerWidth < 720);
const loading = ref(false);
const safeModeInterrupted = ref(false);

let isRequestingWikiPage = false;

let called = 0;

const requestWikiPage = async (pageTitle: string) => {
    if (isRequestingWikiPage) return;
    isRequestingWikiPage = true;
    loading.value = true;
    safeModeInterrupted.value = true;

    try {
        await fetchArticle(pageTitle, props.wikiLang);
        isRequestingWikiPage = false;
        wikiPage.value = Object.assign(new WikiPageContent(), wikiPage.value);
        emit('wikiLink', [wikiPage.value.parsedTitle, wikiPage.value.pageid]);
        called++;
        console.log(`${pageTitle} called ${called}`)
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



// watch(wikiPage, () => {
//     redirectLinks();
// }, { deep: true });


const htmlClasses = computed(() => {
    const vectorHtmlClasses = [
        "vector-feature-language-in-header-enabled",
        "vector-feature-language-in-main-page-header-disabled",
        "vector-feature-page-tools-pinned-disabled",
        "vector-feature-toc-pinned-clientpref-1",
        "vector-feature-main-menu-pinned-disabled",
        "vector-feature-limited-width-clientpref-1",
        "vector-feature-limited-width-content-enabled",
        "vector-feature-custom-font-size-clientpref-1",
        "vector-feature-appearance-pinned-clientpref-1",
        "vector-feature-night-mode-enabled",
        "vector-toc-available",
        "vector-animations-ready",
        "ve-not-available",
    ];

    const minervaHtmlClasses = [
        "mf-expand-sections-clientpref-0",
        "mf-font-size-clientpref-small",
        "mw-mf-amc-clientpref-0",
    ];

    const classes = isMobile.value ? minervaHtmlClasses : vectorHtmlClasses;
    
    classes.push(
        theme.value == "os"    ? "skin-theme-clientpref-os" :
        theme.value == "dark"  ? "skin-theme-clientpref-night" :
        theme.value == "light" ? "skin-theme-clientpref-day" :
        ""
    );
    return classes;
});

const wikiPageHtml = computed(() => wikiPage.value.doc?.body.firstElementChild?.innerHTML ?? "");


requestWikiPage(props.wikiPageTitle);
watch(() => props.wikiPageTitle, (newValue, oldValue) => {
  requestWikiPage(props.wikiPageTitle);
  // Perform actions here when the prop changes
});

onMounted(async () => {
    
    if (wikiRef.value) {
        wikiRef.value.blur();
    }

    const convertToCSSStyleSheet = async (cssString: string): Promise<CSSStyleSheet> => {
        const sheet = new CSSStyleSheet();
        await sheet.replace(cssString);
        return sheet;
    };

    const loadStyleSheets = async () => {
        const desktopModules = [
            "ext.cite.styles", "ext.relatedArticles.styles", "ext.kartographer.style",
            "ext.timeline.styles", "ext.uls.interlanguage", "ext.visualEditor.desktopArticleTarget.noscript",
            "ext.wikimediaBadges", "ext.wikimediamessages.styles", "mediawiki.page.gallery.styles",
            "mediawiki.hlist", "skins.vector.search.codex.styles", "skins.vector.styles",
            "skins.vector.icons", "wikibase.client.init", "skins.vector.icons,styles", "site.styles",
            // "ext.math.styles", // this broke on page https://en.wikipedia.org/wiki/Incomplete_Cholesky_factorization
            "ext.pygments"
        ];
        

        const mobileModules = [
            "ext.cite.styles", "ext.kartographer.style", "ext.timeline.styles", "ext.uls.interlanguage",
            "ext.relatedArticles.styles", "ext.wikimediaBadges", "ext.wikimediamessages.styles",
            "mobile.init.styles", "mediawiki.page.gallery.styles", "mediawiki.hlist",
            "wikibase.client.init", "site.styles", "skins.minerva.codex.styles",
            "skins.minerva.content.styles.images", "skins.minerva.icons,styles", "ext.gadget.Mobile",
            // "ext.math.styles", 
            "ext.pygments"
        ];

        const modules = isMobile.value ? mobileModules : desktopModules;
        const skin = isMobile.value ? 'minerva' : 'vector-2022';

        const styleApiUrl = `https://${props.wikiLang}.${isMobile.value ? "m." : ""}wikipedia.org/w/load.php?lang=${props.wikiLang}&only=styles&skin=${skin}&modules=`
        const styleUrl = `${styleApiUrl}${encodeURIComponent(modules.join("|"))}`;
        const urls = [styleUrl];

        const sheets = await Promise.all(
            urls.map(async (url) => {
                const response = await fetch(url);
                let cssText = await response.text();
                cssText = cssText.replaceAll(/html.skin/g, 'div[data-is-html].skin');
                const sheet = new CSSStyleSheet();
                await sheet.replace(cssText);
                return sheet;
            })
        );
        const wikiPageCssStyleSheet = await convertToCSSStyleSheet(wikiPageCssString);
        styleSheets.value = [wikiPageCssStyleSheet, ...sheets];
    };

    await loadStyleSheets();
});

</script>

<template>
    <ShadowRoot class="wiki-page" ref="shadowRootRef" :adopted-style-sheets="styleSheets">
        <div data-is-html role="article" :data-is-mobile="isMobile ? true : undefined"
                :class="[...htmlClasses, 'wiki-page']" ref="wikiRef">
            <div data-is-body :class="['content', { disable: disable }]">
                <h1 class="wiki-title" style="text-align: center">{{ title }}</h1>
                <h2 class="wiki-title">{{ wikiPage.parsedTitle }}</h2>
                <div class="mw-parser-output" v-html="wikiPageHtml">
                </div>    
            </div>
        </div>
    </ShadowRoot>
</template>
