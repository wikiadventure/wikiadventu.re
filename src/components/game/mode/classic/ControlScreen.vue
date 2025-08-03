<script lang="ts" setup>
import DEBUG from '../../DEBUG.vue';
import GameModeSelector from '../../GameModeSelector.vue';
import WikiPagePickModeSelect from '../../WikiPagePickModeSelect.vue';
import { useClassicGameStore } from '../../../../stores/mode/classic/useClassic';
import PageVoteInput from '../../PageVoteInput.vue';
import PlayersList from './PlayersList.vue';
import CountDown from './CountDown.vue';
import StartButton from './StartButton.vue';
import RestartButton from '../../RestartButton.vue';
import type { Gamemode } from '../../../../stores/game';
import { ref } from 'vue';

const { current_phase, store } = useClassicGameStore();

const gamemode_for_restart = ref<Gamemode>("Classic");

</script>
<template>
<section class="control-screen mode-classic">
   <h1>{{ store.gamemode }} mode</h1>
   <h2>{{ current_phase.type }}</h2>
    <CountDown/>
    <span>
        restart with gamemode : <GameModeSelector v-model="gamemode_for_restart"/> <RestartButton :with-gamemode="gamemode_for_restart"/>
    </span>
    <WikiPagePickModeSelect/>
    <PageVoteInput/>
    <StartButton/>
   <PlayersList/>
   <DEBUG/>
</section>
</template>
<style>
.control-screen.mode-classic {
    padding: 10px;
    display: grid;
    gap: 10px;
    .page-vote-input {
        max-width: 75ch;
    }
    > h1, > h2 {
        text-align: center;
    }
    .count-down {
        justify-self: center;
    }
}
</style>
