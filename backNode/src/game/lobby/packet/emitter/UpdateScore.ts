import { ServerPacket, ServerPacketType } from './types';
import type { Player } from "@game/lobby/player/class";
import { wsEmit } from ".";

type ServerUpdateScore = ServerPacket & {
    id: number,
    score: number
}

export function emitUpdateScore(players: Player[], player: Player) {
    const data:ServerUpdateScore = {
        type: ServerPacketType.UpdateScore,
        id: player.id,
        score: player.score
    }
    wsEmit(players, data);

}