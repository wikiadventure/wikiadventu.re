import { ServerPacket, ServerPacketType } from './types';
import type { Player } from "@game/lobby/player/class";
import { wsEmit } from ".";

type ServerPlayerLeft = ServerPacket & {
    id: number
}

export function emitPlayerLeft(players: Player[], player: Player) {
    const data:ServerPlayerLeft = {
        type: ServerPacketType.PlayerLeft,
        id: player.id,
    }
    wsEmit(players, data);

}