package lobby.packet.handler.vanilla;

import lobby.packet.PacketHandler.IPacketHandler;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;

typedef ClientVote = ClientPacket & {
    vote:String
}

class ClientVoteHandler implements IPacketHandler {

    final type = VanillaClientPacketType.Vote;

    function new(){}

    public static final instance = new ClientVoteHandler();

    public function canProcess(c:ClientPacket) return c.type == type;

    public function process(lobby:Lobby, player:Player, c:ClientPacket) {
        var v:ClientVote = cast c;
        player.vote = v.vote;
    }

}
