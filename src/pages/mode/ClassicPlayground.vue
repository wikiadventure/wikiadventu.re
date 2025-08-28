<script setup lang="ts">
import ScrollSnapScreens from '../../components/ScrollSnapScreens.vue';
import WikiPage, { type LinkClickContext } from '../../components/wiki/WikiPage.vue';
import ControlScreen from '../../components/game/mode/classic/ControlScreen.vue';
import { computed, nextTick, ref } from 'vue';
import RoundWin from '../../components/game/RoundWin.vue';
import { useClassicGameLifeCycle, useClassicGameStore } from '../../stores/mode/classic/useClassic';
import Leaderboard from '../../components/game/Leaderboard.vue';
import DesktopNav from '../../components/game/mode/classic/DesktopNav.vue';
import CountDown from '../../components/game/mode/classic/CountDown.vue';

const { store, current_phase, currentWikiPage, currentEndPage, current_round, open_podium, player_id } = useClassicGameStore();
useClassicGameLifeCycle();

const anchorRef = ref<string|null>(null);

function onLinkClick(url:string, _ctx:LinkClickContext) {
  const [rawTitle, anchor] = url.split("#");
  const title = decodeURIComponent(rawTitle).replaceAll("_", " ");
  const timestamp = Date.now();
  store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[timestamp] = {
    id: -1,
    title
  };
  anchorRef.value = anchor ?? null;
}

async function onWikiLink([parsedTitle, pageid]:[title: string, id: number]) {
  await nextTick();
  const history = store.gamedata.player_data[player_id.value][store.gamedata.round.current].history;
  const timestamps = Object.keys(history).map(Number);
  const latestTimestamp = Math.max(...timestamps);
  
  if (store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[latestTimestamp].title != parsedTitle) {
    store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[latestTimestamp].redirect = true;
    const timestamp = Date.now();
    store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[timestamp] = {
      id: pageid,
      title: parsedTitle
    }
  } else {
    store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[latestTimestamp].id = pageid;
  }
}

const playAreaTitle = computed(()=>current_round.value.start.title + " → " + current_round.value.end.title);

</script>
<template>
<DesktopNav/>
<Leaderboard v-model="open_podium" />
<RoundWin v-if="current_phase.type == 'RoundEnd'"/>
<ScrollSnapScreens v-if="store.version != null">
  <ControlScreen id="control-area"/>
  <section id="play-area">
    <CountDown/>
    <WikiPage :anchor="anchorRef" v-if="current_phase.type == 'Playing'"  :wiki-lang="store.gamedata.wiki_lang" 
      :wiki-page-title="currentWikiPage.title" v-on:link-click="onLinkClick" v-on:wiki-link="onWikiLink"
      :disable="false" :title="playAreaTitle"
    />
    <span class="default-text" v-else>Wiki playground for play phase</span>
  </section>
  <section id="end-page-area">
    <CountDown/>
    <WikiPage :anchor="null" v-if="current_phase.type == 'Playing'" :wiki-lang="store.gamedata.wiki_lang" 
      :wiki-page-title="currentEndPage.title" v-on:link-click="() => {}"
      :disable="true" :title="'End page'" 
    />
    <span class="default-text" v-else>Wiki end page preview for play phase</span>
  </section>
</ScrollSnapScreens>
</template>
<style>
#play-area, #end-page-area {
  background: var(--background-wiki-color);
  .wiki-page {
    padding-top: 2lh;
  }
  > .count-down {
    position: sticky;
    width: fit-content;
    height: min-content;
    top: 15px;
    left: 15px;
  }
  > .default-text {
    font-size: 2em;
    margin: auto;
    padding-top: 2lh;
    font-weight: bold;
    display: block;
    text-align: center;
  }
}
</style>
