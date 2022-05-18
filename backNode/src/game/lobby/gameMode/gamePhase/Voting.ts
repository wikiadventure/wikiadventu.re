import type { ClientPacket } from "@packet/handler/type";
import type { Lobby } from "@lobby/class";
import { ClientPacketType } from "@packet/handler/type";
import type { Player } from "@player/class";
import { selectPages, type WikiPage } from "@wikiApi/pagePicker";
import { GamePhase } from "./class";
import { GamePhaseType } from "./types";

export class Voting extends GamePhase {

    override type = GamePhaseType.Voting as const;
    
    override get players() {return this.lobby.players as VotingPlayer[]};

    //call the next phase with an end and start page picked from player vote
    
    override async onEnd(data?:any):Promise<VoteResult> {
        const [start,end] = await selectPages(this.players.map(p=>p.vote),this.lobby.lang, 2) as [WikiPage, WikiPage];
        this.players.forEach(p => delete p.vote)
        return {start, end};
        
    }

    handleVote(lobby:Lobby, player:Player, packet:ClientPacket) {
        const c = packet as ClientVote;
        if (lobby.gameMode.gamePhase.type != this.type || c.gamePhase != this.type) return;
        const p = player as VotingPlayer;
        p.vote = c.vote;
    }
    
    constructor(lobby:Lobby, duration = 60) {
        super(lobby, duration);
        this.packetHandlers.set(ClientPacketType.GamePhase, this.handleVote)
    }

}

type ClientVote = {
    type: ClientPacketType.GamePhase,
    gamePhase: GamePhaseType.Voting,
    vote: wikiPageId
}

type wikiPageId = number;

export interface VotingPlayer extends Player {
    vote?: wikiPageId | null;
}

export type VoteResult = {
    start: WikiPage,
    end: WikiPage
}
