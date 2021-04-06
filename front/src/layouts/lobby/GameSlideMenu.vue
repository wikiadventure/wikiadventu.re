<template>
    <div id="slideMenu" :class="{ 'checked': showMenu }">
      <label @click.stop="showMenu = !showMenu" id="labelShowMenu"><q-icon size="md" name="mdi-play"/><q-badge color="teal" transparent :label="unseenMessagesNumber" floating v-show="unseenMessagesNumber != '0'" /></label>
      <q-tab-panels class="content" v-model="tab" animated>

        <q-tab-panel name="chat" class="q-pa-none">
          <chat-tab-panel ref="chatTab" />
        </q-tab-panel>

        <q-tab-panel name="score" class="q-pa-none">
          <score-tab-panel ref="scoreTab" />
        </q-tab-panel>

        <q-tab-panel name="game" class="q-pa-none">
          <game-tab-panel ref="gameTab" />
        </q-tab-panel>

        <q-tab-panel name="setting" class="q-pa-none">
          <setting-tab-panel ref="settingTab" />
        </q-tab-panel>

      </q-tab-panels>
      <q-tabs v-model="tab"
              dense
              class="text-grey game-tabs"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
        <q-tab name="chat" icon="mdi-android-messages" @click="updateSeenMessage()"><q-badge color="teal" transparent :label="unseenMessagesNumber" floating v-show="unseenMessagesNumber != '0'" /></q-tab><!-- or icon="mdi-chat" -->
        <q-tab name="score" icon="mdi-crown"></q-tab>
        <q-tab name="game" icon="mdi-gamepad"></q-tab>
        <q-tab name="setting" icon="mdi-cog"></q-tab>
      </q-tabs>
    </div>
  <!--<q-layout class="gameSlideMenu">
    <input id="showMenu" type="checkbox" v-model="showMenu"/>

  </q-layout>-->
</template>
<style lang="scss">
.gameSlideMenu {
  pointer-events: none;
  z-index: 6;
}
.gameSlideMenu > div {
  pointer-events: auto;
}
#slideMenu {
  z-index: 6;
  transition: all ease-in-out 0.2s;
	background: var(--w-color-almost-black);
	width: 50%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-flow: column;
	bottom: 0;
	transform: translate3d(-100%,0,0);
  will-change: transform;
  @media(max-width: 720px) {
    width: 100%;
  }
	filter: drop-shadow(3px 3px 15px black);
  word-break: break-word;
  .content {
    flex: 1 1 auto;
  }
  .q-tabs {
    flex: 0 1 36px;
  }
}
#showMenu {
  position: fixed;
	left: -10000px;
}
#labelShowMenu {
	padding: 0.25em 0.35em;
  border-radius: 10px;
  display: inline-block;
	opacity: .7;
	position: absolute;
	left: 100%;
	transition: all ease-in-out 0.2s;
  .q-icon {
    transform: rotate(0deg);
    transition: inherit;
  }
  .q-badge {
    bottom: -4px;
    top: unset;
  }
  cursor: pointer;
  @media(max-width: 720px) {
    //display: none;
  }
}
#slideMenu.checked #labelShowMenu .q-icon {
  transform: rotate(180deg);
}
.q-tab--active, .q-tab__indicator {
  color: var(--wa-color-dark-teal)!important;
}
#labelShowMenu {
  color: var(--wa-color-almost-black);
  background: var(--wa-color-blue-white);
}
#slideMenu.checked #labelShowMenu {
  color: var(--wa-color-blue-white);
  background: var(--wa-color-almost-black);
}
.game-tabs {
  background: $wa-2;
  color: $wa-3;
}

#slideMenu.checked {
  transform: translate3d(0,0,0);
}
</style>
<script lang="ts">
import ChatTabPanel from "./tab/ChatTabPanel.vue";
import GameTabPanel from "./tab/GameTabPanel.vue";
import ScoreTabPanel from "./tab/ScoreTabPanel.vue";
import SettingTabPanel from "./tab/SettingTabPanel.vue";

import { defineComponent } from '@vue/composition-api';
import { ManageScreenEvent } from "../../mixins/manageScreen";

export default defineComponent({
  name: 'GameSlideMenu',
  components: { ChatTabPanel, GameTabPanel, ScoreTabPanel, SettingTabPanel },
  data():{
    tab:string,
    showMenu:Boolean,
    seenMessage: number,
    onDestroy:() => void,
    touchsurface?:HTMLElement
  } {
    return {
      tab: 'game',
      seenMessage: 0,
      showMenu: false,
      onDestroy: () => {},
    }
  },
  computed: {
    unseenMessagesNumber():string {
      var n:number = this.totalMessages - this.seenMessage;
      var b = n > 9 ? "9+" : n.toString();
      return b;
    },
    totalMessages():number {
      if (this.tab == "chat" && this.showMenu ) this.seenMessage = this.$store.state.gameData.messages.length;
      return this.$store.state.gameData.messages.length;
    },
  },
  methods: {
    updateSeenMessage() {
      this.seenMessage = this.$store.state.gameData.messages.length;
    },
    open(e:Event) {
      this.showMenu = true;
      document.getElementById("slideMenu")!.style.transform = "";
      e.stopPropagation();
    },
    close() {
      this.showMenu = false;
    }
  },
  mounted() {
    var vm = this;
    this.touchsurface = document.documentElement;
    function keyDown(e:KeyboardEvent) {
      if (e.defaultPrevented) return;
      if (e.key == "Shift" && e.ctrlKey) {
        vm.showMenu = !vm.showMenu;
      }
    }
    this.touchsurface!.addEventListener("keydown", keyDown, false);
    this.onDestroy = function () {
      this.touchsurface!.addEventListener("keydown", keyDown, false);
    };
  },
  beforeDestroy() {
    this.onDestroy();
  }
});
</script>
