<template>
  <connect-btn push class="twitch-btn" :dense="$q.screen.lt.sm" v-bind="$attrs" icon-right="mdi-twitch"/>
</template>
<style lang="scss">
.twitch-btn {
  background: #6441A4;
  color: var(--clr-light);
}
</style>
<script lang="ts">
import ConnectBtn from './ConnectButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TwitchBtn',
  components: { ConnectBtn }
});
</script>