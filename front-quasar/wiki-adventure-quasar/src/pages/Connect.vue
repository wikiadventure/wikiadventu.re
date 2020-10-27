<template>
  <div>
    <splash-head>
      <div class="vertical-middle justify-evenly">
        <s-btn @click="scrollToID('PublicJoin')">Join public lobby</s-btn>
        <s-btn @click="scrollToID('PrivateCreate')">Create private lobby</s-btn>
        <s-btn @click="scrollToID('PrivateJoin')">Join private lobby</s-btn>
      </div>
      <div class="vertical-middle justify-evenly">
        <s-btn class="twitch-btn" @click="scrollToID('TwitchCreate')" icon-right="mdi-twitch">Create Twitch lobby</s-btn>
        <s-btn class="twitch-btn" @click="scrollToID('TwitchJoin')" icon-right="mdi-twitch">Join Twitch lobby</s-btn>
      </div>
    </splash-head>
    <content-wrapper>
      <content-pannel id="PublicJoin" head="Join a public lobby">
        <q-form>
        <div class="row">
          <div class="col-12 col-sm-6">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
          </div>
          <div class="col-12 col-sm-6 row col-reverse-sm">
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
              <submit-button name="type" value="PublicJoin" icon-right="mdi-play" class="row items-center q-ma-sm" label="Join" @click="login('PublicJoin')"/> 
            </div>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="PrivateCreate" head="Create a private lobby">
        <q-form>
        <div class="row col-reverse-sm">
          <div class="col-12 col-sm-6 row col-reverse-sm">
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
              <submit-button name="type" value="PrivateCreate" icon-right="mdi-plus" class="row items-center q-ma-sm" label="Create" @click="login('PrivateCreate')"/> 
            </div>
          </div>
          <div class="col-12 col-sm-6">
              <lang-select class="q-ma-sm" popup-content-class="even-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="PrivateJoin" head="Join a private lobby">
        <q-form>
        <div class="row">
          <div class="col-12 col-sm-6">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
          <div class="col-12 col-sm-6 row col-reverse-sm">
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
              <submit-button name="type" value="PrivateJoin" icon-right="mdi-play" class="row items-center q-ma-sm" label="Join" @click="login('PrivateJoin')"/> 
            </div>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="TwitchCreate" head="Create a Twitch lobby">
        <q-form>
        <div class="row">
          <div class="col-12 col-sm-6 row col-reverse-sm">
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
              <submit-button name="type" value="TwitchCreate" icon-right="mdi-twitch" class="twitch-btn row items-center q-ma-sm" label="Create with twitch" @click="login('TwitchCreate')"/> 
            </div>
          </div>
          <div class="col-12 col-sm-6">
              <lang-select  class="q-ma-sm" popup-content-class="even-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
        </div>
        </q-form>
      </content-pannel>
      <content-pannel id="TwitchJoin" head="Join a Twitch lobby">
        <q-form>
        <div class="row">
          <div class="col-12 col-sm-6">
              <lang-select class="q-ma-sm" popup-content-class="odd-select-popup"/>
              <pseudo-input class="q-ma-sm"/>
              <password-input class="q-ma-sm"/>
          </div>
          <div class="col-12 col-sm-6 row col-reverse-sm">
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
              <submit-button name="type" value="TwitchJoinWith" icon-right="mdi-twitch" class="twitch-btn row items-center q-ma-sm" label="Join with Twitch" @click="login('TwitchJoinWith')"/>
              <submit-button name="type" value="TwitchJoinWithout" icon-right="mdi-play" class="row items-center q-ma-sm" label="Join" @click="login('TwitchJoinWithout')"/> 
            </div>
          </div>
        </div>
        </q-form>
      </content-pannel>
    </content-wrapper>
    <menu-layout/>
  </div>
</template>
<style>
.test2 {
  flex: 1;
  width: 100%;
}
.body--light .odd-select-popup {
  background: var(--w-color-light-teal);
  color: var(--w-color-almost-black);
}
.body--dark .even-select-popup {
  background: var(--w-color-almost-black);
}

