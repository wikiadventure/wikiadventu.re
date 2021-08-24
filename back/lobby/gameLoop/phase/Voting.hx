package lobby.gameLoop.phase;

import lobby.gameLoop.Phase.VanillaPhaseType;
import config.Lang.LangTools;
import lobby.Lobby.LobbyType;
import js.node.Timers;
import lobby.wikiAPI.WikiTools;
import lobby.gameLoop.Phase.PhaseType;
using lobby.player.PlayersExtension;
using config.twitch.TwitchBotExtension;
using Lambda;

class Voting extends Phase {
    
    public override function onStart() {
        if (lobby.type == Twitch) {
            var l = cast(lobby, TwitchLobby);
            l.twitchPlayerList.sayAll(LangTools.getTwitchVoteOpen(l.language));
        }
        lobby.players.voteReset();
        lobby.players.pageHistoryReset();
        
    }
    //call the next phase with an end and start page picked from player vote
    public override function end() {
        if (lobby.type == Twitch) {
            var l = cast(lobby, TwitchLobby);
            l.twitchPlayerList.sayAll(LangTools.getTwitchVoteClose(l.language));
        }

        Timers.clearTimeout(lobby.gameLoop.loop);
        WikiTools.selectPage(lobby.players.map(p -> p.vote), lobby.language)
        .then(result -> lobby.gameLoop.next(result));
    }
    
    public function new(lobby:Lobby, duration:Int = 80) {
        super(lobby, duration);
        type = VanillaPhaseType.Voting;
    }

}
