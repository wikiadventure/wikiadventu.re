<script lang="ts" setup>
import { useClassicGameStore } from '../../../../stores/mode/classic/useClassic';
import CrownIcon from '~icons/mdi/crown';

const { remainCountDownSeconds, countDown, current_phase, store } = useClassicGameStore();

</script>
<template>
<span v-if="current_phase.duration >= 0" class="count-down">{{ remainCountDownSeconds }}s</span>
<span v-else class="count-down">Wait for host (<CrownIcon/>{{ store.players[store.host_id].name }}) to start</span>
</template>
<style>
.count-down {
    min-width: calc(20px + 5ch);
    padding: 10px;
    border: 1px solid #0002;
    border-radius: 10px;
    background: #fff4;
    backdrop-filter: blur(2px);
    text-align: end;
    > svg {
        color: goldenrod;
        vertical-align: middle;
    }
}
</style>
