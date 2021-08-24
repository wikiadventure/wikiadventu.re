package lobby.packet.handler.vanilla;

import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;

typedef ClientVote = ClientPacket & {
    vote:String
}

class ClientVoteHandler extends PacketHandler {

    final type = VanillaClientPacketType.Vote;

    override function canProcess(c:ClientPacket) return c.type == type;

    override function process(lobby:Lobby, player:Player, c:ClientPacket) {
        var v:ClientVote = cast c;
        player.vote = v.vote;
        super.process(lobby, player, v);
    }

}
