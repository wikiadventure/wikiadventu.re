package lobby.gameLoop.phase;

import lobby.gameLoop.Phase.VanillaPhaseType;
using lobby.player.PlayersExtension;

class GameFinish extends Phase {

    public override function onEnd() {
        lobby.players.resetScore();
        return null;
    }
    
    public function new(lobby:Lobby, duration:Int = 30) {
        super(lobby, duration);
        type = VanillaPhaseType.GameFinish;
    }
}