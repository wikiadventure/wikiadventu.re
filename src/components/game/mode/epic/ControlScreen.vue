<script lang="ts" setup>
import GameModeSelector from '../../GamemodeSelect.vue';
import WikiPagePickModeSelect from '../../WikiPagePickModeSelect.vue';
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
import WikiRandomTypeSelect from '../../WikiRandomTypeSelect.vue';
import LocalSettingsScreen from '../../LocalSettingsScreen.vue';
import SettingIcon from '~icons/ic/round-settings';
import { useEpicGameStore } from '../../../../stores/mode/epic/useEpic';
import DynamicNumberInput from '../../DynamicNumberInput.vue';
import CheckboxInput from '../../CheckboxInput.vue';
import WikiPreview from '../../../wiki/WikiPreview.vue';
import DEBUG from '../../DEBUG.vue';

const { current_phase, store, open_podium, current_round } = useEpicGameStore();

const gamemode_for_restart = ref<Gamemode>("Epic");

function openPodium() {
    open_podium.value = true; 
}

const localSettingsOpen = ref(false);

</script>
<template>
<section class="control-screen mode-epic">
    <ThemePicker/>
    <span class="version">v{{ VERSION }}</span>
    <h1>{{ store.gamemode }} mode</h1>
    <h2>{{ current_phase.type }}</h2>
    <CountDown/>
    <fieldset class="restart-fieldset">
        <legend>restart with gamemode :</legend>
        <GameModeSelector v-model="gamemode_for_restart"/>
        <RestartButton :with-gamemode="gamemode_for_restart"/>
    </fieldset>
    <fieldset class="duration-fieldset">
        <legend>Duration :</legend>
        <DurationInput v-model="store.gamedata.phase_duration.Playing!" duration_display_name="Play"/>
        <DurationInput v-model="store.gamedata.phase_duration.Voting!"  duration_display_name="Vote"/>
        <DurationInput v-model="store.gamedata.remaining_after_win_duration"  duration_display_name="Remaining after win"/>
    </fieldset>
    <fieldset class="epic-mode-fieldset">
        <legend>Epic mode :</legend>
        <DynamicNumberInput input_display_name="Wiki pages pool size" :min="2" :max="500" v-model="store.gamedata.pages_pool_size" />
        <DynamicNumberInput input_display_name="Wiki pages needed to win" :min="2" :max="500" v-model="store.gamedata.pages_found_to_win" />
        <CheckboxInput input_display_name="Order required"  v-model="store.gamedata.pages_pool_order_mandatory"/>
    </fieldset>
    <fieldset class="wiki-settings">
        <legend>Wiki settings : </legend>
        <fieldset class="wiki-lang-fieldset">
            <legend>Wiki language : </legend>
            <WikiLangSelect/>
            <span v-if="current_round?.wiki_lang != null">Current round Wiki language : {{ current_round?.wiki_lang }}</span>
        </fieldset>
        <WikiPagePickModeSelect/>
        <WikiRandomTypeSelect/>
    </fieldset>
    <PageVoteInput/>
    <fieldset class="button-set">
        <GameButton @click="localSettingsOpen = true">Local settings <SettingIcon/></GameButton>
        <FullscreenButton/>
        <GameButton class="leaderboard-button" @click="openPodium">Leaderboard <PodiumIcon/></GameButton>
    </fieldset>
    <StartButton/>
    <details class="wiki-pages-pool" v-if="current_round?.pages_pool">
        <summary>Wiki pages to find</summary>
        <ol>
            <li v-for="preview in current_round.pages_pool">
                <WikiPreview  :wiki-content-preview="preview"/>
            </li>
        </ol>
    </details>
    <div v-if="current_round?.pages_pool?.length">
        
    </div>
    <VoteSkipPlayPhase/>
    <PlayersList/>
    
    <DEBUG/>
</section>
<LocalSettingsScreen v-model="localSettingsOpen"/>
</template>
<style>
.control-screen.mode-epic {
    position: relative;
    padding: 10px;
    display: grid;
    grid-auto-rows: max-content;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    > .theme-picker.select {
        position: absolute;
        top: 15px;
        right: 30px;
    }
    > * {
        grid-column: span 4;
    }

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
    > .duration-fieldset {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 1ch;
        padding-top: 15px;
    }
    > .epic-mode-fieldset {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 1ch;
        padding-top: 15px;
    }
    > .restart-fieldset {
        justify-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1ch;
    }

    > .wiki-settings {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        padding: 15px;
        align-self: center;
    }

    > fieldset, > .wiki-settings > fieldset {
        border: 2px solid lch(20% 55.25 181.75);
        border-radius: 10px;
        width: fit-content;
    }

    > .button-set {
        justify-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 1ch;
        border: none;
    }

    > .wiki-pages-pool {
        > ol {
            list-style: none;
            border: 2px solid cyan;
            border-radius: 5px;
            padding: 0;
            > li {
                background: var(--back-color);
                &:nth-child(2n) {
                    background: var(--back-focus-color);
                }
            }
            /* > li:nth-child(2n) {
                filter: invert(1) brightness(.95) invert(1);
            } */
        }
    }

    .leaderboard-button > span > svg {
        vertical-align: baseline;
    }

}

@media screen and (width > 1900px) {

    .control-screen.mode-classic {
        > .wiki-settings {
            grid-column: span 2;
        }

        > .page-vote-input {
            grid-column: span 2;
        } 
    }
}

</style>
