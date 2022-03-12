<template>
  <q-item class="volume-slider">
    <q-item-section avatar>
      <q-btn round dense flat :icon=" mute ? 'mdi-volume-off' : 'mdi-volume-high'" class="chatSubmit" @click="mute = !mute"/>

    </q-item-section>
    <q-item-section>
      <q-slider v-model="volume" :min="0" :step="0" :max="1" />
    </q-item-section>
  </q-item>
</template>
<style lang="scss">
.volume-slider {
  .q-slider {
    color: var(--clr-accent);
  }
}
</style>
<script lang="ts" setup>
import { settingSetup } from 'store/setting';

const {
  volume,
  mute
} = settingSetup();
</script>