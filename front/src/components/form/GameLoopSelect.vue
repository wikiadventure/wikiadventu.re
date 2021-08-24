<template>
  <q-select
    v-model="gameLoop" name="gameLoop" outlined hint=""
    :options="gameLoops" :label="t('input.gameLoop')" behavior="dialog"
    :display-value="t('gameLoop.'+gameLoop)"
    :dense="$q.screen.lt.sm" v-bind="$attrs"
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-icon size="65px" :name="gameLoopIcon(scope.opt)"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ t('gameLoop.'+scope.opt) }}</q-item-label>
          <q-item-label caption>{{ t('gameLoop.description.'+scope.opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script lang="ts">
import { gameLoopIcon, VanillaLoopType } from 'store/lobby/game/loop/type';
import { gameLoop } from 'store/lobby/state';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'GameLoopSelect',
  setup() {
    const { t } = useI18n();
    var gameLoops = Object.values(VanillaLoopType)/*.concat(Object.values(ModLoopType))*/;
    return {
      gameLoops,
      gameLoop,
      gameLoopIcon,
      t
    }
  }
});
</script>