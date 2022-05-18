import { ServerPacket, ServerPacketType } from './types';
import type { Player } from "@game/lobby/player/class";
import { wsEmit } from ".";

type ServerVoteSkip = ServerPacket & {
    id: number,
    state: boolean
}

export function emitVoteSkip(players: Player[], player:Player) {
    const data:ServerVoteSkip = {
        type: ServerPacketType.VoteSkip,
        id: player.id,
        state: player.voteSkip
    }
    wsEmit(players, data);

}