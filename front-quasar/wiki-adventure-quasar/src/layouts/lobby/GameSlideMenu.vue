<template>
  <q-layout class="gameSlideMenu">
    <input id="showMenu" type="checkbox" v-model="showMenu"/>
    <div id="slideMenu">
      <label @click.stop="showMenu = !showMenu" id="labelShowMenu"><q-icon size="md" name="mdi-play"/></label>
      <q-tab-panels class="content" v-model="tab" animated>
        <q-tab-panel name="chat" class="q-pa-none">
          <chat-tab-panel></chat-tab-panel>
        </q-tab-panel>

        <q-tab-panel name="score" class="q-pa-none">
          <score-tab-panel></score-tab-panel>
        </q-tab-panel>

        <q-tab-panel name="game" class="q-pa-none">
          <game-tab-panel></game-tab-panel>
        </q-tab-panel>

        <q-tab-panel name="setting" class="q-pa-none">
          <setting-tab-panel></setting-tab-panel>
        </q-tab-panel>
      </q-tab-panels>
      <q-tabs v-model="tab"
              dense
              class="text-grey game-tabs"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
        <q-tab name="chat" icon="mdi-android-messages"></q-tab><!-- or icon="mdi-chat" -->
        <q-tab name="score" icon="mdi-crown"></q-tab>
        <q-tab name="game" icon="mdi-gamepad"></q-tab>
        <q-tab name="setting" icon="mdi-cog"></q-tab>
      </q-tabs>
    </div>
  </q-layout>
</template>
<style lang="scss">
.gameSlideMenu {
  pointer-events: none;
  z-index: 2;
}
.gameSlideMenu > div {
  pointer-events: auto;
}
#slideMenu {
  transition: all ease-in-out 0.2s;
	background: var(--w-color-almost-black);
	width: 50%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-flow: column;
	bottom: 0;
	transform: translateX(-100%);
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
  transform: rotate(0deg);
  cursor: pointer;
  @media(max-width: 720px) {
    display: none;
  }
}
#showMenu:checked + #slideMenu #labelShowMenu {
  transform: rotate(180deg);
}
.body--dark {
  #labelShowMenu {
    color: var(--w-color-dark-blue);
    background: var(--w-color-blue-white);
  }
  #showMenu:checked + #slideMenu #labelShowMenu {
    background: var(--w-color-dark-blue);
    color: var(--w-color-blue-white);
  }
  .game-tabs {
    background: #111;
  }
}
.body--light {
  #labelShowMenu {
    color: var(--w-color-blue-white);
    background: var(--w-color-dark-blue);
  }
  #showMenu:checked + #slideMenu #labelShowMenu {
    background: var(--w-color-blue-white);
    color: var(--w-color-dark-blue);
  }
  .game-tabs {
    background: var(--w-color-blue-white);
    color: darkgray;
  }
}

#showMenu:checked + #slideMenu {
  transform: translateX(0);
}
</style>
<script lang="ts">
import ChatTabPanel from "./tab/ChatTabPanel.vue";
import GameTabPanel from "./tab/GameTabPanel.vue";
import ScoreTabPanel from "./tab/ScoreTabPanel.vue";
import SettingTabPanel from "./tab/SettingTabPanel.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'GameSlideMenu',
  components: { ChatTabPanel, GameTabPanel, ScoreTabPanel, SettingTabPanel },
  data():{
    tab:string,
    showMenu:boolean,
    onDestroy:() => void,
    touchsurface?:HTMLElement
  } {
    return {
      tab: 'game',
      showMenu: false,
      onDestroy: () => {},
    }
  },
  methods: {
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
    var slideMenu = document.getElementById("slideMenu"),
        startX:number,
        startY:number,
        dist:number,
        threshold = 0.45,
        min = 0.2;
    function handleswipe(isRightSwipe:boolean, isLeftSwipe:boolean){
        if (isRightSwipe) {
          vm.showMenu = true;
        } else if (isLeftSwipe){
          vm.showMenu = false;
        }
    }
    function touchEnd(e:TouchEvent) {
      var touchobj = e.changedTouches[0];
      slideMenu!.style.transition = "all ease-in-out 0.2s";
      slideMenu!.style.transform = "";
      dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
      //elapsedTime = new Date().getTime() - startTime; // get time elapsed
      // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
      var swipeRightBol = ( dist >= threshold*slideMenu!.clientWidth );
      var swipeLeftBol = ( dist <= -threshold*slideMenu!.clientWidth )
      handleswipe(swipeRightBol, swipeLeftBol);
    }
    function touchMove(e:TouchEvent) {
      var touchobj = e.changedTouches[0];
      dist = touchobj.pageX - startX;
      if ( dist > slideMenu!.clientWidth*min && !vm.showMenu) {
        dist -= slideMenu!.clientWidth*min;
        if ( dist > slideMenu!.clientWidth ) dist = slideMenu!.clientWidth;
        slideMenu!.style.transform = "translateX(" + (-slideMenu!.clientWidth+dist) + "px)";
      }
      else if ( dist < -slideMenu!.clientWidth*min && vm.showMenu) {
        dist += slideMenu!.clientWidth*min;
        if ( dist < -slideMenu!.clientWidth ) dist = -slideMenu!.clientWidth;
        slideMenu!.style.transform = "translateX(" + (dist) + "px)";
      }
    }
    function touchStart(e:TouchEvent) {
      e.preventDefault();
      var touchobj = e.changedTouches[0];
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      slideMenu!.style.transition = "";
      //startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }

    function keyDown(e:KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }
      if (e.key == "Shift" && e.ctrlKey) {
        vm.showMenu = !vm.showMenu;
      }
    }

    this.touchsurface!.addEventListener('touchstart', touchStart, false);

    this.touchsurface!.addEventListener('touchmove', touchMove, false);

    this.touchsurface!.addEventListener('touchend', touchEnd, false);

    this.touchsurface!.addEventListener("keydown", keyDown, false);

    this.onDestroy = function () {
      this.touchsurface!.removeEventListener('touchstart', touchStart, false);
      this.touchsurface!.removeEventListener('touchmove', touchMove, false);
      this.touchsurface!.removeEventListener('touchend', touchEnd, false);
      this.touchsurface!.addEventListener("keydown", keyDown, false);
    };
  },
  beforeDestroy() {
    this.onDestroy();
  }
});
</script>
