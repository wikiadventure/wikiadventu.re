<template>
  <div id="settingTab" class="col">
    <div class="row justify-evenly q-ma-none"><h3>{{ $t('settingTab.settings') }}</h3></div>
    <div class="row justify-evenly"><theme-switch/><fullscreen-switch/></div>
    <lang-switch/>
    <volume-slider/>
  </div>
</template>
<style lang="scss">
#settingTab>* {
  margin: 15px 5px;
}
</style>
<script lang="ts">
import ThemeSwitch from '../../../components/setting/ThemeSwitch.vue';
import LangSwitch from '../../../components/setting/LangSwitch.vue';
import VolumeSlider from '../../../components/setting/VolumeSlider.vue';
import FullscreenSwitch from '../../../components/setting/FullscreenSwitch.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SettingTabPanel',
  components: { ThemeSwitch, LangSwitch, VolumeSlider, FullscreenSwitch },
  data() {
    return {
    }
  }
});
</script>
