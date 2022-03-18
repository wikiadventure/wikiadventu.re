package lobby.gameLoop.phase;

import js.lib.Promise;
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
    
    public override function onStart(?data:Any) {
        if (lobby.type == Twitch) {
            var l = cast(lobby, TwitchLobby);
            l.twitchPlayerList.sayAll(LangTools.getTwitchVoteOpen(l.lang));
        }
        lobby.players.voteReset();
        lobby.players.pageHistoryReset();
        return Promise.resolve();
    }
    //call the next phase with an end and start page picked from player vote
    
    public override function onEnd(?data:Any) {
        if (lobby.type == Twitch) {
            var l = cast(lobby, TwitchLobby);
            l.twitchPlayerList.sayAll(LangTools.getTwitchVoteClose(l.lang));
        }
        return WikiTools.selectPage(lobby.players.map(p -> p.vote), lobby.lang);
        
    }
    
    public function new(lobby:Lobby, duration:Int = 60) {
        super(lobby, duration);
        type = VanillaPhaseType.Voting;
    }

}
