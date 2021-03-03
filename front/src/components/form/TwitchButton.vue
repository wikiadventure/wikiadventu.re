<template>
  <q-btn push class="twitch-btn q-px-md shadow-3" v-bind="$attrs" v-on="$listeners" icon-right="mdi-twitch"/>
</template>
<style lang="scss">
.twitch-btn {
  background: #6441A4;
  color: var(--w-color-blue-white);
  font-size: 1.5em;
  @media screen and (max-width: 720px) {
    font-size: 1em;
    padding: 0.2 0.5em;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TwitchBtn',
});
</script>