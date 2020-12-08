<template>
  <connect-menu></connect-menu>
</template>
<style>
</style>
<script lang="ts">
import ConnectMenu from "../layouts/connect/ConnectMenu.vue"

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Connect',
  components: { ConnectMenu }
});
</script>