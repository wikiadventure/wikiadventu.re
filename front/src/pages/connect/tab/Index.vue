<template>
  <div class="main-menu-index">
    <logo-show-in class="absolute" ></logo-show-in>
    <compact-lang-switch class="topLeft text-uppercase" />
    <theme-switch class="topRight" />
    <div class="skewLineContainer first"><div class="skewLine"></div></div>
    <div class="row wrapper first">
      <content-pannel id="HowToPlay" :head="t('howToPlay.title')">
        <div class="col">
          <p>
            {{ t('howToPlay.content') }}
          </p>
        </div>
      </content-pannel>
      <div class="skewLineContainer second"><div class="skewLine"></div></div>
      <div class="wrapper second">
        <content-pannel id="News" :head="t('news.title')">
          <div class="col">
            <p>{{ t('news.content') }}</p>
          </div>
        </content-pannel>
        <div class="skewLineContainer third"><div class="skewLine"></div></div>
        <div class="wrapper third">
          <content-pannel id="Contribution" head="Contribution">
            <div class="q-ma-xs">
              <p>{{ t('contribution.discord') }}</p>
              <q-btn push icon="mdi-discord" class="discord" size="xl" label="discord" @click="openURL('https://discord.gg/wRN6Dam')" />
            </div>
            <div class="q-ma-xs">
              <p>{{ t('contribution.github') }}</p>
              <q-btn push icon="mdi-github" class="github" size="xl" label="Github" @click="openURL('https://github.com/Sacramentix/WikiAdventure')"/>
            </div>
            <div class="q-ma-xs">
              <p>{{ t('contribution.kofi') }}</p>  
              <q-btn push :icon="'img:'+require('assets/icons/kofi.svg')" class="kofi" size="xl" label="Ko-fi" @click="openURL('https://ko-fi.com/sacramentix')"/>
            </div>
            <div class="q-ma-xs">
              <p>{{ t('contribution.nano') }}</p>
              <q-btn push :icon="'img:'+require('assets/icons/nano.svg')" class="nano" size="xl" label="Nano" @click="showNano = true" />
            </div>
            <wallet-dialog v-model="showNano"/>
          </content-pannel>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
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
  .skewLineContainer {
    overflow: hidden;
    position: relative;
    width: 100%;
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
    left: -2%;
    width: 104%;
    height: 50em;
    border-top: 1px solid #fff;
    transform-origin: top left;
    transform: skewY(var(--w-angle));
  }
  .wrapper {
    position: relative;
    top: -1px;
    width: 100%;
  }
  #HowToPlay, #News, #Contribution {
    display: inline-block; // To force a new block formatting context
    margin-top: -3vmin;
    @media screen and (max-width: 600px) {
      //margin-top: 0;
    }
  }
  #Contribution {
    pointer-events: all;
    .content-pannel-core {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 15px;
      gap: 15px;
      &>div {
        flex: 0 0;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .q-btn__content {
          flex-wrap: nowrap;
          white-space: nowrap;
        }
      }
    }
  }
  .github {
    background: #000;
    color: var(--clr-light);
  }
  .discord {
    background: #7289DA;
    color: var(--clr-light);
  }
  .kofi {
    background: #29abe0;
    color: #fff;
  }
  .nano {
    background: #fff;
    color: #4a90e2;
  }
  .github, .discord, .nano, .kofi {
    margin: 0 15px 5px;
    border-radius: 5px;
  }

  .wrapper.second, .skewLineContainer.second .skewLine {
    background: var(--clr-alt);
    color: var(--clr-contrast);
  }

  .wrapper.first, .wrapper.third, 
  .skewLineContainer.first .skewLine, 
  .skewLineContainer.third .skewLine {
    background: var(--clr-main);
    color: var(--clr-reverse);
  }
  .skewLine {
    box-shadow: 0 0 50px rgba(18, 230, 238, 1);
  }

}
.body--dark {
  .main-menu-index {
    background: radial-gradient(circle, #000 0%, #222 100%) fixed;
  }

}
.body--light {
  .main-menu-index {
    background: radial-gradient(circle, #99fcff 0%, var(--clr-main) 75%) fixed;
  }
}
</style>
<script lang="ts" setup>
import { openURL } from 'quasar';
import ContentPannel from 'src/components/ContentPannel.vue';
import CompactLangSwitch from 'src/components/setting/CompactLangSwitch.vue';
import ThemeSwitch from 'src/components/setting/ThemeSwitch.vue'
import LogoShowIn from 'src/components/art/LogoShowIn.vue';
import WalletDialog from 'src/components/nano/WalletDialog.vue'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
const showNano = ref(false);
</script>
<i18n lang="yaml">
  en:
    howToPlay:
      title: "How to play?"
      content: | 
        The game is really simple, you need to go as fast as possible from one page to another one, 
        but you can only navigate with the link on the Wikipedia page. During the voting phase 
        you can suggest Wikipedia page title. At the end of the voting phase the game will randomly 
        pick a start page and an end page and the game will begin.
    news:
      title: "News"
      content: "beta"
    contribution:
      discord: "Find friends to play with on our Discord"
      github: "Contribute to the game"
      kofi: "Buy me a coffee"
      nano: "Share your Nano with me !"
      
  fr:
    howToPlay:
      title: "Comment jouer?"
      content: | 
        Le jeu est simple, il faut aller le plus vite possible d'une page à l'autre, 
        mais on ne peut naviguer qu'avec les liens sur la page Wikipédia de départ. 
        Pendant la phase de vote, vous pouvez suggérer le titre de la page Wikipedia de départ ou d'arrivée. 
        À la fin de la phase de vote, le jeu choisira au hasard une page de démarrage et une page de fin et le jeu commencera.
    news:
      title: "News"
      content: "beta"
    contribution:
      discord: "Trouve des joueurs sur notre Discord"
      github: "Apporte ta pierre à l'édifice grâce à Github"
      kofi: "Offre moi un café"
      nano: "Partage tes Nano avec moi"
</i18n>