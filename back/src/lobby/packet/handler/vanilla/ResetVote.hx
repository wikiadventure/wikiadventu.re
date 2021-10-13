package lobby.packet.handler.vanilla;

import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;

typedef ClientResetVote = ClientPacket;

class ClientResetVoteHandler extends PacketHandler {

    final type = VanillaClientPacketType.ResetVote;

    override function canProcess(c:ClientPacket) return c.type == type;

    override function process(lobby:Lobby, player:Player, c:ClientPacket) {
        player.vote = "";
    }

}
