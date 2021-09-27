<template>
  <q-expansion-item class="extra-config" switch-toggle-side expand-separator
    label="Game mode config" expand-icon="mdi-cog">
    <component :is="config" />
  </q-expansion-item>
</template>
<style lang="scss">
.extra-config {
  grid-column: span 2;
  .q-expansion-item__content {
    display: grid;
    gap: 5px 20px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    justify-content: space-evenly;
    @media(max-width: $breakpoint-xs-max) {
      > * {
        grid-column: span 2;
      }
    }
  }
}
</style>
<script lang="ts">
import { defineComponent, defineAsyncComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { gameLoop } from "store/connect/state";
import { VanillaLoopType, ModLoopType } from "store/lobby/game/loop/type";

export default defineComponent({
  name: 'ExtraConfig',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const gameLoopName = computed(() => VanillaLoopType[gameLoop.value] || ModLoopType[gameLoop.value] );
    const isMod = computed(() => ModLoopType[gameLoop.value] != null );
    const config = computed(() => defineAsyncComponent(()=>import(`./configs/${(isMod.value ? "mod/" :"") + gameLoopName.value}Config.vue`)));
    return {
      t,
      config
    }
  }
});
</script>