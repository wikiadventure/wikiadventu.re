<template>
  <div class="setting-tab">
    <div class="span2 text-h3 q-py-lg">{{ t('settingTab.settings') }}</div>
    <fullscreen-switch class="action-btn"/> <theme-switch/>
    <p class="q-ma-none">SafeMode : </p>    <safe-mode-switch/>
              <lang-switch class="span2 strech"/>
              <volume-slider class="span2 strech"/>
    <shortcut-btn/>
  </div>
</template>
<style lang="scss">
.setting-tab {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 15px;
  padding: 15px;
  place-items: center;
  .action-btn {
    padding: 5px;
  }
  .span2 {
  grid-column: span 2;
  }
  .strech {
    place-self: stretch;
  }
}
</style>
<script lang="ts">
import ThemeSwitch from 'src/components/setting/ThemeSwitch.vue';
import LangSwitch from 'src/components/setting/LangSwitch.vue';
import VolumeSlider from 'src/components/setting/VolumeSlider.vue';
import FullscreenSwitch from 'src/components/setting/FullscreenSwitch.vue';
import SafeModeSwitch from 'src/components/setting/SafeModeSwitch.vue';
import ShortcutBtn from 'src/components/setting/ShortcutButton.vue';

import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'SettingTab',
  components: { ThemeSwitch, LangSwitch, VolumeSlider, FullscreenSwitch, SafeModeSwitch, ShortcutBtn },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
      t
    }
  }
});
</script>
