<template>
  <connect-btn push class="twitch-btn" v-bind="$attrs" v-on="$listeners" icon-right="mdi-twitch"/>
</template>
<style lang="scss">
.twitch-btn {
  background: #6441A4;
  color: var(--wa-color-blue-white);
}
</style>
<script lang="ts">
import ConnectBtn from './ConnectButton.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TwitchBtn',
  components: { ConnectBtn }
});
</script>