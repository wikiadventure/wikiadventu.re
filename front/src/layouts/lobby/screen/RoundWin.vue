<template>
  <div id="round-win" class="absolute-full">
    <exit-btn target="round-win"/>
    <logo-show-in :title="winner" :class="{ lose: hasLose }" ></logo-show-in>
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

import { defineComponent } from '@vue/composition-api';
import { Player } from 'src/store/gameData/state';

export default defineComponent({
  name: 'RoundWin',
  components: { LogoShowIn, ExitBtn },
  props: {
    winner:String,
    hasLose:Boolean
  },
});
</script>
