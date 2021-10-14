package lobby.packet.handler.vanilla;

import lobby.packet.PacketHandler.IPacketHandler;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;
using lobby.packet.emitter.vanilla.Message.MessageEmitter;

typedef ClientMessage = ClientPacket & {
    data:String
}

class ClientMessageHandler implements IPacketHandler {

    final type = VanillaClientPacketType.Message;

    function new(){}

    public static final instance = new ClientMessageHandler();

    public function canProcess(c:ClientPacket) return c.type == type;

    public function process(lobby:Lobby, player:Player, c:ClientPacket) {
        var m:ClientMessage = cast c;
        if (m.data == null) return;
        MessageEmitter.emitMessage(lobby, m.data, player);
        
    }

}
