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
import { VERSION, type Gamemode } from '../../../../stores/game';
import { ref } from 'vue';
import VoteSkipPlayPhase from './VoteSkipPlayPhase.vue';
import DurationInput from '../../DurationInput.vue';
import GameButton from '../../GameButton.vue';
import PodiumIcon from '~icons/game-icons/podium'
import ThemePicker from '../../../ThemePicker.vue';
import WikiLangSelect from '../../WikiLangSelect.vue';
import FullscreenButton from '../../FullscreenButton.vue';

const { current_phase, store, open_podium, current_round } = useClassicGameStore();

const gamemode_for_restart = ref<Gamemode>("Classic");

function openPodium() {
    open_podium.value = true; 
}

</script>
<template>
<section class="control-screen mode-classic">
    <ThemePicker/>
    <span class="version">v{{ VERSION }}</span>
    <h1>{{ store.gamemode }} mode</h1>
    <h2>{{ current_phase.type }}</h2>
    <CountDown/>
    <span>
        restart with gamemode : <GameModeSelector v-model="gamemode_for_restart"/> <RestartButton :with-gamemode="gamemode_for_restart"/>
    </span>
    <span class="duration-container">
        <DurationInput v-model="store.gamedata.phase_duration.Playing" phase_display_name="Play"/>
        <DurationInput v-model="store.gamedata.phase_duration.Voting"  phase_display_name="Vote"/>
        <DurationInput v-model="store.gamedata.remaining_after_win_duration"  phase_display_name="Remaining after win"/>
    </span>
    <span class="wiki-lang-container">
        <span>Wiki language : </span>
        <WikiLangSelect/>
        <span v-if="current_round?.wiki_lang != null">Current round Wiki language : {{ current_round?.wiki_lang }}</span>
    </span>
    <WikiPagePickModeSelect/>
    <PageVoteInput/>
    <FullscreenButton/>
    <GameButton @click="openPodium">Leaderboard <PodiumIcon/></GameButton>
    <StartButton/>
    <VoteSkipPlayPhase/>
    <PlayersList/>
    <!-- <DEBUG/> -->
</section>
</template>
<style>
.control-screen.mode-classic {
    position: relative;
    > .theme-picker {
        position: absolute;
        top: 15px;
        right: 15px;
    }
    padding: 10px;
    display: grid;
    grid-auto-rows: max-content;
    grid-column: auto;
    gap: 10px;
    .page-vote-input {
        max-width: 75ch;
    }
    .wiki-lang-select {
        max-width: 25ch;
    }
    > h1, > h2 {
        text-align: center;
    }
    .count-down {
        justify-self: center;
    }
    > .version {
        text-align: center;
    }
    > .duration-container {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 1ch;
    }
}
</style>
