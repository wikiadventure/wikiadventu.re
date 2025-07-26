<script lang="ts" setup>
import { computed } from 'vue';
import type { WikiContentPreview } from '../../composables/useWiki';
const props = defineProps<{
  wikiContentPreview: WikiContentPreview | null;
  disableGotoWiki?: boolean;
}>();

const { wikiContentPreview, disableGotoWiki } = props;

const wikiUrl = computed(()=>`https://${wikiContentPreview?.wikiLang}.wikipedia.org/wiki/${wikiContentPreview?.title?.replace(' ', '_')}`);

function openWiki() {
  props.disableGotoWiki || wikiContentPreview != null && window.open(wikiUrl.value, "_blank");
}

</script>
<template>
  <div wiki-preview tabindex="0" 
    :aria-roledescription="props.disableGotoWiki ? undefined : 'Goto the wikipedia page on enter key press'"
    @keypress.enter="openWiki"
    >
    <wiki-thumbnail :thumbnail="wikiContentPreview?.thumbnail"/>
    <!-- <wiki-thumbnail v-if="!loading" :thumbnail="wikiContentPreview.thumbnail"/>
    <SearchLoader v-else/> -->
    <h3>
      <a  v-if="!props.disableGotoWiki && wikiContentPreview?.title" tabindex="-1"
        :href="wikiUrl" target="_blank">
        <MdiOpenInNew/>
      </a>
      {{ (wikiContentPreview?.title || "???" ) }}
    </h3>
    <p>{{ wikiContentPreview?.description || "???" }}</p>
  </div>
</template>
<style >
[wiki-preview] {
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: 
    "i t t"
    "i d d";
  padding: 10px 0 10px 10px;
  &:last-child {
    border: none;
  }
  backdrop-filter: blur(2px);
  background: #0001;
  /* @at-root .body--dark & {
    background: #fff1;
  } */
  &:hover, &:focus, &:focus-visible {
    z-index: 5;
  }
  &:focus, &:focus-visible {
    outline: 2px solid var(--heat-color);
    outline-offset: 4px;
  }

  & > [wiki-thumbnail], & > [search-loader] {
    grid: i;
  }

  h3 {
    grid-area: t;
    font-weight: bolder;
    -webkit-line-clamp: 2;
    max-height: 2em;
    > a {
      float: right;
      margin-right: -8px;
      padding: 2px;
      border-radius: 2px;
      transition: all ease-in-out .2s;
      color: white;
      &:hover {
        background: #fff3;
      }
      &:visited {
        color: rgb(176, 0, 176);
      }
    }
  }

  p, h3 {
    margin: 0;
    padding: 0 10px;
    font-size: 1rem;
    line-height: 1em;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical;
    transition: .5s max-height;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  p {
    grid-area: d;
    margin-bottom: 2px;
    -webkit-line-clamp: 3;
    max-height: 3em;
  }

  &:is(:hover, :focus, :focus-visible) :is(p, h3) {
    -webkit-line-clamp: 100;
    max-height: 30rem;
  }
}
</style>
