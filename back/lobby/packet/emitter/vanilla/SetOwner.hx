package lobby.packet.emitter.vanilla;

import lobby.player.Player;
import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerSetOwner = ServerPacket & {
    id: Int,
}

class SetOwnerEmitter {

    /**
     * Send to players through websocket the id of the owner
     * @param players 
     * @param ownerId 
     */
    public static function emitSetOwner(players:Players, ownerId:Int) {
        var data:ServerSetOwner = {
            type: VanillaServerPacketType.SetOwner,
            id: ownerId
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}