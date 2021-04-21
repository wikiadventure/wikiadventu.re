<template>
  <div id="settingTab">
    <div class="row justify-evenly text-h3">{{ $t('settingTab.settings') }}</div>
    <div class="row justify-evenly"><fullscreen-switch class="action-btn"/><theme-switch/></div>
    <div class="row justify-evenly items-end"><p>SafeMode : </p><safe-mode-switch/></div>
    <lang-switch/>
    <volume-slider/>
  </div>
</template>
<style lang="scss">
#settingTab>* {
  margin: 25px 5px;
}
</style>
<script lang="ts">
import ThemeSwitch from 'src/components/setting/ThemeSwitch.vue';
import LangSwitch from 'src/components/setting/LangSwitch.vue';
import VolumeSlider from 'src/components/setting/VolumeSlider.vue';
import FullscreenSwitch from 'src/components/setting/FullscreenSwitch.vue';
import SafeModeSwitch from 'src/components/setting/SafeModeSwitch.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SettingTab',
  components: { ThemeSwitch, LangSwitch, VolumeSlider, FullscreenSwitch, SafeModeSwitch }
});
</script>
