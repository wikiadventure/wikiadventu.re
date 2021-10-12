package lobby.gameLoop;

import js.lib.Promise;
import lobby.Lobby.LogType;
import haxe.Timer;
import js.node.Timers;
import lobby.player.Player;
using lobby.player.PlayersExtension;
using lobby.packet.emitter.vanilla.GamePhase.GamePhaseEmitter;
using Lambda;

@:build(hxasync.AsyncMacro.build())
class Phase {

    public var lobby:Lobby;
    
    public var duration:Int;//In seconds
    
    public var type:PhaseType;
    
    @async public function start() {
        lobby.players.iter(function(p:Player) {p.voteSkip = false;});
        lobby.gameLoop.timestamp = Timer.stamp();
        lobby.players.emitGamePhase(type, lobby.gameLoop.currentRound, duration);
        lobby.log("New phase init : " + type +"|" + lobby.gameLoop.currentRound + "|" + duration, Info);
        @await onStart();
        if (duration > 0) lobby.gameLoop.loop = Timers.setTimeout(end, duration*1000);
    }
    @async public function end() {
        Timers.clearTimeout(lobby.gameLoop.loop);
        var data = @await onEnd();
        if (lobby.id != null) lobby.gameLoop.next(data);
    }
    @async public function onStart():Any {
        return null;
    }

    @async public function onEnd():Any {
        return null;
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