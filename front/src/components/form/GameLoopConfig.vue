<template>
  <q-expansion-item class="extra-config" switch-toggle-side expand-separator
    :label="t('gameLoopConfig')" expand-icon="mdi-cog">
    <component :is="config" />
  </q-expansion-item>
</template>
<style lang="scss">
.extra-config {
  grid-column: span 2;
  .q-expansion-item__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    gap: 5px 20px;
    justify-content: space-evenly;
    @media(max-width: $breakpoint-xs-max) {
      > * {
        grid-column: span 2;
      }
    }
  }
}
</style>
<script lang="ts" setup>
import { defineAsyncComponent, ref, Component, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { gameLoop } from "store/connect/state";
import { VanillaLoopType, ModLoopType, GameLoopType } from "store/lobby/game/loop/type";

const { t } = useI18n({ useScope: 'local' });

    function setConfig(gameLoop:GameLoopType):Component {
      var isMod = false;
      var gameLoopName = VanillaLoopType[gameLoop] || (()=>{isMod=true; return ModLoopType[gameLoop]});
      return defineAsyncComponent(()=>import(`./configs/${(isMod ? "mod/" :"") + gameLoopName}Config.vue`));
    }
    const config = ref(setConfig(gameLoop.value));
    watch(gameLoop,() => config.value = setConfig(gameLoop.value));
</script>
<i18n lang="yaml">
  en:
    gameLoopConfig: "Game mode configuration"
  fr:
    gameLoopConfig: "Configuration du mode de jeu"
</i18n>