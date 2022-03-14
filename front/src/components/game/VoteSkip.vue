<template>
  <div class="vote-skip">
    <p :class="{ 'self': selfPlayer?.voteSkip }">
      {{ playersVoteSkip.length }} / {{ playersConnected.length }}
    </p>
    <q-btn class="action-btn" push :label="t('skip')"
      icon="mdi-skip-forward" @click="sendVoteSkip()"/>
  </div>
</template>
<style lang="scss">
.vote-skip {
  display: flex;
  justify-content: space-evenly;
  align-self: center;
  align-items: center;
  gap: 30px;
  p {
    margin: 0;
  }
  .self {
    color: var(--w-color-dark-teal);
  }
}
</style>
<script lang="ts" setup>
import { playersConnected, playersVoteSkip, selfPlayer } from 'store/player/computed';
import { sendVoteSkip } from 'store/ws/packetSender/vanilla/voteSkip';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    skip: "skip"
  fr:
    skip: "skip"
</i18n>
