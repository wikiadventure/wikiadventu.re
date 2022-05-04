import type { GamePhaseType } from "@game/lobby/gameMode/gamePhase/types";
import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerGamePhase = ServerPacket & {
    gamePhase: GamePhaseType,
    round: number,
    time: number
}

export function emitGamePhase(players: Player[], gamePhase:GamePhaseType, currentRound:number, timeleft:number = -1) {
    const data:ServerGamePhase = {
        type: VanillaServerPacketType.GamePhase,
        gamePhase: gamePhase,
        round: currentRound,
        time: timeleft
    }
    wsEmit(players, data);
}