package lobby.packet.emitter.vanilla;

import lobby.player.Player;
import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerPath = ServerPacket & {
    id: Int,
    pages: Array<String>,
    time: Float
}

class PathEmitter {

    /**
     * Send to players through websocket the path of a player
     * @param players 
     * @param player 
     * @param time 
     */
    public static function emitPath(players:Players, player:Player, time:Float) {
        var data:ServerPath = {
            type: VanillaServerPacketType.Path,
            id: player.id,
            pages: player.pageList,
            time: time
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}
