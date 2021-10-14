package lobby.packet.handler.vanilla;

import lobby.packet.PacketHandler.IPacketHandler;
import lobby.packet.emitter.vanilla.VoteSkip.VoteSkipEmitter;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;
using Lambda;

typedef ClientVoteSkip = ClientPacket;

class ClientVoteSkipHandler implements IPacketHandler {

    final type = VanillaClientPacketType.VoteSkip;
    
    function new(){}

    public static final instance = new ClientVoteSkipHandler();

    public function canProcess(c:ClientPacket) return c.type == type;

    public function process(lobby:Lobby, player:Player, c:ClientPacket) {
        player.voteSkip = !player.voteSkip;
        VoteSkipEmitter.emitVoteSkip(lobby,player);
        lobby.checkVoteSkip();
    }

} 