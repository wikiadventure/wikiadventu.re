<template>
  <q-tab-panel name="chat" class="chat-tab">
    <q-list class="chatOutput" bordered padding>
      <q-item v-for="mes in messages" :key="mes.playerID" class="q-pa-none">
        <q-item-section>
          <q-separator></q-separator>
          <q-item-label side top class="chatLabel q-pa-xs">
            <p>{{ getPseudo(mes.playerID) }}</p><p>{{ getFormatTime(mes.timeStamp) }}</p>
          </q-item-label>
          <q-item-label class="q-px-xs">{{ mes.content }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-form class="chatForm">
      <q-input dense class="chatInput" maxlength="512" outlined v-model="messageInput" @keydown.enter.prevent="submitMessage()" :label="t('send')">
        <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" class="chatSubmit" @click="submitMessage()"/>
        </template>
      </q-input>
    </q-form>
  </q-tab-panel>
</template>
<style lang="scss">
.chat-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}
.chatOutput {
  overflow: auto scroll;
  flex: 1;
  display: flex;
	flex-direction: column-reverse;
  border: none;
  .q-item {
    flex: 0 0 auto;
  }
}
.chatForm {
  flex: 0 0 auto;
	display: inline-flex;
	bottom: 0;
  width: 100%;
  padding: 3px;
}
.chatInput {
  width: 100%;
}
.chatSubmit:active {
  transform: scale(0.9);
}
.chatLabel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  p {
    margin: 0;
  }
  p:nth-child(2) {
    opacity: 0.7;
    font-size: 85%;
  }
}
</style>
<script lang="ts" setup>
import { date } from 'quasar';
import { onUnmounted } from 'vue';
import { onMessage, WsMessage } from 'store/ws/packetHandler/vanilla/message';
import { notifSound } from 'store/audio/vanilla/notif';
import { gameMenuTab, showGameMenu } from 'store/gameLayoutManager/state';
import { chatSetup } from 'store/chat';
import { players } from 'store/player/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

function messageEvent(payload:WsMessage) {
  if (!(showGameMenu.value && gameMenuTab.value == "chat")) {
    notifSound.play();
  } 
}

const unsubMessage =  onMessage.subscribe(messageEvent);

onUnmounted(unsubMessage);

function getPseudo(id:number) {
  return id == -1 ? "" : players.value.find(p=>p.id==id)?.pseudo || "";
}

function getFormatTime(timeStamp:number):string {
  return date.formatDate(timeStamp, 'HH:mm');
}

const {
  messages,
  messageInput,
  submitMessage
} = chatSetup();
</script>
<i18n lang="yaml">
  en:
    send: "Send a message"
  fr:
    send: "Envoyer un message"
</i18n>

