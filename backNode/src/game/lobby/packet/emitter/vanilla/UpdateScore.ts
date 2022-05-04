import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerUpdateScore = ServerPacket & {
    id: number,
    score: number
}

export function emitUpdateScore(players: Player[], player: Player) {
    const data:ServerUpdateScore = {
        type: VanillaServerPacketType.UpdateScore,
        id: player.id,
        score: player.score
    }
    wsEmit(players, data);

}