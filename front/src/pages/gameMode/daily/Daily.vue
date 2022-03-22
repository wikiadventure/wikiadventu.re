<template>
    <div v-if="isMenu" class="game-mode-daily menu">
        <compact-lang-switch  class="absolute-top-left q-ma-sm"/>
        <theme-switch class="absolute-top-right q-ma-sm" />
        <img src="~assets/svg/title.svg" alt="wikipedia adventure"/>
       
        <h2>Daily</h2>
        <lang-select />
        <q-btn push class="action-btn" :label="t('start')" @click="start()" icon="mdi-check-bold" />
        <p>{{ t('explanation') }}</p>
        <p>{{ t("shortcut"+($q.platform.is.mobile ? "Mobile" : ""))  }}</p>
    </div>
    <div v-show="!isMenu" class="game-mode-daily">
        
        <p class="timeleft">{{ timeLeft }}</p>
        <!-- <div class="absolute-full z-top"></div> -->
        <wiki-page @wikiLink="onWikiLink" ref="wikiPage">
            <template v-slot:page>
                <h2 class="game-mode-daily-objectif">{{ startPageF }} → {{ endPageF }}</h2>
            </template>
        </wiki-page>
        <wiki-page
            disable
            ref="wikiEndPage"
            class="right-panel"
            :class="{ 'hideEndPage': !showWikiEndPage }"
        >
            <exit-btn class="q-ma-md" @click="showWikiEndPage = false" />
        </wiki-page>
        <transition name="fade">
            <round-win v-show="showRoundWin" override-win />
        </transition>
    </div>
</template>
<style lang="scss">
.game-mode-daily {
    overflow: hidden;
    position: absolute;
    inset: 0;
    .game-mode-daily-objectif {
        text-align: center;
        color: var(--clr-reverse);
        margin: 0;
        padding: 15px;
    }
    >.timeleft {
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        color: var(--clr-reverse);
        margin: 0;
        padding: 15px;
    }
    &.menu {
        p {
            text-align: center;
            font-size: 1.3em;
            max-width: 95%;
            width: Max(60%, 500px);
        }
        overflow-y: auto;
        padding: 15px;
        gap: 15px;
        display: grid;
        min-height: min-content;
        justify-items: center;
        align-content: center;
        >img {
            font-size: 6rem;
            width: 16ch;
            max-width: 100%;
        }
    }
}
.right-panel {
    transition: transform 0.15s ease-in-out;
    filter: drop-shadow(3px 3px 15px black);
}
.hideEndPage {
    transform: translate3d(100%, 0, 0);
}
</style>

<script lang="ts" setup>
import LangSelect from 'src/components/form/LanguageSelect.vue';
import WikiPage from 'src/layouts/lobby/WikiPage.vue';
import ExitBtn from 'src/components/ExitButton.vue';
import RoundWin from 'src/layouts/lobby/screen/RoundWin.vue';
import type { Ref } from "vue";
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import TouchSurfaceHandler from 'src/script/touchSurfaceHandler';
import { useI18n } from 'vue-i18n';
import { startDynamicTimer } from 'src/script/timer';
import { lang as lobbyLang } from 'store/lobby/state';
import { lang as connectLang } from 'store/connect/state';
import { useRouter } from "vue-router";
import { notifyError } from 'store/connect/action';
import CompactLangSwitch from 'src/components/setting/CompactLangSwitch.vue';
import ThemeSwitch from 'src/components/setting/ThemeSwitch.vue';
import { apiRoot } from 'store/utils/ApiRoot';

const { t } = useI18n({ useScope: 'local' });
var $q = useQuasar();
const router = useRouter();

var {
    showRoundWin,
    showWikiEndPage,
} = gameLayoutManagerSetup();

const isMenu = ref(true)

var wikiPage = ref<InstanceType<typeof WikiPage>>();
var wikiEndPage = ref<InstanceType<typeof WikiPage>>();

var touchSurfaceHandler: TouchSurfaceHandler;

var timeController = ref(new AbortController());
var timeStamp = ref(0);
var timeLeft = ref(0);

const startPage = ref("");
const endPage = ref("");

const startPageF = computed(()=> decodeURI(startPage.value).replace(/_/g," "));
const endPageF = computed(()=> decodeURI(endPage.value).replace(/_/g," "));

const history: Ref<string[]> = ref([]);

function onWikiLink(url: string) {
    history.value.push(url);
    if (url == decodeURI(endPage.value)) {
        onWin();
    }
}

function onWin() {
    showRoundWin.value = true;
    setTimeout(()=>{
        showRoundWin.value = false;
        router.push(`/daily/result/${lobbyLang.value}?time=${timeLeft.value}&path=${history.value.map(s=>encodeURIComponent(s)).join("|")}`)
    }, 5000)
}

function start() {
    lobbyLang.value = connectLang.value;
    fetch(apiRoot+"/api/daily", {
        method: "POST",
        body: JSON.stringify({
            lang: lobbyLang.value
        })
    })
        .then(async r => {return { json: await r.json(), res: r}})
        .then(r => {
            const { res, json } = r;
            if (!res.ok) {
                return Notify.create({
                    type: 'negative',
                    position: 'top',
                    message: t('noDaily')
                    // message: i18n.global.t(translate(n)) + (message ? (' : ' + message) : "")
                });
            }
            isMenu.value = false;
            startPage.value = json.start;
            endPage.value = json.end;
            wikiPage.value?.requestWikiPage(decodeURI(startPage.value))
                .then(() => {
                    history.value.push(startPage.value);
                    startDynamicTimer(timeController, timeStamp, timeLeft);
                });
            wikiEndPage.value?.requestWikiPage(decodeURI(endPage.value));
        })
}

onMounted(() => {
    touchSurfaceHandler = new TouchSurfaceHandler(document.documentElement, undefined, showWikiEndPage, undefined, wikiEndPage.value?.$el);
    if (!wikiPage.value || !wikiEndPage.value) return;
    wikiPage.value.setTips();
    wikiEndPage.value.setNoEndPage();

});

onUnmounted(() => {
    touchSurfaceHandler.destroy();
    timeController.value.abort();
});

</script>
<i18n lang="yaml">
  en:
    start: "Start"
    noDaily: "No daily available for this language"
    explanation: |
        Welcome to Wiki Adventure Daily! The goal is to go from 1 wikipedia page to an other by following link.
        Try to finish this daily challenge as fast you can with the fewest link possible and share you adventure with your friend!

    shortcut: "You can see the goal page with ctrl + alt + space ."
    shortcutMobile: "You can swipe to the left to see the goal page."
  fr:
    start: "Commencer"
    noDaily: "Pas de daily disponible pour cette langue"
    explanation: |
        Bienvenue sur Wiki Adventure Daily! Le but est d'aller d'une page wikipédia à une autre en suivant uniquement les liens.
        Essayer de finir le challenge quotidien aussi vite que vous pouvez avec le moins de liens possible et partager votre aventure avec vos amis! 
        
    shortcut: "Vous pouvez consulter la page cible avec ctrl + alt + space ."
    shortcutMobile: "Vous pouvez consulter la page cible en glissant vers la gauche."
</i18n>
