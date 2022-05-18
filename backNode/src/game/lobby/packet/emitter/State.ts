import { ServerPacket, ServerPacketType } from './types';
import type { GameModType } from './../../gameMode/types';
import type { GamePhaseType } from "@game/lobby/gameMode/gamePhase/types";
import type { Player } from "@game/lobby/player/class";
import { wsEmit } from ".";

type ServerGamePhase = ServerPacket & {
    gameMode: GameModType,
    gamePhase: GamePhaseType,
    round: number,
    time: number,
    data?: any
}

export function emitState(players: Player[], gameMode:GameModType, gamePhase:GamePhaseType, round:number, time:number = -1, data?: any) {
    const packet:ServerGamePhase = {
        type: ServerPacketType.State,
        gameMode,
        gamePhase,
        round,
        time,
        data
    }
    wsEmit(players, packet);
}