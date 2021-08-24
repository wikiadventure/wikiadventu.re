<template>
  <q-item>
    <q-item-section avatar>
      <q-btn round dense flat :icon=" mute ? 'mdi-volume-off' : 'mdi-volume-high'" class="chatSubmit" @click="mute = !mute"/>

    </q-item-section>
    <q-item-section>
      <q-slider v-model="volume" :min="0" :step="0" :max="1" />
    </q-item-section>
  </q-item>
</template>
<style lang="scss">

</style>
<script lang="ts">
import { settingSetup } from 'store/setting';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VolumeSlider',
  setup() {
    var {
       volume,
       mute
    } = settingSetup();

    return {
      volume,
      mute
    }
  }
});
</script>