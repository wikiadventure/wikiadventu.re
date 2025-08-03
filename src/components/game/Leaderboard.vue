<script lang="ts" setup>
import { computed } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import podium1 from "../../assets/svg/podium1neonV2.svg";
import podium2 from "../../assets/svg/podium2neonV2.svg";
import podium3 from "../../assets/svg/podium3neonV2.svg";

const open = defineModel<boolean>({ required: true });

const { store } = useGameStore();

const players_by_score = computed(() => {
    return Object.values(store.players)
    .concat(Object.values(store.players))
    .concat(Object.values(store.players))
    .concat(Object.values(store.players))
    .concat(Object.values(store.players))
    .concat(Object.values(store.players))
    .concat(Object.values(store.players))
    .map(p => ({
        player: p,
        total_score: 
            Object.values(store.gamedata.player_data[p.id] ?? {})
                .reduce((total,r) => total + r.score, 0)
    })).sort((a,b) => b.total_score - a.total_score);
})

</script>
<template>
<dialog :open="open" class="leaderboard">
    <button @click="open = false">x</button>
    <ol>
        <li>
            <span><img :src="podium1" alt="number 1"></span>
            <span>{{ players_by_score[0]?.player.name ?? "" }}</span>
            <span>{{ players_by_score[0]?.total_score ?? "" }}</span>
        </li>
        <li>
            <span><img :src="podium2" alt="number 2"></span>
            <span>{{ players_by_score[1]?.player.name ?? "" }}</span>
            <span>{{ players_by_score[1]?.total_score ?? "" }}</span>
        </li>
        <li>
            <span><img :src="podium3" alt="number 3"></span>
            <span>{{ players_by_score[2]?.player.name ?? "" }}</span>
            <span>{{ players_by_score[2]?.total_score ?? "" }}</span>
        </li>
        <li v-for="(player,i) in players_by_score.slice(3)">
            <span>{{ i+4 }}</span>
            <span>{{ players_by_score[i+3]?.player.name ?? "" }}</span>
            <span>{{ players_by_score[i+3]?.total_score ?? "" }}</span>
        </li>
    </ol>
</dialog>
</template>
<style>
.leaderboard {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow-y: scroll;
    padding: 10px;
    > button {
        position: fixed;
        top: 15px;
        right: 25px;
        border-radius: 50px;
        &:hover {
            cursor: pointer;
        }
    }
    > ol {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* gap: 10px; */
        margin: 0;
        padding: 0;
        > li {
            display: flex;
            &:nth-child(n+4) {
                justify-content: center;
                align-items: center;
                > span {
                    padding: 5px;
                    &:nth-child(3) {
                        flex: 1 1;
                        max-width: 800px;
                        text-align: end;
                    }
                }
            }
            &:nth-child(2n+4) {
                > span {
                    background: #0002;
                }
            }
            > span {
                display: block;
                text-align: center;
                &:nth-child(1) {
                    flex: 0 0;
                }
                &:nth-child(2) {
                    flex: 0 0;
                }
                &:nth-child(3) {
                    flex: 1 1;
                    text-align: end;
                }
                > img {
                    width: min(25vw + 300px, 50vw);
                    height: auto;
                }
            }
        }
    }
}

@media screen and (width >= 1000px) {
    .leaderboard {

        > button {

        }
        > ol {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            > li {
                flex: 1;
                &:nth-child(-n+3) {
                    display: flex;
                    flex-direction: column;
                    > span {
                        flex: 1;
                        text-align: center;
                    }
                }
                &:nth-child(1) {
                    flex: 2;
                    order: 1;
                }

                &:nth-child(2) {
                    flex: 1.5;
                    order: 0;
                    align-self: flex-end;
                }

                &:nth-child(3) {
                    flex: 1.5;
                    order: 2;
                    align-self: flex-end;
                }
                &:nth-child(n+4) {
                    order: 4;
                    flex-basis: 100%;
                }
                > span {
                    width: 100%;
                    > img {
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }
    }
}
</style>