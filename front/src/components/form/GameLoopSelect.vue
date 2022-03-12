<template>
  <q-select
    v-model="gameLoop" name="gameLoop" outlined hint=""
    :options="gameLoops" :label="t('gameLoop')" behavior="dialog"
    :display-value="t('gameLoop.'+gameLoop)"
    :dense="$q.screen.lt.sm" v-bind="$attrs"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon size="65px" :name="gameLoopIcon(scope.opt)"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ t('gameLoops.'+scope.opt) }}</q-item-label>
          <q-item-label caption>{{ t('gameLoop.description.'+scope.opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { gameLoopIcon, ModLoopType, VanillaLoopType } from 'store/lobby/game/loop/type';
import { gameLoop } from 'store/connect/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
const gameLoops = Object.values(VanillaLoopType).concat(Object.values(ModLoopType)).filter(v=>Number.isInteger(v));
</script>
<i18n lang="yaml">
  en:
    gameLoop: "Game mode"
    gameLoops:
      0: "Classic"
      1: "Random"
      description:
        0: ""
        1: ""
  fr:
    gameLoop: "Mode de jeu"
    gameLoops:
      0: "Classique"
      1: "Aléatoire"
      description:
        0: ""
        1: ""
</i18n>