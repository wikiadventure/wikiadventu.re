import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerSetOwner = ServerPacket & {
    id: number
}

export function emitSetOwner(players: Player[], ownerId: number) {
    const data:ServerSetOwner = {
        type: VanillaServerPacketType.SetOwner,
        id: ownerId
    }
    wsEmit(players, data);

}