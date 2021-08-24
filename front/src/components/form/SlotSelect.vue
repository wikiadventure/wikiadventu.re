<template>
  <q-input
    name="slot" outlined hint="" type="number"
    v-model="slot" :min="2" :max="50"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts">
import { slot } from 'store/connect/state';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SlotSelect',
  setup() {
    return {
      slot
    }
  }
});
</script>