<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'App',
  meta () {
    return {
      title: "Wiki Adventure"
    }
  }
});
</script>
