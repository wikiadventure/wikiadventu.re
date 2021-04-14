<template>
  <q-select
    @input="onSelect($event)" name="gameLoop" outlined hint=""
    :options="options" :label="$t('input.gameLoop')" 
    :value="getGameLoop" :display-value="getGameLoopLabel"
    v-bind="$attrs" v-on="$listeners"
  >
  </q-select>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { GameLoopType } from '../../store/gameData/type/gameLoop';

export default defineComponent({
  name: 'GameLoopSelect',
  methods: {
    onSelect(event:any) {
      this.$store.commit('globalForm/setGameLoop', event.value);
    }
  },
  computed: {
    options():Array<{ value:string, label:string }> {
      var vm = this;
      var optionsList:Array<{ value:string, label:string }> = [];
      var gameLoopEnum = Object.keys(GameLoopType);
      gameLoopEnum.splice(gameLoopEnum.length/2);
      gameLoopEnum.map(key => optionsList.push({value: key, label: vm.$t('gameLoop.'+key) as string}));
      return optionsList;
    },
    getGameLoop():string {
      return this.$store.state.globalForm.gameLoop;
    },
    getGameLoopLabel():string {
     return this.$t('gameLoop.'+this.$store.state.globalForm.gameLoop) as string;
    }
  }
});
</script>