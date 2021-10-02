<template>
  <connect-menu></connect-menu>
</template>
<style>
</style>
<script lang="ts">
import ConnectMenu from './connect/ConnectMenu.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Connect',
  components: { ConnectMenu }
});
</script>