package lobby.gameLoop.phase;

import lobby.gameLoop.Phase.PhaseType;

class RoundFinish extends Phase {
    
    public function new(lobby:Lobby, duration:Int = 15) {
        super(lobby, duration);
        type = RoundFinish;
    }
}