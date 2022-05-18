import type { Player } from '@player/class';
import { ServerPacket, ServerPacketType } from './types';

type ServerCurrentPlayers = ServerPacket & {
    players: {
        pseudo: string,
        self: boolean,
        score: number,
        voteSkip: boolean
    }[]
}

export function emitCurrentPlayers(players: Player[], player: Player) {
    const data: ServerCurrentPlayers = {
        type: ServerPacketType.CurrentPlayers,
        players: players.map(p=>({
            pseudo: p.pseudo,
            self: p == player,
            score: p.score,
            voteSkip: p.voteSkip
            
        }))
    }
    player.socket?.send(JSON.stringify(data));
}