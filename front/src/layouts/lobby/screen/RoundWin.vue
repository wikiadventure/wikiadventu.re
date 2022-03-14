<template>
  <div class="round-win absolute-full">
    <!--TODO: Translation -->
    <logo-show-in :title="winner?.pseudo || t('noWinner')" :class="{ lose: !isWinner }" ></logo-show-in>
    <exit-btn @click="showRoundWin = false"/>
  </div>
</template>
<style lang="scss">
.round-win {
  background: rgba(0,0,0,0.5);
  .lose {
    filter: hue-rotate(180deg);
  }
}
</style>
<script lang="ts" setup>
import ExitBtn from 'src/components/ExitButton.vue';
import LogoShowIn from 'src/components/art/LogoShowIn.vue';
import { watch } from 'vue';
import { playerSetup } from 'store/player';
import { loseSound } from 'store/audio/vanilla/lose';
import { winSound } from 'store/audio/vanilla/win';
import { showRoundWin } from 'store/gameLayoutManager/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const {
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
</script>
<i18n lang="yaml">
  en:
    noWinner: "No winner"
  fr:
    noWinner: "Pas de gagnant"
</i18n>
