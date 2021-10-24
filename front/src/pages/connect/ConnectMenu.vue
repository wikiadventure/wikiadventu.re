<template>
<!--TODO: rename to connect-menu-->
  <q-layout class="tabMenu">
    <div class="tabPanel">
      <q-tab-panels class="tabContent" v-model="tab" animated :swipeable="$q.platform.has.touch" infinite>
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
            <q-tab :label="$q.screen.lt.sm ? '' : t('join') " name="PrivateJoin" icon="mdi-account-arrow-right"></q-tab>
            <q-tab :label="$q.screen.lt.sm ? '' : t('create') " name="PrivateCreate" icon="mdi-account-edit"></q-tab>
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
          <!-- TODO: Fix back this icon-->
            <q-tab class="twitchTab" :label="$q.screen.lt.sm ? '' : t('join') " name="TwitchJoin" :icon="'svguse:svg/twitch.svg#join'"></q-tab>
            <q-tab class="twitchTab" :label="$q.screen.lt.sm ? '' : t('create') " name="TwitchCreate" :icon="'svguse:svg/twitch.svg#create'"></q-tab>
          </q-tabs>

        </q-tab-panel>
      </q-tab-panels>

      <q-tabs v-model="tab" dense class="connect-tabs" align="justify" narrow-indicator>
        <q-tab :label="$q.screen.lt.md ? '' : t('home') " name="Home" icon="mdi-home"></q-tab>
        <q-tab :label="$q.screen.lt.md ? '' : t('publicLobby') " name="PublicJoin" icon="mdi-earth"></q-tab>
        <q-tab :label="$q.screen.lt.md ? '' : t('privateLobby') " name="Private" icon="mdi-lock"></q-tab>
        <q-tab class="twitchTab" :label="$q.screen.lt.md ? '' : t('twitchLobby')" name="Twitch" icon="mdi-twitch"></q-tab>
      </q-tabs>
    </div>
  </q-layout>
</template>
<style lang="scss">
.tabMenu {
  overflow: hidden;
  display: flex;
  flex-flow: column;
  min-height: 100%;
  .tabPanel {
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
  .tabContent, .tabContent .q-panel, .tabPanel {
    overflow: hidden;
    flex: 1 1 auto;
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
.body--dark {
  .connect-tabs {
    background: scale-color($color: $clr-dark, $lightness: 3%);
    color: #ddd;
    border-top: solid 1px grey;
  }
  .connect-sub-tabs {
    background: scale-color($color: $clr-dark, $lightness: 6%);
    color: darkgray;
    border-top: solid 1px grey;
  }
}
.body--light {
  .connect-tabs {
    background: scale-color($color: $clr-light, $lightness: -3%);
    color: #333;
    border-top: solid 1px grey;
  }
  .connect-sub-tabs {
    background: scale-color($color: $clr-light, $lightness: -6%);
    color: #333;
    border-top: solid 1px grey;
  }
}
</style>
<script lang="ts">
import PrivateCreate from './tab/PrivateCreate.vue';
import PrivateJoin from './tab/PrivateJoin.vue';
import PublicJoin from './tab/PublicJoin.vue';
import TwitchCreate from './tab/TwitchCreate.vue';
import TwitchJoin from './tab/TwitchJoin.vue';
import Index from './tab/Index.vue';
import { useRoute } from "vue-router";
import { ErrorCode, InfoStatus, InfoResponse, isSucess } from "store/connect/type";

import { defineComponent, ref } from 'vue';
import { LobbyType } from 'store/lobby/type';
import { Notify } from 'quasar';
import { id } from 'store/connect/state';
import { twitchName } from 'store/connect/twitch/state';
import { notifyError } from 'store/connect/action';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ConnectMenu',
  components: { PrivateCreate, PrivateJoin, PublicJoin, TwitchCreate, TwitchJoin, Index },
  setup() {
    const tab = ref('Home');
    const privateTab = ref('PrivateCreate');
    const twitchTab = ref('TwitchCreate');
    //check if the lobby provided in the url exist, auto complete field and switch to correct tab
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });
    const vm = this;
    if (route.params.id != undefined) {
      const isTwitch = route.path.startsWith("/twitchConnect/")
      fetch('/api/info/'+(isTwitch ? "twitch:":"")+ route.params.id)
        .then(r=> r.json())
        .then((res:InfoResponse<unknown>) => {
          if (isSucess(res)) {
            if ([LobbyType.Public, LobbyType.Private].includes(res.lobbyType)) {
              id.value = res.lobbyID;
              if (res.lobbyType == LobbyType.Public) {
                tab.value = "PublicJoin";
              } else if (res.lobbyType == LobbyType.Private) {
                tab.value = "Private";
                privateTab.value = "PrivateJoin";
              }
            } else if (res.lobbyType == LobbyType.Twitch) {
              twitchName.value = res.lobbyID
              tab.value = "Twitch";
              twitchTab.value = "TwitchJoin";
            }
          } else {
            if (res.status == InfoStatus.NotFound) {
              Notify.create({
                type: 'negative',
                position: 'top',
                message: t('connectError.'+(isTwitch ? 'noLobbyFoundWithChannelName' : 'noLobbyFoundWithID')) + ' ' + id.value
              });
            }
          }
      }).catch(e => {
        notifyError(ErrorCode.noInternet, e);
      });
    }
    return {
      tab,
      privateTab,
      twitchTab,
      t
    }
  }
});
</script>
