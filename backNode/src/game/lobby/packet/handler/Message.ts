import type { ClientPacketType } from './type';
import { emitMessage } from '../emitter/Message';
import type { Player } from '@game/lobby/player/class';
import type { Lobby } from '@game/lobby/class';

type ClientMessage = {
    type: ClientPacketType.Message
    data:string
}

export function MessageHandler(lobby:Lobby, player:Player, c:ClientMessage) {
    if (c.data == null) return;
    emitMessage(lobby.players, c.data, player);
    
}
