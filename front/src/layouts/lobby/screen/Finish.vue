<template>
  <div id="round-win" class="absolute-full">
    <exit-btn target="round-win"/>
    <div></div>
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

import { defineComponent } from '@vue/composition-api';
import { Player } from 'src/store/gameData/state';

export default defineComponent({
  name: 'RoundWin',
  components: { ExitBtn }
});
</script>
