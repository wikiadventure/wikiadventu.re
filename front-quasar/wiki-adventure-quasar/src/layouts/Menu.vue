<template>
  <q-layout class="menu-layout">
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn class="scroll-top-btn" round size="s" icon="keyboard_arrow_up" ></q-btn>
    </q-page-scroller>
  </q-layout>
</template>
<style>
.menu-layout {
  pointer-events: none;
  z-index: 2;
}
.scroll-top-btn {
  pointer-events: auto;
  opacity: 0.5;
  transition: opacity 0.25s ease-in-out;
}
.scroll-top-btn:hover {
  opacity: 1;
}
.body--dark .scroll-top-btn {
  background: var(--w-color-blue-white);
  color: var(--w-color-almost-black);
}
.body--light .scroll-top-btn {
  background: var(--w-color-almost-black);
  color: var(--w-color-blue-white);
}
</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'MenuLayout'
});
</script>
