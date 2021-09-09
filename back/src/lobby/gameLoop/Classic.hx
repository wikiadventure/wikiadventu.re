package lobby.gameLoop;

import lobby.GameLoop.VanillaGameLoopType;
import lobby.packet.handler.vanilla.VoteSkip.ClientVoteSkipHandler;
import lobby.packet.handler.vanilla.Vote.ClientVoteHandler;
import lobby.packet.handler.vanilla.ResetVote.ClientResetVoteHandler;
import lobby.packet.handler.vanilla.Validate.ClientValidateHandler;
import lobby.packet.handler.vanilla.Start.ClientStartHandler;
import lobby.packet.handler.vanilla.Message.ClientMessageHandler;
import lobby.gameLoop.Phase.VanillaPhaseType;
import lobby.GameLoop.GameLoopType;
import lobby.player.Player;
import lobby.gameLoop.phase.Waiting;
import lobby.gameLoop.phase.GameFinish;
import lobby.gameLoop.phase.RoundFinish;
import lobby.wikiAPI.WikiTools.VoteResult;
import lobby.gameLoop.Phase.PhaseType;
import lobby.gameLoop.phase.Voting;
import lobby.gameLoop.phase.Playing;

class Classic extends GameLoop {

    public override function onStart(?data:Any) {
        currentPhase = lobby.type != Public ? new Waiting(lobby) : new Voting(lobby);
        currentPhase.start();
    }

    public override function onEnd(?data:Any) {
    }

    public override function next(?data:Any) {
        if (lobby.players.length == 0) return;
        switch currentPhase.type {
            case VanillaPhaseType.Waiting:
                currentPhase = new Voting(lobby);
            case VanillaPhaseType.Voting:
                var v:VoteResult = data;
                currentPhase = new Playing(v.startPage, v.endPage, lobby);
            case VanillaPhaseType.Playing:
                currentPhase = new RoundFinish(lobby);
            case VanillaPhaseType.RoundFinish:
                if (lobby.gameLoop.currentRound >= lobby.gameLoop.round) currentPhase = new GameFinish(lobby);
                else {
                    currentRound++;
                    currentPhase = new Voting(lobby);
                }
            case VanillaPhaseType.GameFinish:
                return end();
        }
        if (currentPhase != null) currentPhase.start();
    }

    public override function new(lobby:Lobby, round=5) {
        super();
        this.lobby = lobby;
        this.round = round;
        this.type = VanillaGameLoopType.Classic;
        this.packetHandlers = [
            new ClientMessageHandler(),
            new ClientResetVoteHandler(),
            new ClientStartHandler(),
            new ClientValidateHandler(),
            new ClientVoteHandler(),
            new ClientVoteSkipHandler()
        ];
        
    }

    public override function sendCurrentState(player:Player) {
        currentPhase.sendCurrentState(player);
    }

}