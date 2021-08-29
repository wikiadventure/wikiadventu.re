package lobby.packet.emitter.vanilla;

import haxe.Json;
import lobby.player.Player;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerPlayerLeft = ServerPacket & {
    id: Int,
}

class PlayerLeftEmitter {

    /**
     * Send with websocket the id of the player who left
     * @param players to send to
     * @param player the player whho left
     */
    public static function emitPlayerLeft(players:Players, player:Player) {
        var data:ServerPlayerLeft = {
            type: VanillaServerPacketType.PlayerLeft,
            id: player.id,
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}