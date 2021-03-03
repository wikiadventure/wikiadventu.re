package lobby.gameLoop.phase;

import lobby.Lobby.LogType;
import lobby.Lobby.WebsocketPackage;
import lobby.player.Player;
import lobby.gameLoop.Phase.PhaseType;

class Waiting extends Phase {
    
    public override function onStart() {

    }

    public override function onEnd() {
        
    }

    public override function controller(player:Player, json:WebsocketPackage) {
        switch json.type {
            case Start:
                if (player==lobby.owner) {
                    end();
                } else {
                    lobby.log("Someone who is not owner tried to start --> " + player.uuid, Error);
                }
            default:
        }
    }
    
    public function new(lobby:Lobby, duration:Int = 0) {
        super(lobby, duration);
        type = Waiting;
    }
}