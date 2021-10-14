package lobby.packet.handler.vanilla;

import lobby.packet.PacketHandler.IPacketHandler;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;

typedef ClientResetVote = ClientPacket;

class ClientResetVoteHandler implements IPacketHandler {

    final type = VanillaClientPacketType.ResetVote;

    function new(){}

    public static final instance = new ClientResetVoteHandler();

    public function canProcess(c:ClientPacket) return c.type == type;

    public function process(lobby:Lobby, player:Player, c:ClientPacket) {
        player.vote = "";
    }

}
