<template>
  <div>
    <splash-head/>
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
  </div>
</template>
<style scoped>
  .github {
    background: #211F1F;
  }
  .discord {
    background: #7289DA;
  }
  .nano {
    background: #fff;
    color: #4a90e2;
  }
  .github, .discord, .nano {
    box-shadow: 0px 5px 15px 0px rgba(0,0,0,0.5);
    border-radius: 5px;
    margin: 15px;
  }
  .github:active, .discord:active, .nano:active {
    box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.5);
    transform: translateY(2px);
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
import { openURL } from 'quasar'
import SplashHead from 'components/SplashHead.vue';
import ContentPannel from 'components/ContentPannel.vue';
import ContentWrapper from 'components/ContentWrapper.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'MainMenu',
  components: { SplashHead, ContentWrapper, ContentPannel },
  methods: {
    openNewPage: function (url: string) {
      openURL(url);
    }
  }
});
</script>
