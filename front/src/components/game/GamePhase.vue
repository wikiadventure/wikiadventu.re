<template>
    <div class="game-phase">
        <h4>{{ t('round') }} {{ round }}</h4>
        <h4>{{ t('phase.'+gamePhase) }}</h4>
    </div>
</template>
<style lang="scss">
.game-phase {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 15px;
}
</style>
<script lang="ts" setup>
import { gamePhase, round } from 'store/lobby/state';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>
<i18n lang="yaml">
    en:
        round: "Round"

    fr:
        round: "Manche"
</i18n>
<i18n lang="yaml">
    en:
        phase:
            0: "Waiting player"
            1: "Voting"
            2: "Searching"
            3: "Result"
            4: "Game end"
    fr:
        phase:
            0: "En attente de joueurs"
            1: "Vote"
            2: "Recherche"
            3: "Résultat"
            4: "Fin de partie"
</i18n>
