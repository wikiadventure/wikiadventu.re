import { ServerPacket, ServerPacketType } from './types';
import type { Player } from "@game/lobby/player/class";
import { wsEmit } from ".";

type ServerSetOwner = ServerPacket & {
    id: number
}

export function emitSetOwner(players: Player[], ownerId: number) {
    const data:ServerSetOwner = {
        type: ServerPacketType.SetOwner,
        id: ownerId
    }
    wsEmit(players, data);

}