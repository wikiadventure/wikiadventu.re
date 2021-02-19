package lobby.gameLoop.phase;

import js.node.Timers;
import lobby.wikiAPI.WikiTools;
import lobby.gameLoop.Phase.PhaseType;
using lobby.player.PlayersExtension;
using Lambda;

class Voting extends Phase {
    
    public override function onStart() {
        lobby.playerList.voteReset();
        lobby.playerList.pageHistoryReset();
        
    }
    //call the next phase with an end and start page picked from player vote
    public override function end() {
        Timers.clearTimeout(lobby.gameLoop.loop);
        WikiTools.selectPage(lobby.playerList.map((p) -> p.vote), lobby.language).then(
            (result) -> lobby.gameLoop.next(result)
        );
    }
    
    public function new(lobby:Lobby, duration:Int = 80) {
        super(lobby, duration);
        type = Voting;
    }

}
