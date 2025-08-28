import { computed, type Ref } from "vue";
import { cssStringToStyleSheet } from "../../composables/CssStringToStyleSheet";
import wikiPageCss from "./wikiPage.css?inline";
import type { LangCode } from "../../i18n/lang";
import { theme } from "../../composables/useTheme";

type CachedStyleSheets = {
    wikiLang: LangCode,
    isMobile: boolean,
    styleSheets : Promise<CSSStyleSheet[]>
}

let cachedStyleSheets:CachedStyleSheets|null = null;

export function useWikiStyleSheets(wikiLang:Ref<LangCode>, isMobile:Ref<boolean>) {
    const wikiStyleSheets = computed(() => {
        return loadWikiStyleSheetWithCache(wikiLang.value, isMobile.value);
    });


    const wikiHtmlClasses = computed(() => {
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

    return {
        wikiStyleSheets,
        wikiHtmlClasses
    }
} 

async function loadWikiStyleSheetWithCache(wikiLang:LangCode, isMobile:boolean) {
    if (cachedStyleSheets != null && cachedStyleSheets.isMobile == isMobile && cachedStyleSheets.wikiLang == wikiLang) {
        return cachedStyleSheets.styleSheets;
    }
    const styleSheets = loadWikiStyleSheet(wikiLang, isMobile);
    cachedStyleSheets = {
        wikiLang,
        isMobile,
        styleSheets 
    };
    return styleSheets;
}

async function loadWikiStyleSheet(wikiLang:LangCode, isMobile:boolean) {
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
        "wikibase.client.init", "site.styles", "skins.minerva.codex.styles", "skins.minerva.amc.styles",
        "skins.minerva.content.styles.images", "skins.minerva.icons,styles", "ext.gadget.Mobile",
        // "ext.math.styles", 
        "ext.pygments"
    ];

    const modules = isMobile ? mobileModules : desktopModules;
    const skin = isMobile ? 'minerva' : 'vector-2022';

    const styleApiUrl = `https://${wikiLang}.${isMobile ? "m." : ""}wikipedia.org/w/load.php?lang=${wikiLang}&only=styles&skin=${skin}&modules=`
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
        }).concat(
            cssStringToStyleSheet(wikiPageCss)
        )
    );
    return sheets;
}