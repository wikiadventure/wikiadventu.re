<script lang="ts" setup>
import { computed } from 'vue';
import { useClassicGameStore } from '../../../../stores/mode/classic/useClassic';

const { my_player_round_data, connectedPlayerIds, store, current_phase } = useClassicGameStore();

const connected_players_amount = computed(() => connectedPlayerIds.size);

const players_vote_skip_amount = computed(() => {
    return [...connectedPlayerIds.values()].reduce((acc,player_id) => {
        return store.gamedata.player_data[player_id][store.gamedata.round.current].vote_skip ? acc +1 : acc;
    },0);
})

</script>
<template>
<div v-if="current_phase.type == 'Playing'" class="vote-skip-play-phase" :has-vote-skip="my_player_round_data.vote_skip">
    <span>Vote to skip the play phase :</span>
    <input type="checkbox" name="vote-skip" v-model="my_player_round_data.vote_skip" />
    <span>{{ players_vote_skip_amount }} / {{ connected_players_amount }}</span>
</div>
</template>
<style>
.vote-skip-play-phase {
    &[has-vote-skip="true"] {
        span:nth-child(3) {
            color: green;
        }
    }
}
</style>
