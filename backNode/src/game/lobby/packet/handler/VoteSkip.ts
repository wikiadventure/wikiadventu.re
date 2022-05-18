import type { ClientPacketType } from './type';
import type { Player } from '@game/lobby/player/class';
import type { Lobby } from '@game/lobby/class';
import { emitVoteSkip } from '../emitter/VoteSkip';

type ClientVoteSkip = {
    type: ClientPacketType.VoteSkip
}

export function MessageHandler(lobby:Lobby, player:Player, c:ClientVoteSkip) {
    player.voteSkip = !player.voteSkip;
    lobby.checkVoteSkip() || emitVoteSkip(lobby.players,player);
    
}
