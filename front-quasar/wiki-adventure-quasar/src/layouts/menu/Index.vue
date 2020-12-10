<template>
  <div class="main-menu-index">
    <logo-show-in class="absolute" title="Wiki Adventure"></logo-show-in>
    <compact-lang-switch class="testing2" />
    <theme-switch class="testing3" />
    <div class="skewLineContainer first"><div class="skewLine"></div></div>
    <div class="row wrapper first">
      <content-pannel id="HowToPlay" head="Play">
        <div class="col">
          <p>
            The goal is simple, you need to go as fast as 
            possible from the start page to the end page, but you can only navigate 
            with the link on the wikipedia page.
            During the voting phase you can suggest your wikipedia page title in the swipe menu.
            At the end of the voting phase the server will randomly pick a start page 
            and an end page and the game will begin.
          </p>
        </div>
      </content-pannel>
      <div class="skewLineContainer second"><div class="skewLine"></div></div>
      <div class="wrapper second">
        <content-pannel id="News" head="News">
          <div class="col">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur veniam placeat qui facilis neque, beatae nihil unde aliquid ipsam incidunt itaque repudiandae nisi animi vel cupiditate nostrum impedit? Commodi, pariatur! Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eum, magni optio, nihil ex sapiente distinctio reprehenderit nulla dolore repellendus saepe qui consequuntur nesciunt assumenda earum vitae repellat libero? Ratione!</p>
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
                <p>{{ $t('contributionSection.nano') }}</p>  
                <q-btn push icon="img:icons/kofi.svg" class="kofi" size="xl" label="Ko-fi" @click="openNewPage('https://ko-fi.com/sacramentix')"/>
              </div>
              <div class="q-ma-xs">
                <p>{{ $t('contributionSection.nano') }}</p>
                <q-btn push icon="img:https://cryptologos.cc/logos/nano-nano-logo.svg?v=006" class="nano" size="xl" label="Nano" @click="openNewPage('https://nano.org')" />
              </div>
            </div>
          </content-pannel>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.testing2 {
  position: absolute;
  left: 2px;
  top: 2px;
}
.testing3 {
  position: absolute;
  right: 2px;
  top: 2px;
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
  border-top: 1px solid var(--w-color-blue-white);
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
  color: var(--w-color-dark-teal);
}
#News {
  color: var(--w-color-blue-white);
}
.github {
  background: #000;
  color: var(--w-color-blue-white);
}
.discord {
  background: #7289DA;
  color: var(--w-color-blue-white);
}
.kofi {
  background: #29abe0;
  color: var(--w-color-blue-white);
}
.nano {
  background: var(--w-color-blue-white);
  color: #4a90e2;
}
.github, .discord, .nano, .kofi {
  border-radius: 5px;
  margin: 0 15px 5px;
}
.body--dark {
  #HowToPlay, #Contribution{
    color: var(--w-color-dark-teal);
  }
  #News {
    color: var(--w-color-blue-white);
  }
  .skewLineContainer.first {
    .skewLine {
      background: var(--w-color-dark-blue);
    }
  }
  .skewLineContainer.second {
    .skewLine {
      background: var(--w-color-almost-black);
    }
  }
  .skewLineContainer.third {
    .skewLine {
      background: var(--w-color-dark-blue);
    }
  }
  .wrapper.first, .wrapper.third {
    background: var(--w-color-dark-blue);
  }
  .wrapper.second {
    background: var(--w-color-almost-black);
  }
  .skewLine {
    box-shadow: 0 0 50px rgba(18, 230, 238, 1);
  }
}
.body--light {
  #HowToPlay, #Contribution{
    color: var(--w-color-dark-blue);
  }
  #News {
    color: var(--w-color-almost-black);
  }
  .skewLineContainer.first {
    .skewLine {
      background: var(--w-color-light-teal);
    }
  }
  .skewLineContainer.second {
    .skewLine {
      background: var(--w-color-blue-white);
    }
  }
  .skewLineContainer.third {
    .skewLine {
      background: var(--w-color-light-teal);
    }
  }
  .wrapper.first, .wrapper.third {
    background: var(--w-color-light-teal);
  }
  .wrapper.second {
    background: var(--w-color-blue-white);
  }
  .skewLine {
    box-shadow: 0 0 50px rgb(3, 151, 157);
  }
}
</style>
<script lang="ts">
import { openURL } from 'quasar';

import ContentPannel from '../../components/ContentPannel.vue';
import CompactLangSwitch from '../../components/setting/CompactLangSwitch.vue';
import ThemeSwitch from '../../components/setting/ThemeSwitch.vue'
import LogoShowIn from '../../components/art/LogoShowIn.vue';

import scrollToID from '../../mixins/scrollToID';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Index',
  components: { ContentPannel, LogoShowIn, CompactLangSwitch, ThemeSwitch },
  methods: {
    
    CompactLangSwitchopenNewPage: function (url: string) {
      openURL(url);
    },
    scrollToID(id:string) {
      scrollToID(id);
    }
  }
});
</script>
