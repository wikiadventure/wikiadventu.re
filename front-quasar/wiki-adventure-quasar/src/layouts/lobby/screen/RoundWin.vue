<template>
  <div id="round-win">
    <exit-btn target="round-win"/>
    <logo-show-in :title="winner" ></logo-show-in>
  </div>
</template>
<style lang="scss">
#round-win {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  z-index: 10;
  opacity: 0;
  transition: all ease-in-out 0.2s;
}
</style>
<script lang="ts">
import ExitBtn from '../../../components/ExitButton.vue'
import LogoShowIn from '../../../components/art/LogoShowIn.vue';

import { defineComponent } from '@vue/composition-api';
import { Player } from '../../../store/gameData/state';

export default defineComponent({
  name: 'RoundWin',
  components: { LogoShowIn, ExitBtn },
  computed: {
    winner():Player {
      return this.$store.getters.gameData.winner;
    }
  }
});
</script>
