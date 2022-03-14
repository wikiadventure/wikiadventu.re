<template>
    <div class="time-left">
        <h6>{{ t('timeLeft') }}</h6>
        <h6>{{ timeLeft }}<q-icon size="sm" name="mdi-alarm"/></h6>
    </div>
</template>
<style lang="scss">
.time-left {
    display: flex;
    justify-items: center;
    align-self: center;
    gap: 15px;
    >h6:nth-child(2) {
        min-width: 6ch;
    }
} 

</style>
<script lang="ts" setup>
import { timeLeft } from 'store/lobby/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
  en:
    timeLeft: "Time left"
  fr:
    timeLeft: "Temps restant"
</i18n>
