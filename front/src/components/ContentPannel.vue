<template>
    <div class="content-pannel">
        <h2 class="content-pannel-head is-center">{{ head }}</h2>
        <h2 v-if="subhead" class="content-pannel-subhead is-center">{{ subhead }}</h2>
        <div class="content-pannel-core row">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped>
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
.content-pannel-core > div {
    /*border-bottom: 1px solid rgba(0,0,0,0.3);*/
    text-align: center;
    padding: 1.5em;
    width: 100%;
    align-content: center;
}
.content-pannel-core > div:nth-child() {
    text-align: center;
    width: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ContentPannel',
  props: {
    head: String,
    subhead: String,
  }
});
</script>