<template>
  <q-input
    name="voteDuration" outlined hint="" type="number" shadow-text="s" class="reveal-shadow-text"
    v-model="voteDuration" :min="0" :max="3600" label="Vote phase duration in secondes"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts">
import { voteDuration } from 'store/connect/extra/state';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VoteDurationSelect',
  setup() {
    return {
      voteDuration
    }
  }
});
</script>