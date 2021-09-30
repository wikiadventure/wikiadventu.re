<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'App',
  setup() {
    Dark.set(true);
  }
})
</script>
