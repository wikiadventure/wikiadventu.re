package lobby.packet.emitter.vanilla;

import lobby.player.Player;
import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerUpdateScore = ServerPacket & {
    id: Int,
    score: Int
}

class UpdateScoreEmitter {

    /**
     * Send to players through websocket the score of a player
     * @param players to send to
     * @param player who need his score to be update
     */
    public static function emitUpdateScore(players:Players, player:Player) {
        var data:ServerUpdateScore = {
            type: VanillaServerPacketType.UpdateScore,
            id: player.id,
            score: player.score
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}