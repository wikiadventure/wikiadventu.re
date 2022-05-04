import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerMessage = ServerPacket & {
    id: number,
    data: string
}

export function emitMessage(players: Player[], message:string, from?:Player) {
    const data:ServerMessage = {
        type: VanillaServerPacketType.Message,
        id: from == null ? -1 : from.id,
        data: message
    }
    wsEmit(players, data);

}