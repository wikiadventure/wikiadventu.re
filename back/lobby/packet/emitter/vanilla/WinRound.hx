package lobby.packet.emitter.vanilla;

import lobby.player.Player;
import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerWinRound = ServerPacket & {
    id: Int,
}

class WinRoundEmitter {

    /**
     * Send to players through websocket the id of the winner of the round
     * @param players to send to
     * @param player who win
     */
    public static function emitWinRound(players:Players, player:Player) {
        var data:ServerWinRound = {
            type: VanillaServerPacketType.WinRound,
            id: player != null ? player.id : -3
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}