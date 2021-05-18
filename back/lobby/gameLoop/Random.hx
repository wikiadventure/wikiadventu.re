package lobby.gameLoop;

import js.lib.Promise;
import js.lib.Promise.Thenable;
import lobby.GameLoop.GameLoopType;
import lobby.player.Player;
import lobby.gameLoop.phase.Waiting;
import lobby.gameLoop.phase.GameFinish;
import lobby.gameLoop.phase.RoundFinish;
import lobby.wikiAPI.WikiTools;
import lobby.gameLoop.Phase.PhaseType;
import lobby.gameLoop.phase.Voting;
import lobby.gameLoop.phase.Playing;

class Random extends GameLoop {

    public override function onStart(?data:Any) {
        currentPhase = lobby.type != Public ? new Waiting(lobby) : new Voting(lobby);
        currentPhase.start();
    }

    public override function onEnd(?data:Any) {
    }

    public override function next(?data:Any) {
        if (lobby.players.length == 0) return;
        switch currentPhase.type {
            case Waiting:
                randomPagePlaying();
            case Playing:
                currentPhase = new RoundFinish(lobby);
                currentPhase.start();
            case RoundFinish:
                if (lobby.gameLoop.currentRound >= lobby.gameLoop.round) currentPhase = new GameFinish(lobby);
                else {
                    currentRound++;
                    randomPagePlaying();
                }
            case GameFinish:
                return end();
        }
    }

    public function new(lobby:Lobby, round=5) {
        this.lobby = lobby;
        this.round = round;
        this.type = Random;
        
    }
    public function randomPagePlaying() {
         return WikiTools.selectPage([], lobby.language).then(
            (v:VoteResult) -> {
                currentPhase = new Playing(v.startPage, v.endPage, lobby);
                currentPhase.start();
            }
        );
    }

    public override function sendCurrentState(player:Player) {
        currentPhase.sendCurrentState(player);
    }

}