package lobby.packet.emitter.vanilla;

import lobby.player.Player;
import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerVoteSkip = ServerPacket & {
    id: Int,
    state: Bool
}

class VoteSkipEmitter {

    /**
     * Send to players through websocket player voteskip state
     * @param players to send to
     * @param player target
     */
    public static function emitVoteSkip(players:Players, player:Player) {
        var data:ServerVoteSkip = {
            type: VanillaServerPacketType.VoteSkip,
            id: player.id,
            state: player.voteSkip
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}