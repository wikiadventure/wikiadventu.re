package lobby.gameLoop;

import lobby.Lobby.LogType;
import haxe.Timer;
import js.node.Timers;
import lobby.player.Player;
using lobby.player.PlayersExtension;
using lobby.packet.emitter.vanilla.GamePhase.GamePhaseEmitter;
using Lambda;


class Phase {

    public var lobby:Lobby;
    
    public var duration:Int;//In seconds
    
    public var type:PhaseType;
    
    public function start() {
        lobby.players.iter(function(p:Player) {p.voteSkip = false;});
        lobby.gameLoop.timeStampStateBegin = Timer.stamp();
        lobby.players.emitGamePhase(type, lobby.gameLoop.currentRound, duration);
        lobby.log("New phase init : " + type +"|" + lobby.gameLoop.currentRound + "|" + duration, Info);
        onStart();
        if (duration > 0) lobby.gameLoop.loop = Timers.setTimeout(end, duration*1000);
    }
    public function end() {
        Timers.clearTimeout(lobby.gameLoop.loop);
        onEnd();
        if (lobby.id != null) lobby.gameLoop.next();
    }
    public function onStart() {

    }
    public function onEnd() {
        
    }

    public function sendState(player:Player) {
        
    }

    public function new(lobby:Lobby, duration:Int) {
        this.lobby = lobby;
        this.duration = duration;
    }

    inline function log(data : Dynamic, logType:LogType, ?pos : haxe.PosInfos) {
        lobby.log(data, logType, pos);
        var d:PhaseType;
    }

}

enum abstract PhaseType(Int) from VanillaPhaseType to Int from ModPhaseType to Int {
    
}

enum abstract VanillaPhaseType(Int) from Int to Int {
    var Waiting;
    var Voting;
    var Playing;
    var RoundFinish;
    var GameFinish;
}

// Register your mod phase here and on the front.
enum abstract ModPhaseType(Int) from Int to Int {
    var Default = 1000;
}