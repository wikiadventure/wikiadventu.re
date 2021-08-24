package lobby.packet.emitter.vanilla;

import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerVoteResult = ServerPacket & {
    start: String,
    end: String
}

class VoteResultEmitter {
    /**
     * Send to players through websocket the start and endpage
     * @param players to send to
     * @param startPage title
     * @param endPage title
     */
    public static function emitVoteResult(players:Players, startPage:String, endPage:String) {
        var data:ServerVoteResult = {
            type: VanillaServerPacketType.VoteResult,
            start: startPage,
            end: endPage
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}