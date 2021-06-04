<template>
  <q-select
    @input="onSelect($event)" name="gameLoop" outlined hint=""
    :options="options" :label="$t('input.gameLoop')" behavior="dialog"
    :value="getGameLoop" :display-value="getGameLoopLabel"
    :dense="$q.screen.lt.sm" v-bind="$attrs" v-on="$listeners"
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-icon size="65px" :name="scope.opt.icon"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.title }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { GameLoopType, icon } from 'src/store/gameData/type/gameLoop';

export default defineComponent({
  name: 'GameLoopSelect',
  methods: {
    onSelect(event:any) {
      this.$store.commit('globalForm/setGameLoop', event.value);
    }
  },
  computed: {
    options():Array<{ value:string, title:string, icon:string, description:string }> {
      var vm = this;
      var optionsList:Array<{ value:string, title:string, icon:string, description:string }> = [];
      var gameLoopEnum = Object.keys(GameLoopType);
      gameLoopEnum.splice(gameLoopEnum.length/2);
      gameLoopEnum.map(key => optionsList.push({value: key, title: vm.$t('gameLoop.'+key) as string, icon: icon(Number(key)), description: vm.$t('gameLoop.description.'+key) as string}));
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