<template>
  <q-input
    name="slot" outlined hint="" type="number"
    v-model="slot" :min="2" :max="50" label="Slot"
    :dense="$q.screen.lt.sm" v-bind="$attrs">
  </q-input>
</template>
<script lang="ts" setup>
import { slot } from 'store/connect/state';
</script>