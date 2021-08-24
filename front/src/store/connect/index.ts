import { lang, gameLoop, slot } from "store/lobby/state"
import { randomizePseudo } from "./randomPseudo/generator"
import { pseudo, connecting } from "./state"

export function connectSetup() {
    return {
        lang,
        pseudo,
        gameLoop,
        slot,
        connecting,
        randomizePseudo
    }
}
