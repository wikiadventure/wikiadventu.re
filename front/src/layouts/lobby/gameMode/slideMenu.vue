<template>
    <div class="slide-menu" ref="menu" :class="{ 'checked': showGameMenu }">
      <label @click.stop="showGameMenu = !showGameMenu" class="showMenu">
        <q-icon size="md" name="mdi-play"/>
        <q-badge color="teal" transparent :label="unseenMessagesNumber" floating v-show="unseenMessagesNumber != '0'" />
      </label>
      <q-tab-panels keep-alive class="content" v-model="gameMenuTab" animated>

        <!-- <q-tab-panel name="chat" class="q-pa-none">
          <chat-tab ref="chatTab" />
        </q-tab-panel> -->
        <chat-tab name="chat" ref="chatTab" />

        <score-tab name="score" ref="scoreTab" />

        <q-tab-panel name="game" class="q-pa-none">
          <slot name="gameTab"></slot>
        </q-tab-panel>
        
        <setting-tab name="setting" ref="settingTab" />

        <slot name="extraTab"></slot>

      </q-tab-panels>
      <q-tabs v-model="gameMenuTab" dense
              class="menu-tabs" align="justify"
              narrow-indicator>
        <q-tab name="chat" icon="mdi-android-messages" @click="seenMessages = 0">
          <q-badge color="teal" transparent :label="unseenMessagesNumber" floating v-show="unseenMessagesNumber != '0'" />
        </q-tab><!-- or icon="mdi-chat" -->
        <q-tab name="score" icon="mdi-crown"></q-tab>
        <q-tab name="game" icon="mdi-gamepad"></q-tab>
        <q-tab name="setting" icon="mdi-cog"></q-tab>
        <slot name="extraTabs"></slot>
      </q-tabs>
    </div>
</template>
<style lang="scss">
.slide-menu {
  z-index: 6;
  position: absolute;
	bottom: 0;
  display: flex;
  flex-flow: column;
	width: 50%;
  height: 100%;
  transition: all ease-in-out 0.2s;
	transform: translate3d(-100%,0,0);
  will-change: transform;
  @media(max-width: 720px) {
    width: 100%;
  }
  word-break: break-word;
	filter: drop-shadow(3px 3px 15px black);
  .content {
    flex: 1 1 auto;
  }
  .q-tabs {
    flex: 0 1 36px;
  }

  &.checked {
    transform: translate3d(0,0,0);
    .showMenu {
      color: var(--clr-reverse);
      background: var(--clr-main);
      .q-icon {
        transform: rotate(180deg);
      }
    }
  }
  .showMenu {
    position: absolute;
    left: 100%;
    opacity: .7;
    display: inline-block;
    padding: 0.25em 0.35em;
    background: var(--clr-reverse);
    color: var(--clr-main);
    border-radius: 10px;
    transition: all ease-in-out 0.2s;
    cursor: pointer;
    .q-icon {
      transform: rotate(0deg);
      transition: inherit;
    }
    .q-badge {
      bottom: -4px;
      top: unset;
    }
    @media(max-width: 720px) {
      //display: none;
    }
  }
  
  .menu-tabs {
    border-top: 1px solid rgba(0,0,0,0.12);
    background:  var(--clr-main);
  }

}

.body--dark {
  .slide-menu{
    .menu-tabs {
      border-top: 1px solid rgba(255,255,255,.28);
      background:  var(--clr-main);
      //color:  var(--clr-reverse);
    }
  }
}
</style>
<script lang="ts" setup>
import ChatTab from './tab/Chat.vue';
import ScoreTab from './tab/Score.vue';
import SettingTab from './tab/Setting.vue';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import { unseenMessagesNumber } from 'store/chat/computed'
import { seenMessages } from 'store/chat/state';

const {
  showGameMenu,
  gameMenuTab
} = gameLayoutManagerSetup();
</script>
