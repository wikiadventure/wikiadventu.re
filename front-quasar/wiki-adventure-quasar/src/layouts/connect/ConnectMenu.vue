<template>
  <q-layout class="tabMenu">
    <div class="tabPanel">
      <q-tab-panels class="tabContent" v-model="tab" animated swipeable infinite>
        <q-tab-panel name="Home" class="q-pa-none tabContent scroll-y">
          <index></index>
        </q-tab-panel>
        
        <q-tab-panel name="PublicJoin" class="q-pa-none tabContent scroll-y">
          <public-join></public-join>
        </q-tab-panel>

        <q-tab-panel name="Private" class="q-pa-none tabContent">
          
          <q-tab-panels class="tabContent" v-model="privateTab" animated>

            <q-tab-panel name="PrivateJoin" class="q-pa-none tabContent scroll-y">
              <private-join></private-join>
            </q-tab-panel>

            <q-tab-panel name="PrivateCreate" class="q-pa-none tabContent scroll-y">
              <private-create></private-create>
            </q-tab-panel>

          </q-tab-panels>

          <q-tabs v-model="privateTab" dense class="connect-sub-tabs" align="justify" narrow-indicator>
            <q-tab :label="$q.screen.lt.sm ? '' : $t('join') " name="PrivateJoin" icon="mdi-account-arrow-right"></q-tab>
            <q-tab :label="$q.screen.lt.sm ? '' : $t('create') " name="PrivateCreate" icon="mdi-account-edit"></q-tab>
          </q-tabs>

        </q-tab-panel>

        <q-tab-panel name="Twitch" class="q-pa-none tabContent">

          <q-tab-panels class="tabContent" v-model="twitchTab" animated>

            <q-tab-panel name="TwitchJoin" class="q-pa-none tabContent scroll-y">
              <twitch-join></twitch-join>
            </q-tab-panel>

            <q-tab-panel name="TwitchCreate" class="q-pa-none tabContent scroll-y">
              <twitch-create></twitch-create>
            </q-tab-panel>

          </q-tab-panels>

          <q-tabs v-model="twitchTab" dense class="connect-sub-tabs" align="justify" narrow-indicator>
            <q-tab class="twitchTab" :label="$q.screen.lt.sm ? '' : $t('join') " name="TwitchJoin" icon="svguse:icons/twitch.svg#join"></q-tab>
            <q-tab class="twitchTab" :label="$q.screen.lt.sm ? '' : $t('create') " name="TwitchCreate" icon="svguse:icons/twitch.svg#create"></q-tab>
          </q-tabs>

        </q-tab-panel>
      </q-tab-panels>

      <q-tabs v-model="tab" dense class="connect-tabs" align="justify" narrow-indicator>
        <q-tab :label="$q.screen.lt.md ? '' : $t('home') " name="Home" icon="mdi-home"></q-tab>
        <q-tab :label="$q.screen.lt.md ? '' : $t('publicLobby') " name="PublicJoin" icon="mdi-earth"></q-tab>
        <q-tab :label="$q.screen.lt.md ? '' : $t('privateLobby') " name="Private" icon="mdi-lock"></q-tab>
        <q-tab class="twitchTab" :label="$q.screen.lt.md ? '' : $t('twitchLobby')" name="Twitch" icon="mdi-twitch"></q-tab>
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
.q-tab--active, .q-tab__indicator {
  color: var(--w-color-dark-teal)!important;
}
.q-tab--active.twitchTab, .twitchTab .q-tab__indicator {
  color: #6441A4!important;
}
.body--dark {
  .connect-tabs {
    background: rgb(17,17,17);
    color: darkgray;
    border-top: solid 1px grey;
  }
  .connect-sub-tabs {
    background: rgb(22,22,22);
    color: darkgray;
    border-top: solid 1px grey;
  }
}
.body--light {
  .connect-tabs {
    background: rgb(200,200,200);
    color: dimgray;
    border-top: solid 1px grey;
  }
  .connect-sub-tabs {
    background: rgb(230,230,230);
    color: dimgray;
    border-top: solid 1px grey;
  }
}
</style>
<script lang="ts">
import uuid  from 'uuid'; 
import PrivateCreate from "./tab/PrivateCreate.vue";
import PrivateJoin from "./tab/PrivateJoin.vue";
import PublicJoin from "./tab/PublicJoin.vue";
import TwitchCreate from "./tab/TwitchCreate.vue";
import TwitchJoin from "./tab/TwitchJoin.vue";

import Index from "../../layouts/menu/Index.vue";

import { defineComponent } from '@vue/composition-api';
import { ConnectEvent, ConnectType } from "../../mixins/connectEvent";
import { LobbyState, LobbyType } from "../../store/gameData/state";
import { Lang } from '../../i18n';

