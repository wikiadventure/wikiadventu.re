<template>
  <div id="chatTab">
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
      <q-input dense class="chatInput" maxlength="512" outlined v-model="messageInput" @keydown.enter.prevent="submitMessage()" :label="t('chatTab.send')">
        <template v-slot:after>
          <q-btn round dense flat icon="mdi-send" class="chatSubmit" @click="submitMessage()"/>
        </template>
      </q-input>
    </q-form>
  </div>
</template>
<style lang="scss">
#chatTab {
	//background: blue;/*#23272a*/
	display: flex;
  flex-direction: column;
  height: 100%;
}
.chatOutput {
  overflow-x: auto;
  overflow-y: scroll;
  display: flex;
  flex: 1;
	flex-direction: column-reverse;
  border: none;
  .q-item {
    flex: 0 0 auto;
  }
}
.chatForm {
		//background: #23272a;
		padding: 3px;
		bottom: 0;
    width: 100%;
    flex: 0 0 auto;
		//border-top: 2px solid #2f353a;
		display: inline-flex;
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
<script lang="ts">
import { date } from 'quasar';

import { defineComponent, onUnmounted } from 'vue';
import { onMessage, WsMessage } from 'store/ws/packetHandler/vanilla/message';
import { notifSound } from 'store/audio/vanilla/notif';
import { gameMenuTab, showGameMenu } from 'store/gameLayoutManager/state';
import { chatSetup } from 'store/chat';
import { players } from 'store/player/state';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ChatTab',
  setup() {
    const { t } = useI18n();
    function messageEvent(payload:WsMessage) {
      if (!(showGameMenu.value && gameMenuTab.value == "chat")) {
        notifSound.play();
      } 
    }
    var unsubMessage =  onMessage.subscribe(messageEvent);

    onUnmounted(unsubMessage);
    
    var {
      messages,
      messageInput,
      submitMessage
    } = chatSetup();

    return {
      messages,
      messageInput,
      submitMessage,
      t
    }
  },
  methods: {
    getPseudo(id:number) {
      return id == -1 ? "" : players.value.find(p=>p.id==id)?.pseudo || "";
    },
    getFormatTime(timeStamp:number):string {
      return date.formatDate(timeStamp, 'HH:mm');
    }
  }
});
</script>
