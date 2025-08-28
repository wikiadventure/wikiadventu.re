<script lang="ts" setup>
import IconQuestionMark from '~icons/material-symbols/question-mark-rounded';

const { thumbnail } = defineProps<{
    thumbnail?: {
        source: string,
        width: number,
        height: number
    } | null
}>()
</script>
<template>
    <div wiki-thumbnail v-if="thumbnail != null">
      <img :src="thumbnail.source" :width="thumbnail.width!" :height="thumbnail.height!" />
    </div>
    <div wiki-thumbnail no-img v-else >
      <IconQuestionMark/>
    </div>
</template>
<style >
[wiki-thumbnail] {
    display: grid;
    grid-area: i;
    width: 80px;
    height: 80px;
    place-items: center;
    background: none;
    border-radius: 3px;
    position: relative;
    &:not([no-img]) {
        filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
        &:hover {
            z-index: 5;
            isolation: isolate;
        }
    }
}

[wiki-thumbnail]:not([no-img]):hover, :is(:focus, :focus-visible) [wiki-thumbnail] {
    img {
        max-width: 100vmin;
        max-height: 100vmin;
        border-radius: 0;
        filter: drop-shadow(0 0 3px #fff);
        transition: filter .5s, max-height .5s .5s, max-width .5s .5s;
    }
}

[wiki-thumbnail]>img {
    position: absolute;
    max-width: 80px;
    max-height: 80px;
    object-fit: cover;
    border-radius: 3px;
    transition: filter 1s, max-height .5s 0s, max-width .5s 0s;
}

[wiki-thumbnail][no-img] {
    border: 1px solid grey;
    
}
</style>