export default defineComponent({
  name: 'ConnectMenu',
  components: { PrivateCreate, PrivateJoin, PublicJoin, TwitchCreate, TwitchJoin, Index },
  data():{
    tab:string,
    privateTab:string,
    twitchTab:string,
    connecting:boolean
  } {
    return {
      tab: 'Home',
      privateTab: 'PrivateCreate',
      twitchTab: 'TwitchCreate',
      connecting: false
    }
  },
  methods: {
    login(event:ConnectEvent) {
      var vm = this;
      if(vm.connecting) return;
      vm.connecting = true;
      this.$store.dispatch('globalForm/validatePseudo');
      var query:loginQuery = {
        type: event.type,
        lang: this.$store.state.globalForm.lang,
        pseudo: this.$store.state.globalForm.pseudo
      }
      var options:RequestInit = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          };
      if ([ConnectType.PrivateJoin, ConnectType.PublicJoin, ConnectType.TwitchJoinWith, ConnectType.TwitchJoinWithout].includes(event.type)) {
        if (event.type != ConnectType.PublicJoin && vm.$store.state.globalForm.lobbyID != "") {
          query.lobby = vm.$store.state.globalForm.lobbyID;
        } else {
          vm.$q.notify({
            type: 'negative',
            position: 'top',
            message: vm.$t('lobbyIDRequired') as string
          });
          vm.connecting = false;
          return;
        }
      }
      if (event.type != ConnectType.PublicJoin) {
        query.password = event.password;
      }
      if (event.type == ConnectType.TwitchJoinWith || event.type == ConnectType.TwitchCreate ) {
        query.uuid = uuid.v4();
        var twitch = window.open("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id="+process.env.TWITCH_CLIENT_ID+"&redirect_uri="+encodeURIComponent(process.env.TWITCH_REDIRECT_URL)+"&state=" + query.uuid + "&scope=chat%3Aread+chat%3Aedit");
        var loop = setInterval(function() { if (twitch && twitch.closed) {
          clearInterval(loop);
          /* connect to the server send the login query
          and the uid to prove that you are auth
          and retrieve an uuid to connect to the ws lobby*/
          options.body = JSON.stringify(query);
          vm.connect(options, true);
        }}, 50);// the duration in ms between each call of loop
      } else {
        options.body = JSON.stringify(query);
        vm.connect(options, event.type == ConnectType.TwitchJoinWithout);
      }
    },
    connect(options:RequestInit, twitch?:boolean) {
      var vm = this;
      fetch("/api/"+ (twitch ? "twitch" : "connect"), options)
        .then(function(response:Response):Promise<ConnectionResponse> {
          return response.json();
        }).then(function(json:ConnectionResponse) {
          vm.start(json);
        }).catch(function(error) {
          vm.connecting = false;
          vm.$q.notify({
          type: 'negative',
          position: 'top',
          message: vm.$t('fetchError') + ' : ' + error.message
        });
          console.log(vm.$t('fetchError') + ' : ' + error.message);
      });
    },
    start(json:ConnectionResponse) {
      var vm = this as any;
      vm.$store.commit('gameData/setLang', json.lang);
      vm.$store.commit('gameData/setLobbyID', json.lobbyID);
      vm.$store.commit('gameData/setLobbyType', json.lobbyType);
      vm.$store.commit('gameData/setUuid', json.playerID);
      vm.$router.push('/'+(json.lobbyType == LobbyType.Twitch ? "twitch" : "play")+'/'+json.lobbyID);
    }
  },
  created() {
    //check if the lobby provided in the url exist
    var vm = this;
    vm.$store.commit('globalForm/defaultLang');
    if (vm.$route.params.id == undefined) return;
    var id = vm.$route.params.id;
    var isTwitch = (vm.$route.path as string).startsWith("/twitchConnect/")
    console.log(vm.$route);
    fetch('/api/info/'+(isTwitch ? "twitch:":"")+ id)
    .then(function(response:Response):Promise<InfoResponse> {
      return response.json();
    }).then(function(json) {
      if (json.status == InfoStatus.Found) {
        vm.$store.commit('globalForm/setLobbyID', json.lobbyID);
        vm.$store.commit('globalForm/setLang', json.lobbyLang);
        if (json.lobbyType == LobbyType.Public) {
          vm.tab = "PublicJoin";
        } else if (json.lobbyType == LobbyType.Private) {
          vm.tab = "Private";
          vm.privateTab = "PrivateJoin";
        } else if (json.lobbyType == LobbyType.Twitch) {
          vm.tab = "Twitch";
          vm.twitchTab = "TwitchJoin";
        }
      } else {
        if (json.status == InfoStatus.NotFound) {
          vm.$q.notify({
            type: 'negative',
            position: 'top',
            message: vm.$t('noLobbyFound') + ' ' + id
          });
        }
      }
    }).catch(function(error) {
      vm.$q.notify({
            type: 'negative',
            position: 'top',
            message: vm.$t('fetchError') + ' : ' + error.message
          });
      console.log(vm.$t('fetchError') + ' : ' + error.message);
    });
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
  lobby?:string;
  uuid?:string;//for twitch
}
interface ConnectionResponse {
    status:ConnectionStatus,
    lobbyID:string,
    lobbyType:LobbyType,
    playerID:string,
    lang:Lang,
    error?:string
}
enum ConnectionStatus {
    Success = 'Success',
    ClientError = 'ClientError',
    ServerError = 'ServerError'
}
interface InfoResponse {
    status:InfoStatus,
    lobbyID?:String,
    lobbyType?:LobbyType,
    lobbyLang?:Lang,
    slot?:number,
    players?:number,
    state?:LobbyState,
    error?:String
}
enum InfoStatus {
  Found = "Found",
  NotFound = "NotFound",
  ServerError = "ServerError"
}
</script>
