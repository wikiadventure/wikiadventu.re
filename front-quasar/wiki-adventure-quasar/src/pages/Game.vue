<template>
  <div>
    <game-slide-menu/>
    <wiki-page ref="wikiPage"/>
  </div>
</template>
<script lang="ts">
import GameSlideMenu from "../layouts/lobby/GameSlideMenu.vue";
import WikiPage from "../layouts/lobby/WikiPage.vue";

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Index',
  components: { GameSlideMenu, WikiPage },
  data():{
    unsubscribe:() => void
  } {
    return {
      unsubscribe: () => {}
    }
  },
  mounted() {
    this.$store.dispatch('gameData/connect');
  },
  methods: {
    getStartingPage(url:string) {
      this.$emit('id-selected', 1)
    }
  },
  created() {
    /*this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'gameData/voteResult') {
        this.getStartingPage(state.gameData.startPage);
      }
    });*/
  },
  beforeDestroy() {
    this.unsubscribe!();
  }
});
</script>