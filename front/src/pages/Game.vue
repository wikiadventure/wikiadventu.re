<template>
  <suspense>
    <component :is="gameComponent"/>
  </suspense>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';
import { ModLoopType, VanillaLoopType } from 'store/lobby/game/loop/type';
import { gameLoop } from 'store/connect/state';
import { onBeforeRouteLeave } from "vue-router";
import { useI18n } from 'vue-i18n';
import { chatReset } from 'store/chat/state';
import { gameLayoutManagerReset } from 'store/gameLayoutManager/state';
import { lobbyReset } from 'store/lobby/state';
import { playerReset } from 'store/player/state';
import { voteReset } from 'store/vote/state';

chatReset();
    gameLayoutManagerReset();
    lobbyReset();
    playerReset();
    voteReset();
    const { t } = useI18n({ useScope: 'local' });
    const gameLoopName = computed(() => VanillaLoopType[gameLoop.value] || ModLoopType[gameLoop.value] );
    const isMod = computed(() => ModLoopType[gameLoop.value] != null );

    onBeforeRouteLeave((to, from, next) => next(window.confirm(t('exitWarn'))));

    const gameComponent = computed(() => defineAsyncComponent(()=>import(`./gameMode/${(isMod.value ? "mod/" :"") + gameLoopName.value}.vue`)));
</script>
<i18n lang="yaml">
  en:
    exitWarn: "Do you really want to leave the party?"
  fr:
    exitWarn: "Voulez-vous vraiment quitter la partie?"
</i18n>

