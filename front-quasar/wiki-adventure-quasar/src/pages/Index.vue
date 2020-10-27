<template>
  <div>
    <splash-head>
      <div class="row justify-center">
        <s-btn @click="scrollToID('News')">News</s-btn>
        <s-btn @click="scrollToID('HowToPlay')">How to play</s-btn>
        <s-btn @click="scrollToID('Contribution')">Contribution</s-btn>
      </div>
      <div class="q-mt-md">
        <s-btn to="/connect" class="neon-btn">Play</s-btn>
      </div>
    </splash-head>
    <content-wrapper>
      <content-pannel id="News" head="News">
        <div class="col">
          <p>Welcome to the beta 1.0 of the game</p>
        </div>
      </content-pannel>
      <content-pannel id="HowToPlay" head="How to play">
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
      <content-pannel id="Contribution" head="Contribution">
        <div class="column items-center">
          <p class="col">The game is open source. If you are a dev you can contribute to the project on <q-btn icon="mdi-github" class="github" size="xl" label="Github" @click="openNewPage('https://github.com/Sacramentix/WikiAdventure')"></q-btn></p>
        </div>
        <div class="column items-center">
          <p class="col">Join the community on our discord ! <q-btn icon="mdi-discord" class="discord" size="xl" label="Wiki Adventure Discord" @click="openNewPage('https://discord.gg/wRN6Dam')" ></q-btn></p>
        </div>
        <div class="row items-center">
          <p class="col">You can also support the project by giving some<q-btn icon="img:https://cryptologos.cc/logos/nano-nano-logo.svg?v=006" class="nano" size="xl" label="Nano" @click="openNewPage('https://nano.org')" ></q-btn></p>
          <p class="col">Here is my address : nano_3tobgnzzk9dgktg7gwiq94rwqcooeihgp8oz6s31xak798mgtgmn881t58cq</p>  
        </div>
        <div class="column items-center">
          <q-card class="QRcode col">
            <q-card-section>
              <img src="~assets/image/QRcodeNano.png" alt="nano wallet QR code"/>
            </q-card-section>
          </q-card>
        </div>
      </content-pannel>
    </content-wrapper>
    <menu-layout/>
  </div>
</template>
<style>
  .neon-btn {
      font-size: 200% !important;
      padding: 0em 2em;
      border-radius: 5px;
  }
    .body--dark .neon-btn {
      border: 1px solid #18a1c4;
      box-shadow: 3px 3px 5px rgba(0,0,0,0.75), 0 0 7px #18a1c4, 0 0 7px #18a1c4 inset !important;
    }
    .body--light .neon-btn {
      border: 1px solid #18a1c4;
      box-shadow: 0 0 15px 5px #77c1f6 , 0 0 15px #77c1f6  inset !important;
    }
    .neon-btn .q-ripple {
      color: #18a1c4;
    }

  .github {
    background: #000;
    color: var(--w-color-blue-white);
  }
  .discord {
    background: #7289DA;
    color: var(--w-color-blue-white);
  }
  .nano {
    background: var(--w-color-blue-white);
    color: #4a90e2;
  }
  .github, .discord, .nano {
    border-radius: 5px;
    margin: 15px;
  }
  .QRcode {
    width: 30%;
    max-width: 75vh;
    line-height: 0;
  }
  .QRcode img {
    width: 100%;
    image-rendering: pixelated;
  }
</style>

<script lang="ts">
import { openURL } from 'quasar';
import SplashHead from 'components/SplashHead.vue';
import SBtn from "components/SplashButton.vue";
import ContentWrapper from 'components/ContentWrapper.vue';
import ContentPannel from 'components/ContentPannel.vue';
import MenuLayout from "layouts/Menu.vue";

import scrollToID from '../mixins/scrollToID';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Index',
  components: { SplashHead, SBtn, ContentWrapper, ContentPannel, MenuLayout },
  methods: {
    openNewPage: function (url: string) {
      openURL(url);
    },
    scrollToID(id:string) {
      scrollToID(id);
    }
  }
});
</script>
