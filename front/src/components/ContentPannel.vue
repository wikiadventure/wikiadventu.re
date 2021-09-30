<template>
    <div class="content-pannel">
        <h2 class="content-pannel-head">{{ head }}</h2>
        <h2 v-if="subhead" class="content-pannel-subhead">{{ subhead }}</h2>
        <div class="content-pannel-core">
            <slot></slot>
        </div>
    </div>
</template>
<style>
.content-pannel {
    padding: 0 1em 1em;
    width: 100%;
}
.content-pannel-head {
    font-weight: 400;
    font-size: 1.5em;
    line-height: 1.5em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 1em;
    text-align: center;
}
.content-pannel-subhead {
    text-align: center;
}
.content-pannel-core {
    text-align: center;
    padding: 1.5em;
    width: 100%;
    align-content: center;
    display: flex;
    justify-content: space-evenly;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ContentPannel',
  props: {
    head: String,
    subhead: String,
  }
});
</script>