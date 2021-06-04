<template>
  <q-btn :disable="connecting" :dense="$q.screen.lt.sm" push class="connect-btn action-btn" v-bind="$attrs" v-on="$listeners" />
</template>
<style lang="scss">
.connect-btn {
  font-size: 1.5em;
  @media screen and (max-width: 720px) {
    font-size: 1em;
    padding: 0.2em 0.5em;
  }
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ConnectBtn',
  computed: {
    connecting():boolean {
      return this.$store.state.globalForm.connecting;
    },
  }
});
</script>