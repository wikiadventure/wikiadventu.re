<template>
    <div class="daily-result">
        <compact-lang-switch  class="absolute-top-left q-ma-sm"/>
        <theme-switch class="absolute-top-right q-ma-sm" />
        <img src="~assets/svg/title.svg" alt="wikipedia adventure"/>
        <h2>Daily</h2>
        <h3>{{ startPage }} → {{ endPage }}</h3>
        <p>{{ path.length-1 }} links in {{ time }} s</p>
        <div>
           <q-btn push class="action-btn" @click="CopyToClipboard(shareURL)" :label="t('share')" icon="mdi-share-variant"/>
           <q-btn push class="action-btn" to="/daily" :label="t('play')" icon="mdi-play"/>
        </div>
        <section>
            <div v-if="loading" loader></div>
            <a v-else v-for="p in pageList" :href="wikiUrl(p.title || '')">
                <wiki-preview :wikiPreview="p"/>
            </a>
        </section>
    </div>
</template>
<style lang="scss">
.daily-result {

    width: 100%;
    min-height: 100%;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    gap: 15px;

    >img {
        font-size: 6rem;
        width: 16ch;
        max-width: 100%;
    }
    
    >div {
        display: flex;
        padding: 20px;
        gap: 20px;
    }

    section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
        gap: 15px;
        >a {
            text-decoration: none;
            color: unset;
            width: max(500px, 50%);
            max-width: 100%;
        }
        > a:first-child:nth-last-child(50) ~ a:nth-child(26):before {
            content: "...";
            font-size: 3em;
            line-height: 100px;
        }
    }
    >h2 {
        margin: 30px 0;
    }
    >h3, >p {
        margin: 15px;
    }
    // >h2, >h3, >p {
    //     margin: 15px;
    // }
    >p {
        font-size: 2em;
    }

    .wiki-preview {
        background: var(--clr-alt);
        border-radius: 15px;
    }

    div[loader] {
        border: 5px solid #fff;
        filter: drop-shadow(0 0 5px cyan);
        text-align: center;
        line-height: 10ch;
        // vertical-align: middle;
        width: 10ch;
        height: 10ch;
        animation: loader 1s infinite linear;
    }

    @keyframes loader {
        0% {   transform: rotate(0deg); border-radius: 50%; }
        50% {  transform: rotate(90deg); border-radius: 5%; }
        100% { transform: rotate(180deg); border-radius: 50%; }
    }
}
</style>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { Lang } from "src/i18n";
import WikiPreview from "src/components/game/WikiPreview.vue";
import { loadPreviews } from "store/wiki/action";
import { WikiPreview as WikiPagePreview } from "store/vote/type";
import ThemeSwitch from "src/components/setting/ThemeSwitch.vue";
import { CopyToClipboard } from "store/utils/CopyToClipboard";
import { useI18n } from "vue-i18n";
import CompactLangSwitch from "src/components/setting/CompactLangSwitch.vue";

const { t } = useI18n({ useScope: 'local' });

const route = useRoute();

const lang = ref(route.params.lang as Lang);
const time = ref(route.query.time);
const path = (route.query.path as string).split("|").map(s=>decodeURIComponent(s));
const path50 = path.length > 50 ? path.slice(0,25).concat(path.slice(path.length-25)) : path;
console.log(path50.length);
const pageList = ref<WikiPagePreview[]>([]);
const loading = ref(true)
loadPreviews(path50, lang.value).then(x=>{
    const { previews, response} = x;
    const normalizedMap = new Map<string, string>();
    const redirectsMap  = new Map<string, string>();
    console.log(response);
    response.query.normalized?.forEach(o=>normalizedMap.set(o.from,o.to));
    response.query.redirects ?.forEach(o=>redirectsMap .set(o.from,o.to));
    console.log(path);
    pageList.value = path.map(title => {
        var t = normalizedMap.get(title) || title;
        t =  redirectsMap.get(t) || t;
        return previews.find(p => p.title == t) 
        || 
        ( { title: decodeURIComponent(title),
            description: "Page not found on wikipedia" } );
    });

    loading.value = false;
});

const shareURL = window.location.origin+route.fullPath

const startPage = computed(()=> pageList.value[0]?.title || path[0].replace(/_/g," "));
const endPage = computed(()=> pageList.value[pageList.value.length-1]?.title || path[path.length-1].replace(/_/g," "));

const wikiUrl = (t:string) => `https://${lang.value}.wikipedia.org/wiki/${encodeURIComponent(t)}`;

</script>
<i18n lang="yaml">
  en:
    share: "Share"
    play: "Play"
  fr:
    share: "Partager"
    play: "Jouer"
</i18n>

