<template>
  <div id="settingTab">
      <div class="row"><h3 class="row text-center">Setting</h3></div>
      <theme-switch/>
      <lang-switch/>
      <volume-slider/>
  </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import ThemeSwitch from '../../../components/setting/ThemeSwitch.vue';
import LangSwitch from '../../../components/setting/LangSwitch.vue';
import VolumeSlider from '../../../components/setting/VolumeSlider.vue'

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SettingTabPanel',
  components: { ThemeSwitch, LangSwitch, VolumeSlider },
  data() {
    return {
    }
  }
});
</script>
