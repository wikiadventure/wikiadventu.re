<script lang="ts" setup>
import { useGameStore } from '../../../../stores/useGameStore';
import CrownIcon from '~icons/mdi/crown';
import ConnectedIcon from '~icons/hugeicons/wifi-connected-03';
import DisconnectedIcon from '~icons/hugeicons/wifi-disconnected-03';

const { store, connectedPlayerIds } = useGameStore();

</script>
<template>
<ul class="player-list">
    <li v-for="player in store.players">
        <div>{{ player.name }}</div>
        
        <div>score : {{ Object.values(store.gamedata.player_data[player.id] ?? {}).reduce<number>((acc,p)=>acc+p.score,0) }}</div>
        
        <div connected v-if="connectedPlayerIds.has(player.id)">
            <ConnectedIcon/> connected
        </div>
        <div disconnected v-else>
            <DisconnectedIcon/> disconnected
        </div>

        <div><CrownIcon v-if="player.id == store.host_id" :title="`${player.name} is the host`"/></div>
    </li>
</ul>
</template>
<style>
.player-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
    > li {
        border: 1px solid #000;
        border-radius: 10px;
        display: grid;
        gap: 2px;
        padding: 4px;

        grid-template-areas: 
            "c c c"
            "h n s";
        grid-template-columns: 1.2em 30fr 17fr;
        max-width: 70ch;
        [connected] {
            color: green;
        }
        [disconnected] {
            color: red;
        }

        :nth-child(1) {
            grid-area: n;/*name*/
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        :nth-child(2) {
            grid-area: s;/*score*/
        }
        :nth-child(3) {
            grid-area: c;/*connected*/
        }
        :nth-child(4) {
            grid-area: h;/*host*/
            width: 1.2em;
            height: 1.2em;
            color: goldenrod;
        }
    }
}
</style>
