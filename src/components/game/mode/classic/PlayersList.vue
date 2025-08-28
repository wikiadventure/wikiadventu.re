<script lang="ts" setup>
import { useGameStore } from '../../../../stores/useGameStore';
import CrownIcon from '~icons/mdi/crown';
import ConnectedIcon from '~icons/hugeicons/wifi-connected-03';
import DisconnectedIcon from '~icons/hugeicons/wifi-disconnected-03';
import SkipIcons from '~icons/material-symbols/skip-next-rounded';

const { store, connectedPlayerIds, current_phase, player_id } = useGameStore();
player_id
</script>
<template>
<ul class="player-list">
    <li v-for="player in store.players" :me="player.id == player_id ? '' : null">
        <div>{{ player.name }}</div>

        <div>score : {{ Object.values(store.gamedata.player_data[player.id] ?? {}).reduce<number>((acc,p)=>acc+p.score,0) }}</div>
        
        <div connected v-if="connectedPlayerIds.has(player.id)">
            <ConnectedIcon/> connected
        </div>
        <div disconnected v-else>
            <DisconnectedIcon/> disconnected
        </div>

        <div><CrownIcon v-if="player.id == store.host_id" :title="`${player.name} is the host`"/></div>

        <div v-if="current_phase.type == 'Playing' && store.gamedata.player_data[player.id][store.gamedata.round.current].vote_skip">
            <SkipIcons/> voted for skip
        </div>
        <div v-else></div>
    </li>
</ul>
</template>
<style>
.player-list { 
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    > li {
        border: 2px solid var(--front-color);
        border-radius: 10px;
        display: grid;
        gap: 2px;
        padding: 4px;

        grid-template-areas: 
            "c c v"
            "h n s";
        grid-template-columns: 1.2em 30fr 17fr;
        max-width: 70ch;
        &[me] {
            border-color: #0d69be;
            > :nth-child(1) {
                color: #0d69be;
            }
        }
        [connected] {
            color: green;
        }
        [disconnected] {
            color: red;
        }

        > :nth-child(1) {
            grid-area: n;/*name*/
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        > :nth-child(2) {
            grid-area: s;/*score*/
        }
        > :nth-child(3) {
            grid-area: c;/*connected*/
            > svg {
                vertical-align: middle;
            }
        }
        > :nth-child(4) {
            grid-area: h;/*host*/
            width: 1.2em;
            height: 1.2em;
            color: goldenrod;
        }
        > :nth-child(5) {
            grid-area: v;/*voteskip*/
            color: purple;
            text-align: end;
            > svg {
                vertical-align: middle;
            }
        }
    }
}
</style>
