<template>
  <q-btn :disable="connecting" :dense="$q.screen.lt.sm" push class="connect-btn action-btn" v-bind="$attrs" />
</template>
<style lang="scss">
.connect-btn {
  font-size: 1.5em;
  @media screen and (max-width: 720px) {
    padding: 0.2em 0.5em;
    font-size: 1em;
  }
}
</style>
<script lang="ts">
import { connecting } from 'store/connect/state';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConnectBtn',
  setup() {
    return {
      connecting
    }
  }
});
</script>