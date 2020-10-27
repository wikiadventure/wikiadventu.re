<template>
  <q-layout class="gameSlideMenu">
    <input id="showMenu" type="checkbox" v-model="showMenu"/>
    <div id="slideMenu">
      <q-tab-panels class="content" v-model="tab" animated>
        <q-tab-panel name="chat" class="q-pa-none">
          <chat-tab-panel></chat-tab-panel>
        </q-tab-panel>

        <q-tab-panel name="score">
          jaaj
        </q-tab-panel>

        <q-tab-panel name="info">
          <game-tab-panel></game-tab-panel>
        </q-tab-panel>
      </q-tab-panels>

      <q-separator></q-separator>

      <q-tabs v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
        <q-tab name="chat" icon="mdi-android-messages"></q-tab><!-- or icon="mdi-chat" -->
        <q-tab name="score" icon="mdi-crown"></q-tab>
        <q-tab name="info" icon="mdi-gamepad"></q-tab>
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
	background: #23272a;
	width: 50vw;
  height: 100%;
  position: absolute;
  display: flex;
  flex-flow: column;
	bottom: 0;
	transform: translateX(-50vw);
	transition: all ease-in-out 0.25s;
	will-change: transform;
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
#showMenu:checked + #slideMenu {
  transform: translateX(0);
}
</style>
<script lang="ts">
import ChatTabPanel from "./tab/ChatTabPanel.vue";
import GameTabPanel from "./tab/GameTabPanel.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'GameSlideMenu',
  components: { ChatTabPanel, GameTabPanel },
  data() {
    return {
      tab: 'chat',
      showMenu: true
    }
  },
  mounted() {
    var vm = this;
    var touchsurface = document.documentElement,
        slideMenu = document.getElementById("slideMenu"),
        startX:number,
        startY:number,
        dist:number,
        threshold = document.documentElement.clientWidth*0.5, //required min distance traveled to be considered swipe
        allowedTime = 450, // maximum time allowed to travel that distance
        elapsedTime:number,
        startTime:number;
    function handleswipe(isRightSwipe:boolean, isLeftSwipe:boolean){
        if (isRightSwipe) {
          vm.showMenu = true;
        } else if (isLeftSwipe){
          vm.showMenu = false;
        }
    }

    touchsurface.addEventListener('touchstart', function(e){
      console.log("touch start", e);
        var touchobj = e.changedTouches[0];
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        slideMenu!.style.transition = "";
        //startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }, false);

    touchsurface.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0];
        dist = touchobj.pageX - startX;
        if ( dist > 0 && !vm.showMenu) {
            if ( dist > slideMenu!.clientWidth ) dist = slideMenu!.clientWidth;
            slideMenu!.style.transform = "translateX(" + (-slideMenu!.clientWidth+dist) + "px)";
        }
        if ( dist <  -document.documentElement.clientWidth*0.15 && vm.showMenu) {
            if ( dist < -slideMenu!.clientWidth ) dist = -slideMenu!.clientWidth;
            slideMenu!.style.transform = "translateX(" + (dist+slideMenu!.clientWidth*0.075) + "px)";
        }
    }, false);

    touchsurface.addEventListener('touchend', function(e){
      console.log("touch end", e);
        var touchobj = e.changedTouches[0];
        slideMenu!.style.transition = "all ease-in-out 0.2s";
        slideMenu!.style.transform = "";
        dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
        //elapsedTime = new Date().getTime() - startTime; // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        var swipeRightBol = ( dist >= threshold );
        var swipeLeftBol = ( dist <= -threshold )
        handleswipe(swipeRightBol, swipeLeftBol);
    }, false);
  }
});
</script>
