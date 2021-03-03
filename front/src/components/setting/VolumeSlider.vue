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
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'VolumeSlider',
  computed: {
    volume: {
      get() {
        return this.$store.state.gameData.volume;
      },
      set(v:number) {
        this.$store.commit('gameData/volume', v);
      }
    },
    mute: {
      get() {
        return this.$store.state.gameData.mute;
      },
      set(m:number) {
        this.$store.commit('gameData/mute', m);
      }
    }
  }

});
</script>