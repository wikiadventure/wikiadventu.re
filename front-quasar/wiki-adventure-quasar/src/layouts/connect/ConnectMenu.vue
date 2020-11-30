<template>
  <q-layout class="tabMenu">
    <div class="tabPanel">
      <q-tab-panels class="tabContent" v-model="tab" animated swipeable infinite>
        <q-tab-panel name="home" class="q-pa-none tabContent scroll-y">
          <index></index>
        </q-tab-panel>
        
        <q-tab-panel name="PublicJoin" class="q-pa-none tabContent scroll-y">
          <public-join></public-join>
        </q-tab-panel>

        <q-tab-panel name="private" class="q-pa-none tabContent">
          <q-tab-panels class="tabContent" v-model="privateTab" animated>
            <q-tab-panel name="PrivateJoin" class="q-pa-none tabContent scroll-y">
              <private-join></private-join>
            </q-tab-panel>

            <q-tab-panel name="PrivateCreate" class="q-pa-none tabContent scroll-y">
              <private-create></private-create>
            </q-tab-panel>
          </q-tab-panels>
          <q-tabs v-model="privateTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
            <q-tab :label="$q.screen.lt.sm ? '' : 'Join' " name="PrivateJoin" icon="mdi-account-arrow-right"></q-tab>
            <q-tab :label="$q.screen.lt.sm ? '' : 'Create' " name="PrivateCreate" icon="mdi-account-edit"></q-tab>
          </q-tabs>
        </q-tab-panel>

        <q-tab-panel name="twitch" class="q-pa-none tabContent">
          <q-tab-panels class="tabContent" v-model="twitchTab" animated>
            <q-tab-panel name="TwitchJoin" class="q-pa-none tabContent scroll-y">
              <twitch-join></twitch-join>
            </q-tab-panel>

            <q-tab-panel name="TwitchCreate" class="q-pa-none tabContent scroll-y">
              <twitch-create></twitch-create>
            </q-tab-panel>
          </q-tab-panels>
          <q-tabs v-model="twitchTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
            <q-tab class="twitchTab" :label="$q.screen.lt.sm ? '' : 'Join' " name="TwitchJoin" icon="svguse:icons/twitch.svg#join"></q-tab>
            <q-tab class="twitchTab" :label="$q.screen.lt.sm ? '' : 'Create' " name="TwitchCreate" icon="svguse:icons/twitch.svg#create"></q-tab>
          </q-tabs>
        </q-tab-panel>
      </q-tab-panels>

      <q-separator></q-separator>

      <q-tabs v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
        <q-tab :label="$q.screen.lt.md ? '' : 'Home' " name="home" icon="mdi-home"></q-tab>
        <q-tab :label="$q.screen.lt.md ? '' : 'Public lobby' " name="PublicJoin" icon="mdi-earth"></q-tab>
        <q-tab :label="$q.screen.lt.md ? '' : 'Private lobby' " name="private" icon="mdi-lock"></q-tab>
        <q-tab class="twitchTab" :label="$q.screen.lt.md ? '' : 'Twitch lobby' " name="twitch" icon="mdi-twitch"></q-tab>
<!--    <q-tab name="PrivateJoin" icon="mdi-account-arrow-right"></q-tab>
        <q-tab name="PrivateCreate" icon="mdi-account-edit"></q-tab>
        <q-tab name="twitchJoin" icon="svguse:icons/twitch.svg#join"></q-tab>
        <q-tab name="twitchCreate" icon="svguse:icons/twitch.svg#create"></q-tab> 
-->
      </q-tabs>
      </div>
  </q-layout>
</template>
<style lang="scss">
.tabMenu {
  display: flex;
  flex-flow: column;
  min-height: 100%;
  overflow: hidden;
  .tabPanel {
    height: 100%;
    width: 100%;
    position: absolute;
    bottom: 0;
  }
  .tabContent, .tabContent .q-panel, .tabPanel {
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-flow: column;
  }
  .scroll-y {
    overflow-y: scroll;
  }
  .q-tabs {
    flex: 0 1 36px;
  }
}
.q-tab--active.twitchTab, .twitchTab .q-tab__indicator {
  color: #6441A4!important;
}
</style>
<script lang="ts">
import { uuid } from 'vue-uuid'; 
import PrivateCreate from "./tab/PrivateCreate.vue";
import PrivateJoin from "./tab/PrivateJoin.vue";
import PublicJoin from "./tab/PublicJoin.vue";
import TwitchCreate from "./tab/TwitchCreate.vue";
import TwitchJoin from "./tab/TwitchJoin.vue";

import Index from "../../layouts/menu/Index.vue";

import { defineComponent } from '@vue/composition-api';
import { ConnectEvent, ConnectType } from "../../mixins/connectEvent";
import { LobbyType } from "../../store/gameData/state";
import { Lang } from '../../i18n';

export default defineComponent({
  name: 'ConnectMenu',
  components: { PrivateCreate, PrivateJoin, PublicJoin, TwitchCreate, TwitchJoin, Index },
  data():{
    tab:string,
    privateTab:string,
    twitchTab:string
  } {
    return {
      tab: 'home',
      privateTab: 'PrivateJoin',
      twitchTab: 'TwitchJoin'
    }
  },
  methods: {
    login(event:ConnectEvent) {
      var store = this.$store;
      var router = this.$router;
      this.$store.dispatch('globalForm/validatePseudo');
      var query:loginQuery = {
        type: event.type,
        lang: this.$store.state.globalForm.lang,
        pseudo: this.$store.state.globalForm.pseudo
      }
      if (event.type != ConnectType.PublicJoin) {
        query.password = event.password;
      }
      if (event.type == ConnectType.TwitchJoinWith || event.type == ConnectType.TwitchCreate) {
        console.log("twitch login");
        query.uuid = uuid.v4();
        var twitch = window.open("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=qjfynifqiehclsandzhh3hvhaacqaa&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Ftwitch&state=" + query.uuid + "&scope=chat%3Aread+chat%3Aedit");
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
          fetch('/api/twitch', options)
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
        fetch('/api/connect', options)
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
    }
  },
  mounted() {
    this.$root.$on('submit-form', this.login);
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
