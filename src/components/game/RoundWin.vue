<script lang="ts" setup>
import { computed } from 'vue';
import { useGameStore } from '../../stores/useGameStore';

const { store } = useGameStore();

const winners_by_score = computed(()=>
    Object.entries(store.gamedata.round_data[store.gamedata.round.current]?.winners ?? {})
        .map(([player_id, x]) => ({
            ...store.players[player_id],
            score: Object.values(store.gamedata.player_data[player_id] ?? {}).reduce<number>((acc,p)=>acc+p.score,0),
            round_score: x.score,
        }))
        .sort((a,b)=>b.round_score-a.round_score)
)
</script>
<template>
<div class="round-win">
    <span v-if="winners_by_score.length == 0">No winner for this round</span>
    <ul v-else>
        <li v-for="winner in winners_by_score">{{ winner.name }} +{{ winner.round_score }} => {{ winner.score }}</li>
    </ul>
</div>
</template>
<style>
.round-win {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: var(--back-color);
    > span, > ul {
        color: var(--front-color);
        font-size: 3rem;
        font-weight: bolder;
        filter: drop-shadow(0 0 5px cyan);
    }
}
</style>
