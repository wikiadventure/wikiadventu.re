<script setup lang="ts">
import { ContentJSON } from 'yjs';
import DEBUG from '../components/game/DEBUG.vue';
import ScrollSnapScreens from '../components/ScrollSnapScreens.vue';
import WikiPage, { type LinkClickContext } from '../components/wiki/WikiPage.vue';
import { useGameStore } from '../stores/useGameStore';

const { store, webRtcProvider, connectedPlayerIds, isHost } = useGameStore();

function onLinkClick(url:string, ctx:LinkClickContext) {
  const [rawTitle, anchor] = url.split("#");
  const title = decodeURIComponent(rawTitle).replace("_", " ");
  console.trace(title);
  store.gamedata.syncWikiPage = title;
}

</script>

<template>
<ScrollSnapScreens v-if="store.version != null">
  <section><DEBUG/></section>
  <section>
    <WikiPage wiki-lang="fr" :wiki-page-title="store.gamedata.syncWikiPage" v-on:link-click="onLinkClick"
      :disable="false" :title="'JaaJ'"
    />
  </section>
  <section>end page</section>
</ScrollSnapScreens>
</template>
<style>

</style>
