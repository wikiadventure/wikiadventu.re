<template>
  <q-input
    name="round" outlined hint="" type="number"
    v-model="round" :min="1" :max="50" label="Round"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts">
import { round } from 'store/connect/extra/state';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RoundSelect',
  setup() {
    return {
      round
    }
  }
});
</script>