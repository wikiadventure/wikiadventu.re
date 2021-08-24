<template>
  <div id="round-win" class="absolute-full">
    <logo-show-in :title="winner?.pseudo || 'No Winner Yet'" :class="{ lose: !isWinner }" ></logo-show-in>
    <exit-btn @click="showRoundWin = false"/>
  </div>
</template>
<style lang="scss">
#round-win {
  background: rgba(0,0,0,0.5);
}
.lose {
  filter: hue-rotate(180deg);
}
</style>
<script lang="ts">
import ExitBtn from 'src/components/ExitButton.vue';
import LogoShowIn from 'src/components/art/LogoShowIn.vue';

import { defineComponent, watch } from 'vue';
import { playerSetup } from 'store/player';
import { gameLayoutManagerSetup } from 'store/gameLayoutManager';
import { loseSound } from 'store/audio/vanilla/lose';
import { winSound } from 'store/audio/vanilla/win';
import { selfId } from 'store/player/state';

export default defineComponent({
  name: 'RoundWin',
  components: { LogoShowIn, ExitBtn },
  setup() {
    var { showRoundWin } = gameLayoutManagerSetup();
    var {
      isWinner,
      winner
    } = playerSetup();

    watch(showRoundWin,(s) => {
      if (s) isWinner.value ? winSound.play() : loseSound.play();
      else {
        const a = isWinner.value ? winSound : loseSound;
        a.pause();
        a.currentTime = 0;
      }
    });
    
    return {
      showRoundWin,
      isWinner,
      winner
    }
  },
});
</script>
