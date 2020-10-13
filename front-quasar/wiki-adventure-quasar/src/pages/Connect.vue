<template>
  <div>
    <splash-head>
      <div class="row justify-center">
        <s-btn to="#publicJoin">Join a public lobby</s-btn>
        <s-btn to="#privateCreate">Create a private lobby</s-btn>
        <s-btn to="#privateJoin">Join a private lobby</s-btn>
      </div>
      <div class="q-mt-md">
        <s-btn class="twitch-btn" to="#twitchCreate" icon-right="mdi-twitch">Create a Twitch lobby</s-btn>
        <s-btn class="twitch-btn" to="#twitchJoin" icon-right="mdi-twitch">Join a Twitch lobby</s-btn>
      </div>
    </splash-head>
    <content-wrapper>
      <content-pannel id="publicJoin" head="Join a public lobby">
        <q-form>
        <div class="row">
          <div class="col">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
          </div>
          <div class="col">
            <div class="row justify-center">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
              </p>
            </div>
            <div class="row justify-center">
              <submit-button name="type" value="publicJoin" icon-right="mdi-play" class="row items-center" label="Join" @click="login('publicJoin')"/> 
            </div>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="privateCreate" head="Create a private lobby">
        <q-form>
        <div class="row">
          <div class="col">
            <div class="row justify-center">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
              </p>
            </div>
            <div class="row justify-center">
              <submit-button name="type" value="privateCreate" icon-right="mdi-plus" class="row items-center" label="Create" @click="login('privateCreate')"/> 
            </div>
          </div>
          <div class="col">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="privateJoin" head="Join a private lobby">
        <q-form>
        <div class="row">
          <div class="col">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
          <div class="col">
            <div class="row justify-center">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
              </p>
            </div>
            <div class="row justify-center">
              <submit-button name="type" value="privateJoin" icon-right="mdi-play" class="row items-center" label="Join" @click="login('privateJoin')"/> 
            </div>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="twitchCreate" head="Create a Twitch lobby">
        <q-form>
        <div class="row">
          <div class="col">
            <div class="row justify-center">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
              </p>
            </div>
            <div class="row justify-center">
              <submit-button name="type" value="twitchCreate" icon-right="mdi-twitch" class="row items-center" label="Create with twitch" @click="login('twitchCreate')"/> 
            </div>
          </div>
          <div class="col">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="twitchJoin" head="Join a Twitch lobby">
        <q-form>
        <div class="row">
          <div class="col">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
          <div class="col">
            <div class="row justify-center">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat optio, tempora dolorem neque odio 
                voluptates dolor perspiciatis est rerum, minima cum, eos alias sapiente nobis porro consequuntur? 
                Quibusdam, voluptates nulla.
              </p>
            </div>
            <div class="row justify-evenly">
              <submit-button name="type" value="twitchJoinWith" icon-right="mdi-twitch" class="row items-center" label="Join with Twitch" @click="login('twitchJoinWith')"/>
              <submit-button name="type" value="twitchJoinWithout" icon-right="mdi-play" class="row items-center" label="Join" @click="login('twitchJoinWithout')"/> 
            </div>
          </div>
        </div>
        </q-form>
      </content-pannel>
    </content-wrapper>
  </div>
</template>
<style>
.body--light .odd-select-popup {
  background: var(--q-color-light-teal);
  color: var(--q-color-almost-black);
}
.twitch-btn {
  background: #6441A4 !important;
}
</style>

<script lang="ts">
import { uuid } from 'vue-uuid'; 
import { openURL } from 'quasar';

import SplashHead from 'components/SplashHead.vue';
import SBtn from "components/SplashButton.vue";

import ContentWrapper from 'components/ContentWrapper.vue';
import ContentPannel from 'components/ContentPannel.vue';

import LangSelect from "components/form/LanguageSelect.vue";
import PseudoInput from "components/form/PseudoInput.vue";
import PasswordInput from "components/form/PasswordInput.vue";
import SubmitButton from "components/form/SubmitButton.vue";

import { defineComponent } from '@vue/composition-api';
import { Lang } from '../store/globalForm/state';

export default defineComponent({
  name: 'Connect',
  components: { SplashHead, SBtn, LangSelect, PseudoInput, PasswordInput, SubmitButton, ContentWrapper, ContentPannel },
  methods: {
    login(type:string) {
      var query:loginQuery = {
        type: type,
        lang: this.$store.state.globalForm.lang,
        pseudo: this.$store.state.globalForm.pseudo
      }
      if (type != "publicJoin") {
        var id = ("twitchJoinWith" || "twitchJoinWithout") ? "twitchJoin" : type;
        query.password = document.querySelector<HTMLInputElement>("#" + id + " input[name='password']")!.value;
      }
      if (type == "twitchJoinWith" || type == "twitchCreate") {
        console.log("twitch login");
        var uid = uuid.v4();
        var twitch = window.open("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=qjfynifqiehclsandzhh3hvhaacqaa&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Ftwitch&state=" + uid + "&scope=chat%3Aread+chat%3Aedit");
        var loop = setInterval(function(){ if (twitch.closed) {clearInterval(loop);console.log("yes closed")} }, 1000);
        /*fetch('/connect').then(function(response) {
          if(response.ok) {
            response.json().then(function(json) {
              
            });
          } else {
            console.log('Mauvaise réponse du réseau');
          }
        }).catch(function(error) {
          console.log('Fetch error during form submition : ' + error.message);
        });*/
      } else {
        var myInit = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(query)
        };
      }
    }
  }
});
interface loginQuery {
  type: string;
  lang:Lang;
  pseudo:string;
  password?:string,
}
</script>

