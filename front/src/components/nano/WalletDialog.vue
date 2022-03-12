<template>
  <q-dialog v-bind="$attrs">
    <q-card>
      <q-toolbar>
          <q-btn round flat icon="img:~assets/icons/nano.svg" @click="openURL('https://nano.org')" />
        <q-toolbar-title>{{ t('nanoAccount') }}</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator/>
      <q-card-section class="row justify-center">
        <img class="QRCode" src="~assets/images/NanoQRCode.png"/>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="center">
        <div class="row items-end q-mx-sm"><p class="nanoAddress">{{ nanoAddress }}</p><q-btn round flat icon="mdi-content-copy" @click="CopyToClipboard(nanoAddress)" /></div>
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
<script lang="ts" setup>
import { openURL } from 'quasar';
import { CopyToClipboard } from 'store/utils/CopyToClipboard';
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: 'local' });

const nanoAddress = "nano_3tobgnzzk9dgktg7gwiq94rwqcooeihgp8oz6s31xak798mgtgmn881t58cq";
</script>
<i18n lang="yaml">
  en:
    nanoAccount: "My Nano account"
  fr:
    nanoAccount: "Mon compte Nano"
</i18n>

