<template>
  <div class="page-history row justify-center absolute-full">
    <div class="page-history-container shadow-6">
      <exit-btn @click="showPageHistory = false"/>
      <!--TODO: Translation-->
      <div class="page-history-title justify-center">
        {{ winner?.pseudo || t('noWinnerYet') }}
      </div>
      <q-separator/>
      <div class="page-history-page">
        <div v-for="page in winnerPageHistory" :key="page">
          <div>{{ page }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.page-history {
  overflow: hidden;
}
.page-history-container {
  width: Max(50%, 500px);
  position: relative;
  max-width: 100%;
  height: 95%;
  margin: 1.25%;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 600px) {
    margin: 0;
    height: 100%;
    width: 100%;
    border-radius: 0;
  }
}
.page-history-page{
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 4px;
  div {
    flex: 0 0 auto;
    border-radius: 6px;
    margin: 1px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    padding: 3px 6px;
    div {
      padding: 1px 4px;
    }
  }
}
.page-history-title {
  display: inline-flex;
  flex: 0 0 auto;
  margin: 4px;
  font-size: 2em;
}
.page-history-container {
  background: var(--clr-alt);
}
.page-history-page {
  >div {
    background: hsla(0,0%,50%,0.15);
    div {
      color: var(--clr-reverse);
    }
  }
}
</style>
<script lang="ts" setup>
import ExitBtn from 'src/components/ExitButton.vue';
import { showPageHistory } from 'store/gameLayoutManager/state';
import { playerSetup } from 'store/player';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const {
  winner,
  winnerPageHistory
} = playerSetup();
</script>
<i18n lang="yaml">
  en:
    noWinnerYet: "No winner yet!"
  fr:
    noWinnerYet: "Pas encore de gagnant!"
</i18n>
