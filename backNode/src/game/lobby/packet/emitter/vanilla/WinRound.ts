import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerWinRound = ServerPacket & {
    id: number
}

export function emitWinRound(players: Player[], player:Player) {
    const data:ServerWinRound = {
        type: VanillaServerPacketType.WinRound,
        id: player.id
    }
    wsEmit(players, data);

}