import { selectPages } from '@game/wikiApi/pagePicker';
import type { Lobby } from '@game/lobby/class';
import { LobbyType } from '@game/lobby/types';
import { GamePhase } from '../class';
import { VanillaGamePhaseType } from '../types';

export class Voting extends GamePhase {
    
    override onStart(data?:any) {
        if (this.lobby.type == LobbyType.Twitch) {
            // var l = cast(this.lobby, TwitchLobby);
            // l.twitchPlayerList.sayAll(LangTools.getTwitchVoteOpen(l.lang));
        }
        this.lobby.players.voteReset();
        this.lobby.players.pageHistoryReset();
        return Promise.resolve();
    }
    //call the next phase with an end and start page picked from player vote
    
    override async onEnd(data?:any) {
        if (this.lobby.type == LobbyType.Twitch) {
            // var l = cast(this.lobby, TwitchLobby);
            // l.twitchPlayerList.sayAll(LangTools.getTwitchVoteClose(l.lang));
        }
        const [start,end] = await selectPages(pla)
        return WikiTools.selectPage(this.lobby.players.map(p -> p.vote), this.lobby.lang);
        
    }
    
    constructor(lobby:Lobby, duration = 60) {
        super(lobby, duration);
        this.type = VanillaGamePhaseType.Voting;
    }

}
