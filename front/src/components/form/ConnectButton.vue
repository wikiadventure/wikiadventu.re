<template>
  <q-btn push class="connect-btn q-px-md" v-bind="$attrs" v-on="$listeners"/>
</template>
<style lang="scss">
.connect-btn {
  font-size: 1.5em;
  @media screen and (max-width: 720px) {
    font-size: 1em;
    padding: 0.2em 0.5em;
  }
}
.body--dark .connect-btn {
  background: var(--w-color-dark-teal);
  color: var(--w-color-dark-blue);          
}
.body--light .connect-btn {
  background: var(--w-color-almost-black);
  color: var(--w-color-blue-white);
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ConnectBtn',
});
</script>