package lobby.packet.emitter.vanilla;

import haxe.Json;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
import lobby.player.Players;
import lobby.player.Player;
using Lambda;

typedef ServerMessage = ServerPacket & {
    id:Int,
    data:String
}

class MessageEmitter {
    
    /**
     * Send through websocket a chat message
     * @param players the players to which a message is sent
     * @param message that is sent to players
     * @param from the player who send the message, if null the message is sent as the server with the id -1
     */
    public static function emitMessage(players:Players, message:String, ?from:Player) {
        var data:ServerMessage = {
            type: VanillaServerPacketType.Message,
            id: from == null ? -1 : from.id,
            data: message
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }


}