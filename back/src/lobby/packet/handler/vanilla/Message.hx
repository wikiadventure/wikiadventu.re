package lobby.packet.handler.vanilla;

import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;
using lobby.packet.emitter.vanilla.Message.MessageEmitter;

typedef ClientMessage = ClientPacket & {
    data:String
}

class ClientMessageHandler extends PacketHandler {

    final type = VanillaClientPacketType.Message;

    override function canProcess(c:ClientPacket) return c.type == type;

    override function process(lobby:Lobby, player:Player, c:ClientPacket) {
        var m:ClientMessage = cast c;
        if (m.data == null) return;
        MessageEmitter.emitMessage(lobby, m.data, player);
        super.process(lobby, player, c);
        
    }

}
