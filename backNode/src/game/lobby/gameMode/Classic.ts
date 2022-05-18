import { LobbyType, type Lobby } from "@lobby/class";
import { GameMode } from "./class";
import { type voteDuration, type playDuration, Round, VoteDuration, PlayDuration } from "./config/type";
import { GameFinish } from "./gamePhase/GameFinish";
import { Playing } from "./gamePhase/Playing";
import { RoundFinish } from "./gamePhase/RoundFinish";
import { GamePhaseType } from "./gamePhase/types";
import { Voting, type VoteResult } from "./gamePhase/Voting";
import { Waiting } from "./gamePhase/Waiting";
import { GameModType } from "./types";


export class Classic extends GameMode {

    voteDuration:voteDuration;
    playDuration:playDuration;

    override onStart(data?:any) {
        this.gamePhase = this.lobby.type != LobbyType.Public ? new Waiting(this.lobby) : new Voting(this.lobby, this.voteDuration);
        return this.gamePhase.start();
    }

    override async next(data?:any):Promise<any> {
        if (this.lobby.players.length == 0) return;
        switch (this.gamePhase.type) {
            case GamePhaseType.Waiting:
                this.gamePhase = new Voting(this.lobby, this.voteDuration);
                break;
            case GamePhaseType.Voting:
                const v:VoteResult = data;
                if (v == null) return;
                this.gamePhase = new Playing(v.start, v.end, this.lobby, this.playDuration);
                break;
            case GamePhaseType.Playing:
                this.gamePhase = new RoundFinish(this.lobby);
                break;
            case GamePhaseType.RoundFinish:
                if (this.lobby.gameMode.currentRound >= this.lobby.gameMode.round) this.gamePhase = new GameFinish(this.lobby);
                else {
                    this.currentRound++;
                    this.gamePhase = new Voting(this.lobby, this.voteDuration);
                }
                break;
            case GamePhaseType.GameFinish:
                return this.end();
        }
        this.gamePhase?.start();
    }

    constructor(lobby:Lobby, c:ClassicConfig = {}) {
        super(GameModType.Classic, lobby);
        this.round = Round(c.round, 5);
        this.voteDuration = VoteDuration(c.voteDuration, 60);
        this.playDuration = PlayDuration(c.playDuration, 300);
        
    }

}

type ClassicConfig = {
    round?:number,
    voteDuration?:number,
    playDuration?:number
}