.body--dark .even-select-popup .q-item--dark {
  color: var(--w-color-dark-teal);
}
.twitch-btn {
  background: #6441A4!important;
  color: var(--w-color-blue-white)!important;
}
@media (max-width: 600px) {
  .col-reverse-sm {
    flex-direction: column-reverse;
  }
}
</style>

<script lang="ts">
import { uuid } from 'vue-uuid'; 
import { openURL } from 'quasar';
import Vuex from 'vuex';

import SplashHead from 'components/SplashHead.vue';
import SBtn from "components/SplashButton.vue";

import ContentWrapper from 'components/ContentWrapper.vue';
import ContentPannel from 'components/ContentPannel.vue';

import LangSelect from "components/form/LanguageSelect.vue";
import PseudoInput from "components/form/PseudoInput.vue";
import PasswordInput from "components/form/PasswordInput.vue";
import SubmitButton from "components/form/SubmitButton.vue";
import MenuLayout from "layouts/Menu.vue";

import { defineComponent } from '@vue/composition-api';
import { Lang } from '../store/globalForm/state';

import scrollToID from '../mixins/scrollToID';
import { LobbyType } from '../store/gameData/state';

export default defineComponent({
  name: 'Connect',
  components: { SplashHead, SBtn, LangSelect, PseudoInput, PasswordInput, SubmitButton, ContentWrapper, ContentPannel, MenuLayout },
  methods: {
    login(type:string) {
      var store = this.$store;
      var router = this.$router;
      var query:loginQuery = {
        type: type,
        lang: this.$store.state.globalForm.lang,
        pseudo: this.$store.state.globalForm.pseudo
      }
      if (type != "PublicJoin") {
        var id = ("TwitchJoinWith" || "TwitchJoinWithout") ? "TwitchJoin" : type;
        query.password = document.querySelector<HTMLInputElement>("#" + id + " input[name='password']")!.value;
      }
      if (type == "TwitchJoinWith" || type == "TwitchCreate") {
        console.log("twitch login");
        query.uuid = uuid.v4();
        var twitch = window.open("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=qjfynifqiehclsandzhh3hvhaacqaa&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Ftwitch&state=" + query.uuid + "&scope=chat%3Aread+chat%3Aedit");
        var loop = setInterval(function() { if (twitch && twitch.closed) {
          clearInterval(loop);
          console.log("twitch pop up login closed, proceed to fetch the session uuid");
          /* connect to the server send the login query
          and the uid to prove that you are auth
          and retrieve an uuid to connect to the socket io lobby*/
          var options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
          };
          fetch('/twitch', options)
            .then(function(response:Response):Promise<ConnectionResponse> {
              return response.json();
            }).then(function(json:ConnectionResponse) {
              
            }).catch(function(error) {
              console.log('Fetch error during form submition : ' + error.message);
          });
        }}, 500);// the duration in ms between each call of loop
      } else {
        var options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(query)
        };
        fetch('/connect', options)
          .then(function(response:Response):Promise<ConnectionResponse> {
            return response.json();
          }).then(function(json) {
            store.commit('gameData/setLang', json.lang);
            store.commit('gameData/setLobbyID', json.lobbyID);
            store.commit('gameData/setLobbyType', json.lobbyType);
            store.commit('gameData/setUuid', json.playerID);
            router.push('/play');
            console.log(json);
          }).catch(function(error) {
            console.log('Fetch error during form submition : ' + error.message);
        });
      }
    },
    scrollToID(id:string) {
      scrollToID(id);
    }
  }
});
interface loginQuery {
  type: string;
  lang:Lang;
  pseudo:string;
  password?:string;
  uuid?:string;
}
interface ConnectionResponse {
    status:ConnectionStatus,
    lobbyID:String,
    lobbyType:LobbyType,
    playerID:String,
    lang:Lang,
    error?:String
}
enum ConnectionStatus {
    Success = 'Success',
    ClientError = 'ClientError',
    ServerError = 'ServerError'
}

</script>

