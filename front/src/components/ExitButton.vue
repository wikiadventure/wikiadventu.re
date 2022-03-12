<template>
    <q-btn icon="mdi-close" round class="exit-btn q-ma-xs" size="xs" v-bind="$attrs"></q-btn>
</template>
<style>
.exit-btn {
  position: absolute;
  right: 0;
  top: 0;
  border: 2px solid var(--clr-main);
  color: var(--clr-main);
  filter: drop-shadow(2px 2px 3px black);
}
</style>
<script lang="ts" setup>
</script>
