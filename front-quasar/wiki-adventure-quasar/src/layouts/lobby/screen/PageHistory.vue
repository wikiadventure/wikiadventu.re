<template>
  <div id="page-history" class="row justify-center absolute-full">
    <div class="page-history-container shadow-6">
      <exit-btn target="page-history"/>
      <div class="page-history-title justify-center">
        {{ winner }}
      </div>
      <q-separator/>
      <div class="page-history-page">
        <div v-for="page in pages" :key="page">
          <div>{{ page }}</div>
        </div>
      </div>
  </div>
</template>
<style lang="scss">
#page-history {
  overflow: hidden;
  z-index: 3;
}
.page-history-container {
  width: Max(50%, 500px);
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
  overflow-x: auto;
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
    align-items: end;
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
    background: var(--w-color-almost-black);
  }
  .page-history-page {
    background: var(--w-color-almost-black);
    div {
      background: #191919;
      div {
        color: var(--w-color-blue-white);
      }
    }
  }
  .page-history-title {
    color: var(--w-color-blue-white);
  }
}
.body--light {
  .page-history-container {
    background: var(--w-color-light-teal);
  }
  .page-history-page {
    background: var(--w-color-light-teal);
    div {
      background: var(--w-color-blue-white);
      div {
        color: var(--w-color-almost-black);
      }
    }
  }
  .page-history-title {
    color: var(--w-color-blue-white);
  }
}
</style>
<script lang="ts">
import ExitBtn from '../../../components/ExitButton.vue';

import { defineComponent } from '@vue/composition-api';
import { Player } from '../../../store/gameData/state';

export default defineComponent({
  name: 'Wait',
  components: { ExitBtn },
  props: {
    player:String,
    toggle:Boolean
  },
  computed: {
    pages():string[] {
      return this.$store.state.gameData.winnerPageHistory as string[];
    }
  }
});
</script>
