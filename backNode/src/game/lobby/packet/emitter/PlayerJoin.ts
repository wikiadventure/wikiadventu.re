import type { Player } from "@player/class";
import { ServerPacket, ServerPacketType } from "./types";

type ServerPlayerJoin = ServerPacket & {
    id: number,
    pseudo: string,
    score: number,
    voteSkip: boolean
}

export function emitPlayerJoin(players: Player[], player: Player) {
    const data: ServerPlayerJoin = {
        type: ServerPacketType.PlayerJoin,
        id: player.id,
        pseudo: player.pseudo,
        score: player.score,
        voteSkip: player.voteSkip
    }
    const textData = JSON.stringify(data);
    players.forEach(p=> p != player &&  p.socket?.send(textData));
}

