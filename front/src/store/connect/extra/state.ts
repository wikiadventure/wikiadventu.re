import { VanillaLoopType } from 'store/lobby/game/loop/type';
import { gameLoop } from '../state';
import { ref } from "vue";

export const round = ref(3);
export const voteDuration = ref(60);//in second
export const playDuration = ref(600);//in second

export function setConfig() {
    switch (gameLoop.value) {
        case VanillaLoopType.Classic:
            return {
                round: round.value, 
                voteDuration: voteDuration.value,
                playDuration: playDuration.value
            }
        case VanillaLoopType.Random:
            return {
                round: round.value, 
                playDuration: playDuration.value
            }
    }
}