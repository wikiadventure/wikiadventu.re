<template>
  <div class="main-menu-index">
    <logo-show-in class="absolute" ></logo-show-in>
    <compact-lang-switch class="topLeft text-uppercase" />
    <theme-switch class="topRight" />
    <div class="skewLineContainer first"><div class="skewLine"></div></div>
    <div class="row wrapper first">
      <content-pannel id="HowToPlay" :head="$t('indexHowToPlay.title')">
        <div class="col">
          <p>
            {{ $t('indexHowToPlay.content') }}
          </p>
        </div>
      </content-pannel>
      <div class="skewLineContainer second"><div class="skewLine"></div></div>
      <div class="wrapper second">
        <content-pannel id="News" :head="$t('news')">
          <div class="col">
            <p>{{ $t('newsContent') }}</p>
          </div>
        </content-pannel>
        <div class="skewLineContainer third"><div class="skewLine"></div></div>
        <div class="wrapper third">
          <content-pannel id="Contribution" head="Contribution">
            <div class="row justify-evenly">
              <div class="q-ma-xs">
                <p>{{ $t('contributionSection.discord') }}</p>
                <q-btn push icon="mdi-discord" class="discord" size="xl" label="discord" @click="openNewPage('https://discord.gg/wRN6Dam')" />
              </div>
              <div class="q-ma-xs">
                <p>{{ $t('contributionSection.github') }}</p>
                <q-btn push icon="mdi-github" class="github" size="xl" label="Github" @click="openNewPage('https://github.com/Sacramentix/WikiAdventure')"/>
              </div>
              <div class="q-ma-xs">
                <p>{{ $t('contributionSection.kofi') }}</p>  
                <q-btn push icon="img:icons/kofi.svg" class="kofi" size="xl" label="Ko-fi" @click="openNewPage('https://ko-fi.com/sacramentix')"/>
              </div>
              <div class="q-ma-xs">
                <p>{{ $t('contributionSection.nano') }}</p>
                <q-btn push icon="img:https://cryptologos.cc/logos/nano-nano-logo.svg?v=006" class="nano" size="xl" label="Nano" @click="showNano = true" />
              </div>
              <wallet-dialog v-model="showNano"/>
            </div>
          </content-pannel>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.topLeft, .topRight {
  position: absolute;
  top: 2px;
}
.topLeft {
  left: 2px;
}
.topRight {
  right: 15px;
}
.main-menu-index {
  --w-angle: -5deg;
  --w-slope-ratio: 11.66vw;
  pointer-events: all;
  .first {
    z-index: 3;
    pointer-events: none;
  }
  .logo-show-in {
    pointer-events: none;
  }
}
.skewLineContainer {
  position: relative;
  overflow: hidden;
  width: 100%;
  top: 0;
}
.skewLineContainer.first {
  height: calc(65vmin + var(--w-slope-ratio) + 5px);
  .skewLine {
    top: calc(65vmin + var(--w-slope-ratio));
  }
}

.skewLineContainer.second {
  height: calc(var(--w-slope-ratio) + 55px);
  margin-top: -50px;
  .skewLine {
    top: calc(var(--w-slope-ratio) + 50px );
  }
}
.skewLineContainer.third {
  height: calc(var(--w-slope-ratio) + 55px);
  margin-top: -50px;
  .skewLine {
    top: calc(var(--w-slope-ratio) + 50px );
  }
}
.skewLine {
  position: absolute;
  transform-origin: top left;
  border-top: 1px solid var(--wa-color-blue-white);
  left: -2%;
  width: 104%;
  height: 50em;
  transform: skewY(var(--w-angle));
  box-shadow: 0 0 50px rgba(18, 230, 238, 0.54);
}
.wrapper {
  position: relative;
  top: -1px;
  width: 100%;
}
#HowToPlay, #News, #Contribution {
  display: inline-block; // To force a new block formatting context
  margin-top: -3.7vmax;
  @media screen and (max-width: 600px) {
    margin-top: 0;
  }
}
#HowToPlay, #Contribution{
  color: $wa-4;
}
#News {
  color: $wa-3;
}
#Contribution {
  pointer-events: all;
}
.github {
  background: #000;
  color: var(--wa-color-blue-white);
}
.discord {
  background: #7289DA;
  color: var(--wa-color-blue-white);
}
.kofi {
  background: #29abe0;
  color: var(--wa-color-blue-white);
}
.nano {
  background: var(--wa-color-blue-white);
  color: #4a90e2;
}
.github, .discord, .nano, .kofi {
  border-radius: 5px;
  margin: 0 15px 5px;
}
.skewLineContainer.first {
  .skewLine {
    background: $wa-1;
  }
}
.skewLineContainer.second {
  .skewLine {
    background: $wa-2;
  }
}
.skewLineContainer.third {
  .skewLine {
    background: $wa-1;
  }
}
.wrapper.first, .wrapper.third {
  background: $wa-1;
}
.wrapper.second {
  background: $wa-2;
}
.body--dark {
  .skewLine {
    box-shadow: 0 0 50px rgba(18, 230, 238, 1);
  }
}
.body--light {
  .skewLine {
    box-shadow: 0 0 50px rgb(3, 151, 157);
  }
}
</style>
<script lang="ts">
import { openURL } from 'quasar';

import ContentPannel from 'src/components/ContentPannel.vue';
import CompactLangSwitch from 'src/components/setting/CompactLangSwitch.vue';
import ThemeSwitch from 'src/components/setting/ThemeSwitch.vue'
import LogoShowIn from 'src/components/art/LogoShowIn.vue';
import WalletDialog from 'src/components/nano/WalletDialog.vue'

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Index',
  components: { ContentPannel, LogoShowIn, CompactLangSwitch, ThemeSwitch, WalletDialog },
  data():{
    showNano:boolean
  } {
    return {
      showNano: false
    }
  },
  methods: {
    openNewPage(url: string) {
      openURL(url);
    }
  }
});
</script>
