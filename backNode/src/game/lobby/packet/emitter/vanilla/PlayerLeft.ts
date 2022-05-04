import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerPlayerLeft = ServerPacket & {
    id: number
}

export function emitPlayerLeft(players: Player[], player: Player) {
    const data:ServerPlayerLeft = {
        type: VanillaServerPacketType.PlayerLeft,
        id: player.id,
    }
    wsEmit(players, data);

}