<template>
  <div id="settingTab" class="col">
    <div class="row justify-evenly q-ma-none"><h3>{{ $t('settingTab.settings') }}</h3></div>
    <div class="row justify-evenly"><fullscreen-switch class="action-btn"/><theme-switch/></div>
    <div class="row justify-evenly items-end"><p>SafeMode : </p><safe-mode-switch/></div>
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
import SafeModeSwitch from '../../../components/setting/SafeModeSwitch.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SettingTabPanel',
  components: { ThemeSwitch, LangSwitch, VolumeSlider, FullscreenSwitch, SafeModeSwitch }
});
</script>
