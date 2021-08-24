package lobby.packet.emitter.vanilla;

import lobby.gameLoop.Phase.PhaseType;
import haxe.Json;
import lobby.player.Players;
import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
using Lambda;

typedef ServerGamePhase = ServerPacket & {
    phase: PhaseType,
    round: Int,
    time: Float
}

class GamePhaseEmitter {

    /**
     * Send to players through websocket all the information about the current game phase
     * @param players to send to
     * @param phase 
     * @param currentRound 
     * @param timeleft 
     */
    public static function emitGamePhase(players:Players, phase:PhaseType, currentRound:Int, timeleft:Float) {
        var data:ServerGamePhase = {
            type: VanillaServerPacketType.GamePhase,
            phase: phase,
            round: currentRound,
            time: timeleft
        }
        var textData = Json.stringify(data);
        players.iter((p) -> if(p.socket != null) p.socket.send(textData));
    }

}