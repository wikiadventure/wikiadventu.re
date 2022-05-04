import type { Player } from "@game/lobby/player/class";
import { wsEmit } from "../emit";

type ServerVoteResult = ServerPacket & {
    start: string,
    end: string
}

export function emitVoteResult(players: Player[], start:string, end:string) {
    const data:ServerVoteResult = {
        type: VanillaServerPacketType.VoteResult,
        start,
        end
    }
    wsEmit(players, data);

}