<template>
    <div class="slideMenu" ref="menu" :class="{ 'checked': showMenu }">
      <label @click.stop="showMenu = !showMenu" class="showMenu"><q-icon size="md" name="mdi-play"/><q-badge color="teal" transparent :label="unseenMessagesNumber" floating v-show="unseenMessagesNumber != '0'" /></label>
      <q-tab-panels class="content" v-model="tab" animated>

        <q-tab-panel name="chat" class="q-pa-none">
          <chat-tab ref="chatTab" />
        </q-tab-panel>

        <q-tab-panel name="score" class="q-pa-none">
          <score-tab ref="scoreTab" />
        </q-tab-panel>

        <q-tab-panel name="game" class="q-pa-none">
          <slot name="gameTab"></slot>
        </q-tab-panel>
        

        <q-tab-panel name="setting" class="q-pa-none">
          <setting-tab ref="settingTab" />
        </q-tab-panel>

        <slot name="extraTab"></slot>

      </q-tab-panels>
      <q-tabs v-model="tab"
              dense
              class="text-grey menu-tabs"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
        <q-tab name="chat" icon="mdi-android-messages" @click="updateSeenMessage()"><q-badge color="teal" transparent :label="unseenMessagesNumber" floating v-show="unseenMessagesNumber != '0'" /></q-tab><!-- or icon="mdi-chat" -->
        <q-tab name="score" icon="mdi-crown"></q-tab>
        <q-tab name="game" icon="mdi-gamepad"></q-tab>
        <q-tab name="setting" icon="mdi-cog"></q-tab>
        <slot name="extraTabs"></slot>
      </q-tabs>
    </div>
</template>
<style lang="scss">
.gameSlideMenu {
  pointer-events: none;
  z-index: 6;
  > div {
    pointer-events: auto;
  }
}

.slideMenu {
  z-index: 6;
  transition: all ease-in-out 0.2s;
	background: var(--wa-color-almost-black);
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

  &.checked {
    transform: translate3d(0,0,0);
    .showMenu {
      color: var(--wa-color-blue-white);
      background: var(--wa-color-almost-black);
      .q-icon {
        transform: rotate(180deg);
      }
    }
  }
}
.showMenu {
	padding: 0.25em 0.35em;
  border-radius: 10px;
  display: inline-block;
	opacity: .7;
	position: absolute;
	left: 100%;
	transition: all ease-in-out 0.2s;
  color: var(--wa-color-almost-black);
  background: var(--wa-color-blue-white);
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

.q-tab--active, .q-tab__indicator {
  color: var(--wa-color-dark-teal)!important;
}

.menu-tabs {
  background: $wa-2;
  color: $wa-3;
}
</style>
<script lang="ts">
import ChatTab from './tab/Chat.vue';
import GameTab from './tab/game/Classic.vue';
import ScoreTab from './tab/Score.vue';
import SettingTab from './tab/Setting.vue';

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ClassicSlideMenu',
  components: { ChatTab, GameTab, ScoreTab, SettingTab },
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
      var vm = this as any;
      this.showMenu = true;
      vm.$refs.menu.style.transform = "";
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
      this.touchsurface!.removeEventListener("keydown", keyDown, false);
    };
  },
  beforeDestroy() {
    this.onDestroy();
  }
});
</script>
