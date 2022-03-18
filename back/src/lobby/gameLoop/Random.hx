package lobby.gameLoop;


import js.lib.Promise;
import lobby.GameLoop.Round;
import lobby.GameLoop.PhaseDuration;
import lobby.GameLoop.VanillaGameLoopType;
import lobby.packet.handler.vanilla.VoteSkip.ClientVoteSkipHandler;
import lobby.packet.handler.vanilla.Validate.ClientValidateHandler;
import lobby.packet.handler.vanilla.Start.ClientStartHandler;
import lobby.packet.handler.vanilla.Message.ClientMessageHandler;
import lobby.gameLoop.Phase.VanillaPhaseType;
import lobby.player.Player;
import lobby.gameLoop.phase.Waiting;
import lobby.gameLoop.phase.GameFinish;
import lobby.gameLoop.phase.RoundFinish;
import lobby.wikiAPI.WikiTools;
import lobby.gameLoop.phase.Voting;
import lobby.gameLoop.phase.Playing;

class Random extends GameLoop {
    
    public var playDuration:PhaseDuration;

    public override function onStart(?data:Any) {
        if (lobby.type != Public) {
            phase = new Waiting(lobby);
            return phase.start();
        }
        return randomPagePlaying();
    }

    // public override function onEnd(?data:Any) {
    // }

    public override function next(?data:Any) {
        if (lobby.players.length == 0) return Promise.resolve();
        switch phase.type {
            case VanillaPhaseType.Waiting:
                 return randomPagePlaying();
            case VanillaPhaseType.Playing:
                phase = new RoundFinish(lobby);
                return phase.start();
            case VanillaPhaseType.RoundFinish:
                if (lobby.gameLoop.round >= lobby.gameLoop.currentRound) {
                    phase = new GameFinish(lobby);
                    return phase.start();
                } else {
                    currentRound++;
                    return randomPagePlaying();
                }
            case GameFinish:
                return end();
        }
        return Promise.resolve();
    }
    public function new(lobby:Lobby, c:RandomConfig) {
        super();
        this.lobby = lobby;
        this.round = new Round(c.round, 3);
        this.playDuration = new PhaseDuration(c.playDuration, 600);
        this.type = VanillaGameLoopType.Random;
        this.packetHandlers = [
            ClientMessageHandler.instance,
            ClientStartHandler.instance,
            ClientValidateHandler.instance,
            ClientVoteSkipHandler.instance
        ];
        
    }
    public function randomPagePlaying() {
         return WikiTools.selectPage([], lobby.lang).then(
            (v:VoteResult) -> {
                phase = new Playing(v.startPage, v.endPage, lobby, playDuration);
                phase.start();
            }
        );
    }

}

typedef RandomConfig = {
    ?round:String,
    ?playDuration:String
}
