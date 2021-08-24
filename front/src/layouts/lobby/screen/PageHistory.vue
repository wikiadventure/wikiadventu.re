<template>
  <div id="page-history" class="row justify-center absolute-full">
    <div class="page-history-container shadow-6">
      <exit-btn @click="showPageHistory = false"/>
      <div class="page-history-title justify-center">
        {{ winner?.pseudo || "no winner Yet" }}
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
#page-history {
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
.body--dark {
  .page-history-container {
    background: var(--wa-color-almost-black);
  }
  .page-history-page {
    background: var(--wa-color-almost-black);
    div {
      background: #191919;
      div {
        color: var(--wa-color-blue-white);
      }
    }
  }
  .page-history-title {
    color: var(--wa-color-blue-white);
  }
}
.body--light {
  .page-history-container {
    background: var(--wa-color-light-teal);
  }
  .page-history-page {
    background: var(--wa-color-light-teal);
    div {
      background: var(--wa-color-blue-white);
      div {
        color: var(--wa-color-almost-black);
      }
    }
  }
  .page-history-title {
    color: var(--wa-color-blue-white);
  }
}
</style>
<script lang="ts">
import ExitBtn from 'src/components/ExitButton.vue';

import { defineComponent } from 'vue';
import { showPageHistory } from 'store/gameLayoutManager/state';
import { winnerPageHistory } from 'store/player/state';
import { playerSetup } from 'store/player';

export default defineComponent({
  name: 'Wait',
  components: { ExitBtn },
  setup() {
    var {
      winner,
      winnerPageHistory
    } = playerSetup();
    return {
      showPageHistory,
      winner,
      winnerPageHistory
    }
  }
});
</script>
