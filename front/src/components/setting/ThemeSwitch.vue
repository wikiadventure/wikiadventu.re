<template>
  <q-toggle class="darkModeToggle q-ma-none"
            v-model="theme"
            icon="mdi-lightbulb"
            size="lg"
            color="black">
  </q-toggle>
</template>
<style lang="scss">
.darkModeToggle {
  .q-toggle__thumb:after {
    background: var(--clr-main);
  }
  .q-icon {
    opacity: 1;
    color: var(--clr-reverse);
  }
}
</style>
<script lang="ts" setup>
import { Dark } from 'quasar';
import { computed } from "vue";
const theme = computed(() => ({
  get() { return Dark.isActive },
  set(v:boolean) { Dark.set(v) }
}));
</script>