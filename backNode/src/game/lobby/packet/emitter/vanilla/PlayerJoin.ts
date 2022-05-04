import type { Player } from "@game/lobby/player/class";

type ServerPlayerJoin = ServerPacket & {
    id: number,
    pseudo: string,
    self?: boolean,
    score: number,
    voteSkip: boolean
}

export function emitPlayerJoin(players: Player[], player: Player) {
    const data: ServerPlayerJoin = {
        type: VanillaServerPacketType.PlayerJoin,
        id: player.id,
        pseudo: player.pseudo,
        score: player.score,
        voteSkip: player.voteSkip
    }
    const textData = JSON.stringify(data);
    players.forEach(p=> p != player &&  p.socket?.send(textData));
}

export function sendCurrentPlayers(players: Player[], player: Player) {
    players.forEach(p=>{
        const data: ServerPlayerJoin = {
            type: VanillaServerPacketType.PlayerJoin,
            id: p.id,
            pseudo: p.pseudo,
            score: p.score,
            voteSkip: p.voteSkip
        }
        if (p==player) data.self = true;
        player.socket?.send(JSON.stringify(data))

    });
}