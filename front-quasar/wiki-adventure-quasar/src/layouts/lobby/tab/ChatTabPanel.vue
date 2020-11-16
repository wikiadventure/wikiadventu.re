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
      <q-input autogrow dense class="chatInput" maxlength="512" outlined v-model="message" label="Send a message" spellcheck="false">
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
  .q-item {
    flex: 0 0 auto;
  }
}
.chatForm {
		background: #23272a;
		padding: 3px;
		bottom: 0;
    width: 100%;
    flex: 0 0 auto;
		border-top: 2px solid #2f353a;
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
    p:nth-child(1) {
      
    }
    p:nth-child(2) {
      opacity: 0.7;
      font-size: 85%;
    }
  }
</style>
<script lang="ts">
import { date } from 'quasar'

import { defineComponent } from '@vue/composition-api';
import { Message } from '../../../store/gameData/state';

export default defineComponent({
  name: 'ChatTabPanel',
  data() {
    return {
      message: ""
    }
  },
  computed: {
    messages():Array<Message> {
      return this.$store.state.gameData.messages.slice().reverse();
    }
  },
  methods: {
    getPseudo(id:number) {
      if (id == -1) return "";
      for (let p of this.$store.state.gameData.players) {
        if (p.id == id) {
          return p.pseudo;
        }
      }
      return "";
    },
    getFormatTime(timeStamp:number):string {
      return date.formatDate(timeStamp, 'HH:mm');
    },
    submitMessage(e:Event) {
      this.$store.dispatch('gameData/sendMessage', this.message);
      this.message = "";
      console.log("send");
    }
  }
});
</script>
