package lobby.packet.handler.vanilla;

import lobby.packet.emitter.vanilla.VoteSkip.VoteSkipEmitter;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;
using Lambda;

typedef ClientVoteSkip = ClientPacket;

class ClientVoteSkipHandler extends PacketHandler {

    final type = VanillaClientPacketType.VoteSkip;

    override function canProcess(c:ClientPacket) return c.type == type;

    override function process(lobby:Lobby, player:Player, c:ClientPacket) {
        player.voteSkip = !player.voteSkip;
        VoteSkipEmitter.emitVoteSkip(lobby,player);
        lobby.checkVoteSkip();
    }

} 