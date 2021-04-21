<template>
  <connect-menu></connect-menu>
</template>
<style>
</style>
<script lang="ts">
import ConnectMenu from 'src/layouts/connect/ConnectMenu.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Connect',
  components: { ConnectMenu },
  mounted() {
    this.$store.dispatch('gameData/reset');
  }
});
</script>