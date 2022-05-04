import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerPath = ServerPacket & {
    id: number,
    pages: string[],
    time: number
}

export function emitMessage(players:Player[], player:Player, time:number) {
    const data:ServerPath = {
        type: VanillaServerPacketType.Path,
        id: player.id,
        pages: player.pageList,
        time: time
    }
    wsEmit(players, data);

}
