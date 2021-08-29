package lobby.packet.emitter.vanilla;

import lobby.player.Players;
import haxe.Json;
import lobby.player.Player;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerPlayerJoin = ServerPacket & {
    id: Int,
    pseudo: String,
    self: Bool,
    score: Int,
    voteSkip: Bool
}

class PlayerJoinEmitter {

    /**
     * Send with websocket all the info of a new player joining the lobby
     * @param players to send to
     * @param player the new player
     */
    public static function emitPlayerJoin(players:Players, player:Player) {
        var data:ServerPlayerJoin = {
            type: VanillaServerPacketType.PlayerJoin,
            id: player.id,
            pseudo: player.pseudo,
            self: false,
            score: player.score,
            voteSkip: player.voteSkip
        }
        var textData = Json.stringify(data);
        players.iter((p) -> 
            if(p.socket != null) {
                if (p != player) p.socket.send(textData);
                else {
                    data.self = true;
                    var text = Json.stringify(data);
                    p.socket.send(text);
                }
            }
        );
    }

}