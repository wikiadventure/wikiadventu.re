package lobby.gameLoop.phase;

import lobby.Lobby.LogType;
import lobby.player.Player;
import lobby.gameLoop.Phase.VanillaPhaseType;

class Waiting extends Phase {
    
    public function new(lobby:Lobby, duration:Int = 0) {
        super(lobby, duration);
        type = VanillaPhaseType.Waiting;
    }
}