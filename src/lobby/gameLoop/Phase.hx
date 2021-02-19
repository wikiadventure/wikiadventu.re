package lobby.gameLoop;

import lobby.Lobby.LogType;
import lobby.Lobby.WebsocketPackage;
import haxe.Timer;
import js.node.Timers;
import lobby.player.Player;
using lobby.player.PlayersExtension;
using Lambda;


class Phase {

    public var lobby:Lobby;
    
    public var duration:Int;//In seconds
    
    public var type:Int;
    
    public function start() {
        lobby.playerList.iter(function(p:Player) {p.voteSkip = false;});
        lobby.gameLoop.timeStampStateBegin = Timer.stamp();
        lobby.playerList.emitGameState(type, lobby.gameLoop.currentRound, duration);
        lobby.log("New phase init : " + type +"|" + lobby.gameLoop.currentRound + "|" + duration, Info);
        onStart();
        if (duration > 0) lobby.gameLoop.loop = Timers.setTimeout(end, duration*1000);
    }
    public function end() {
        Timers.clearTimeout(lobby.gameLoop.loop);
        onEnd();
        lobby.gameLoop.next();
    }
    public function onStart() {

    }
    public function onEnd() {
        
    }

    public function controller(player:Player, json:WebsocketPackage) {
        
    }

    public function new(lobby:Lobby, duration:Int) {
        this.lobby = lobby;
        this.duration = duration;
    }

    inline function log(data : Dynamic, logType:LogType, ?pos : haxe.PosInfos) {
        lobby.log(data, logType, pos);
    }

}
//register mod phase here
enum abstract PhaseType(Int) from Int to Int {
    var Waiting;
    var Voting;
    var Playing;
    var RoundFinish;
    var GameFinish;
}