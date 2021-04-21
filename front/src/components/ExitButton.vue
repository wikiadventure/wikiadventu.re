<template>
    <q-btn icon="mdi-close" round class="exit-btn q-ma-xs" size="xs" @click="close" v-bind="$attrs" v-on="$listeners"></q-btn>
</template>

<style scoped>
.exit-btn {
  position: absolute;
  right: 0;
  top: 0;
  filter: drop-shadow(2px 2px 3px black);
}
.body--dark .exit-btn {
  border: 2px solid var(--wa-color-blue-white);
  color: var(--wa-color-blue-white);
}
.body--light .exit-btn {
  border: 2px solid var(--wa-color-almost-black);
  color: var(--wa-color-almost-black);
}

</style>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import  { ManageScreenEvent } from 'src/mixins/manageScreen';


export default defineComponent({
  name: 'ExitBtn',
  props: {
    target:String
  },
  methods: {
    close() {
      var payload:ManageScreenEvent = {
        target: this.target,
        state: false
      }
      this.$root.$emit("manage-screen", payload);
    }
  }
});
</script>
