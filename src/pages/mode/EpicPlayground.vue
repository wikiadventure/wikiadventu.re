<script setup lang="ts">
import ScrollSnapScreens from '../../components/ScrollSnapScreens.vue';
import WikiPage, { type LinkClickContext } from '../../components/wiki/WikiPage.vue';
import ControlScreen from '../../components/game/mode/epic/ControlScreen.vue';
import { nextTick, ref, watch } from 'vue';
import RoundWin from '../../components/game/RoundWin.vue';
import Leaderboard from '../../components/game/Leaderboard.vue';
import DesktopNav from '../../components/game/mode/epic/DesktopNav.vue';
import CountDown from '../../components/game/mode/epic/CountDown.vue';
import type { Timestamp, WikiPageId } from '../../stores/game';
import { useEpicGameLifeCycle, useEpicGameStore } from '../../stores/mode/epic/useEpic';
import MaterialSymbolsTvDisplays from '~icons/material-symbols/tv-displays'

const { store, current_phase, currentWikiPage, current_round, open_podium, player_id, getSyncedTimestamp, my_current_round_player_progress_set, current_pages_pool_id_map } =  useEpicGameStore();
useEpicGameLifeCycle();

const anchorRef = ref<string|null>(null);

function onLinkClick(url:string, _ctx:LinkClickContext) {
  const [rawTitle, anchor] = url.split("#");
  const title = decodeURIComponent(rawTitle).replaceAll("_", " ");
  const timestamp = getSyncedTimestamp();
  store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[timestamp] = {
    id: -1 as WikiPageId,
    title
  };
  anchorRef.value = anchor ?? null;
}

async function onWikiLink([parsedTitle, pageid]:[title: string, id: WikiPageId]) {
  await nextTick();
  const history = store.gamedata.player_data[player_id.value][store.gamedata.round.current].history;
  const timestamps = Object.keys(history).map(Number) as Timestamp[];
  const latestTimestamp = Math.max(...timestamps) as Timestamp;
  
  if (store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[latestTimestamp].title != parsedTitle) {
    store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[latestTimestamp].redirect = true;
    const timestamp = getSyncedTimestamp();
    store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[timestamp] = {
      id: pageid,
      title: parsedTitle
    }
  } else {
    store.gamedata.player_data[player_id.value][store.gamedata.round.current].history[latestTimestamp].id = pageid;
  }
}

const selectedPageId = ref(current_round.value?.pages_pool[1]?.id);
watch(current_round.value?.pages_pool, () => {
  selectedPageId.value = current_round.value?.pages_pool[1]?.id;
});

// const playAreaTitle = computed(()=>current_round.value.start.title + " → " + current_round.value.end.title);

</script>
<template>
<DesktopNav/>
<Leaderboard v-model="open_podium" />
<RoundWin v-if="current_phase.type == 'RoundEnd'"/>
<ScrollSnapScreens v-if="store.version != null">
  <section id="control-area">
    <ControlScreen />
  </section>
  
  <section id="play-area">
    <CountDown/>
    <ol v-if="current_round?.pages_pool" class="wiki-pages-pool">
      <li v-for="preview in current_round.pages_pool" 
        :page-found="my_current_round_player_progress_set.has(preview.id) ? '' : undefined">
        <label>
          <input 
            type="radio"
            tabindex="1"
            name="wiki-page-selection-play" 
            :value="preview.id" 
            v-model="selectedPageId" 
            :checked="selectedPageId == preview.id"
          />
          {{ preview.title }}
          <MaterialSymbolsTvDisplays :color="selectedPageId == preview.id ? 'green' : 'transparent'"/>
        </label>
      </li>
    </ol>
    <WikiPage :anchor="anchorRef" v-if="current_phase.type == 'Playing'"  :wiki-lang="store.gamedata.wiki_lang" 
      :wiki-page-title="currentWikiPage.title" v-on:link-click="onLinkClick" v-on:wiki-link="onWikiLink"
      :disable="false" :title="':)'"
    />
    <span class="default-text" v-else>Wiki playground for play phase</span>
  </section>

  <section id="end-page-area">
    <CountDown/>
    <ol v-if="current_round?.pages_pool" class="wiki-pages-pool">
      <li v-for="preview in current_round.pages_pool" 
        :page-found="my_current_round_player_progress_set.has(preview.id) ? '' : undefined">
        <label>
          <input 
            type="radio" 
            name="wiki-page-selection-end" 
            :value="preview.id" 
            v-model="selectedPageId" 
            :checked="selectedPageId == preview.id"
          />
          {{ preview.title }}
          <MaterialSymbolsTvDisplays :color="selectedPageId == preview.id ? 'green' : 'transparent'"/>
        </label>
      </li>
    </ol>
    <WikiPage :anchor="null" v-if="current_phase.type == 'Playing'" :wiki-lang="store.gamedata.wiki_lang" 
      :wiki-page-title="current_pages_pool_id_map.get(selectedPageId)?.title ?? ''" v-on:link-click="() => {}"
      :disable="true" :title="'End page'" 
    />
    <span class="default-text" v-else>Wiki end page preview for play phase</span>
  </section>
  
</ScrollSnapScreens>
</template>
<style>
#play-area, #end-page-area {
  background: var(--background-wiki-color);
  > ol.wiki-pages-pool {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    list-style: none;
    gap: 1ch;
    margin: 0;
    padding: 6ch 1ch;
    label {
      display: block;
      cursor: pointer;
      padding: 10px 5px;
      border-radius: 50px;
      background: var(--back-focus-color); 
      &::before {
        content: counter(list-item) ". ";
        font-weight: bold;
      }
    }
    input {
      display: none;
    }
    svg {
      vertical-align: middle;
    }
    > li[page-found] {

      color: cyan;
    }
  }
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
