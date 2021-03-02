package lobby;

import lobby.player.Player;
import lobby.gameLoop.Phase;
import js.node.Timers.Timeout;

class GameLoop {
    
    public var lobby:Lobby;
    public var type:Int;
    public var loop:Timeout;
    public var currentPhase:Phase;
    public var timeStampStateBegin:Float;
    public var round:Int;
    public var currentRound:Int;

    public function start(?data:Any) {
        currentRound = 1;
        onStart(data);
    }

    public function onStart(?data:Any) {

    }
    public function end(?data:Any) {
        onEnd(data);
    }
    public function onEnd(?data:Any) {
        
    }

    public function next(?data:Any) {
        
    }
    public function sendCurrentState(player:Player) {
        
    }

}

enum abstract GameLoopType(Int) from Int to Int {
    var Classic;
}

enum abstract ModGameLoopType(Int) from Int to Int {
    var Default = 1000;
}