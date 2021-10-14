package lobby.gameLoop;

import lobby.GameLoop.PhaseDuration;
import lobby.GameLoop.Round;
import haxe.macro.Expr.TypeDefinition;
import haxe.rtti.CType.Typedef;
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

    public var voteDuration:PhaseDuration;
    public var playDuration:PhaseDuration;

    public override function onStart(?data:Any) {
        phase = lobby.type != Public ? new Waiting(lobby) : new Voting(lobby, voteDuration);
        phase.start();
    }

    public override function onEnd(?data:Any) {
    }

    public override function next(?data:Any) {
        if (lobby.players.length == 0) return;
        switch phase.type {
            case VanillaPhaseType.Waiting:
                phase = new Voting(lobby, voteDuration);
            case VanillaPhaseType.Voting:
                var v:VoteResult = data;
                phase = new Playing(v.startPage, v.endPage, lobby, playDuration);
            case VanillaPhaseType.Playing:
                phase = new RoundFinish(lobby);
            case VanillaPhaseType.RoundFinish:
                if (lobby.gameLoop.currentRound >= lobby.gameLoop.round) phase = new GameFinish(lobby);
                else {
                    currentRound++;
                    phase = new Voting(lobby, voteDuration);
                }
            case VanillaPhaseType.GameFinish:
                return end();
        }
        if (phase != null) phase.start();
    }

    public override function new(lobby:Lobby, c:ClassicConfig) {
        super();
        this.lobby = lobby;
        this.round = new Round(c.round, 3);
        this.voteDuration = new PhaseDuration(c.voteDuration, 60);
        this.playDuration = new PhaseDuration(c.playDuration, 600);
        this.type = VanillaGameLoopType.Classic;
        this.packetHandlers = [
            ClientMessageHandler.instance,
            ClientResetVoteHandler.instance,
            ClientStartHandler.instance,
            ClientValidateHandler.instance,
            ClientVoteHandler.instance,
            ClientVoteSkipHandler.instance
        ];
        
    }

}

typedef ClassicConfig = {
    ?round:String,
    ?voteDuration:String,
    ?playDuration:String
}