<template>
  <q-tab-panel name="setting" class="setting-tab">
    <div class="span2 text-h3 q-py-lg">{{ t('settings') }}</div>

    <fullscreen-switch class="action-btn"/> <theme-switch/>

    <div class="safemodeblock span2 strech">
      <label for="safemodeswitch">SafeMode : </label>    <safe-mode-switch id="safemodeswitch"/>  
    </div>

              <lang-switch class="span2 strech"/>
              <volume-slider class="span2 strech"/>
    <shortcut-btn/>
  </q-tab-panel>
</template>
<style lang="scss">
.setting-tab {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 15px;
  overflow-y: auto;
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
  .safemodeblock {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
}
</style>
<script lang="ts" setup>
import ThemeSwitch from 'src/components/setting/ThemeSwitch.vue';
import LangSwitch from 'src/components/setting/LangSwitch.vue';
import VolumeSlider from 'src/components/setting/VolumeSlider.vue';
import FullscreenSwitch from 'src/components/setting/FullscreenSwitch.vue';
import SafeModeSwitch from 'src/components/setting/SafeModeSwitch.vue';
import ShortcutBtn from 'src/components/setting/ShortcutButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    settings: "Settings"
  
  fr:
    settings: "Paramètres"
</i18n>
