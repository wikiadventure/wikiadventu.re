package lobby.gameLoop.phase;

import js.lib.Promise;
import lobby.gameLoop.Phase.VanillaPhaseType;
using lobby.player.PlayersExtension;

class GameFinish extends Phase {

    public override function onEnd(?data:Any):Promise<Any> {
        lobby.players.resetScore();
        return Promise.resolve();
    }
    
    public function new(lobby:Lobby, duration:Int = 30) {
        super(lobby, duration);
        type = VanillaPhaseType.GameFinish;
    }
}