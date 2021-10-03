package lobby.gameLoop.phase;

import lobby.gameLoop.Phase.VanillaPhaseType;
import lobby.gameLoop.Phase.PhaseType;

class RoundFinish extends Phase {
    
    public function new(lobby:Lobby, duration:Int = 10) {
        super(lobby, duration);
        type = VanillaPhaseType.RoundFinish;
    }
}