import type { Player } from '@game/lobby/player/class';

export function wsEmit(players: Player[], data:any) {
    const textData = JSON.stringify(data);
    players.forEach(p=>p.socket?.send(textData));
}