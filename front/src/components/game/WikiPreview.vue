<template>
  <div class="wiki-preview">
    <img class="img" v-if="wikiPreview?.thumbnail != null" :src="wikiPreview?.thumbnail?.source" :width="wikiPreview?.thumbnail?.width" :height="wikiPreview?.thumbnail?.height" />
    <div class="img none" v-else >
      <q-icon size="40px" name="mdi-help" />
    </div>
    <h3>{{ beforeTitle + (wikiPreview?.title || "???" ) }}<slot></slot></h3>
    <p>{{ wikiPreview?.description || "???" }}</p>
  </div>
</template>
<style lang="scss">
.wiki-preview {
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: 
  "i t t"
  "i d d";
  padding: 10px;
  &:last-child {
    border: none;
  }
  .img {
    grid-area: i;
    width: 80px;
    height: 80px;
    background: hsla(0,0%,100%,0.5);
    border-radius: 3px;

  }
  div.img {
    display: grid;
    place-items: center;
    background: none;
    border: 1px solid grey
  }
  h3 {
    grid-area: t;
    margin: 5px 15px;
    font-size: 1.5rem;
    line-height: 1.5rem;
    >* {
      float: right;
    }
  }
  p {
    grid-area: d;
    margin: 5px 15px;
    font-size: 1rem;
    line-height: 1rem;
  }
}
</style>
<script lang="ts">
import { WikiPreview } from 'store/vote/type';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: "WikiPreview",
  props: {
    wikiPreview: {
      type: Object as PropType<WikiPreview>,
      required: true
    },
    beforeTitle: {
      type: String,
      default: ''
    }
  }
})
</script>
