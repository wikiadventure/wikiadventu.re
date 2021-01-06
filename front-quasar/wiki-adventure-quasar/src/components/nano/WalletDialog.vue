<template>
  <q-dialog v-bind="$attrs" v-on="$listeners">
    <q-card>
      <q-toolbar>
          <q-btn round flat icon="img:https://cryptologos.cc/logos/nano-nano-logo.svg?v=006" @click="openNewPage('https://nano.org')" />
        <q-toolbar-title>My Nano account address</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator/>
      <q-card-section class="row justify-center">
        <img class="QRCode" src="images/NanoQRCode.png"/>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="center">
        <div class="row items-end"><p class="nanoAddress">{{ nanoAddress }}</p><q-btn round flat icon="mdi-content-copy" @click="clip()" /></div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style>
.QRCode {
  image-rendering: pixelated;
  width: 75%;
  height: auto;
  border-radius: 5px;
}
.nanoAddress {
  font-size: 75%;
}
</style>
<script lang="ts">
import { copyToClipboard } from 'quasar'
import { openURL } from 'quasar';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'WalletDialog',
  data():{
    nanoAddress:string
  } {
    return {
      nanoAddress: "nano_3tobgnzzk9dgktg7gwiq94rwqcooeihgp8oz6s31xak798mgtgmn881t58cq"
    }
  },
  methods: {
    openNewPage(url: string) {
      openURL(url);
    },
    clip() {
      var vm = this;
      copyToClipboard(this.nanoAddress)
      .then(() => {
        vm.$q.notify({
          type: 'annonce',
          position: 'bottom',
          message: vm.$t('copySuccess') as string
        });
      })
      .catch(() => {
        vm.$q.notify({
          type: 'error',
          position: 'bottom',
          message: vm.$t('copyFail') as string
        });
      })
    }
  }
});
</script>