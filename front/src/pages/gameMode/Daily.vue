<template>
    <div v-if="isMenu" class="game-mode-daily menu">
        <lang-select />
        <q-btn push class="action-btn" :label="t('start')" @click="start()" icon="mdi-check-bold" />
    </div>
    <div v-else class="game-mode-daily">
        <p class="absolute-top-right z-top q-pa-sm text-white">{{ timeLeft }}</p>
        <!-- <div class="absolute-full z-top"></div> -->
        <wiki-page @wikiLink="onWikiLink" ref="wikiPage" />
        <wiki-page
            ref="wikiEndPage"
            class="right-panel"
            :class="{ 'hideEndPage': !showWikiEndPage }"
        >
            <exit-btn class="q-ma-md" @click="showWikiEndPage = false" />
        </wiki-page>
        <transition name="fade">
            <round-win v-show="showRoundWin" />
        </transition>
    </div>
</template>
<style lang="scss">
.game-mode-daily {
    overflow: hidden;
    position: absolute;
    inset: 0;
    &.menu {
        display: grid;
        place-content: center;
        // place-items: center;
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
import { onMounted, onUnmounted, ref } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import TouchSurfaceHandler from 'src/script/touchSurfaceHandler';
import { useI18n } from 'vue-i18n';
import { startDynamicTimer } from 'src/script/timer';
import { lang as lobbyLang } from 'store/lobby/state';
import { lang as connectLang } from 'store/connect/state';
import { useRouter } from "vue-router";
import { notifyError } from 'store/connect/action';

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

const history: Ref<string[]> = ref([]);

function onWikiLink(url: string) {
    history.value.push(url);
    console.log(url, wikiEndPage.value?.title, url == wikiEndPage.value?.title)
    if (url == endPage.value) {
        console.log(history.value);
        router.push(`/daily/result/${lobbyLang.value}?time=${timeLeft.value}&path=${history.value.map(s=>encodeURIComponent(s)).join("|")}`)
    }
}

function start() {
    lobbyLang.value = connectLang.value;
    fetch("/api/daily", {
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
                    message: "Pas de daily disponible pour cette langue"
                    // message: i18n.global.t(translate(n)) + (message ? (' : ' + message) : "")
                });
            }
            isMenu.value = false;
            startPage.value = json.start;
            endPage.value = json.end;
            wikiPage.value?.requestWikiPage(startPage.value)
                .then(() => {
                    history.value.push(startPage.value);
                    startDynamicTimer(timeController, timeStamp, timeLeft);
                });
            wikiEndPage.value?.requestWikiPage(endPage.value);
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
  fr:
    start: "Commencer"
    noDaily: "Pas de daily disponible pour cette langue"
</i18n>
