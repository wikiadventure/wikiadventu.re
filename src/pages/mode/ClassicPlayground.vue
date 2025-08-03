<script setup lang="ts">
import ScrollSnapScreens from '../../components/ScrollSnapScreens.vue';
import WikiPage, { type LinkClickContext } from '../../components/wiki/WikiPage.vue';
import ControlScreen from '../../components/game/mode/classic/ControlScreen.vue';
import { nextTick } from 'vue';
import { player_id } from '../../stores/form';
import RoundWin from '../../components/game/RoundWin.vue';
import { useClassicGameLifeCycle, useClassicGameStore } from '../../stores/mode/classic/useClassic';
import Leaderboard from '../../components/game/Leaderboard.vue';
import DesktopNav from '../../components/game/mode/classic/DesktopNav.vue';

const { store, current_phase, currentWikiPage, currentEndPage } = useClassicGameStore();
const { open_podium } = useClassicGameLifeCycle();


function onLinkClick(url:string, _ctx:LinkClickContext) {
  const [rawTitle, _anchor] = url.split("#");
  const title = decodeURIComponent(rawTitle).replaceAll("_", " ");
  const timestamp = Date.now();
  store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[timestamp] = {
    id: -1,
    title
  };
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
</script>
<template>
<DesktopNav/>
<Leaderboard v-model="open_podium" />
<ScrollSnapScreens v-if="store.version != null">
  <ControlScreen id="control-area"/>
  <section id="play-area">
    <WikiPage v-if="current_phase.type == 'Playing'"  :wiki-lang="store.gamedata.wiki_lang" 
      :wiki-page-title="currentWikiPage.title" v-on:link-click="onLinkClick" v-on:wiki-link="onWikiLink"
      :disable="false" :title="'JaaJ'"
    />
    <RoundWin v-if="current_phase.type == 'RoundEnd'"/>
  </section>
  <section id="end-page-area">
    <WikiPage v-if="current_phase.type == 'Playing'" :wiki-lang="store.gamedata.wiki_lang" 
      :wiki-page-title="currentEndPage.title" v-on:link-click="() => {}"
      :disable="true" :title="'JaaJ'" 
    />
  </section>
</ScrollSnapScreens>
</template>
<style>

</style>
