import { LobbyType, type Lobby } from "@lobby/class";
import { selectPages, type WikiPage } from "@wikiApi/pagePicker";
import { GameMode } from "./class";
import { type playDuration, Round, VoteDuration, PlayDuration } from "./config/type";
import { GameFinish } from "./gamePhase/GameFinish";
import { Playing } from "./gamePhase/Playing";
import { RoundFinish } from "./gamePhase/RoundFinish";
import { GamePhaseType } from "./gamePhase/types";
import { Voting } from "./gamePhase/Voting";
import { Waiting } from "./gamePhase/Waiting";
import { GameModType } from "./types";


export class Random extends GameMode {

    playDuration:playDuration;

    override async onStart(data?:any) {
        this.gamePhase = this.lobby.type != LobbyType.Public ? new Waiting(this.lobby) : await this.play();
        return this.gamePhase.start();
    }

    override async next(data?:any):Promise<any> {
        if (this.lobby.players.length == 0) return;
        switch (this.gamePhase.type) {
            case GamePhaseType.Waiting:
                this.gamePhase = await this.play();
                break;
            case GamePhaseType.Playing:
                this.gamePhase = new RoundFinish(this.lobby);
                break;
            case GamePhaseType.RoundFinish:
                if (this.lobby.gameMode.currentRound >= this.lobby.gameMode.round) this.gamePhase = new GameFinish(this.lobby);
                else {
                    this.currentRound++;
                    this.gamePhase = await this.play();
                }
                break;
            case GamePhaseType.GameFinish:
                return this.end();
        }
        this.gamePhase?.start();
    }

    constructor(lobby:Lobby, c:RandomConfig = {}) {
        super(GameModType.Classic, lobby);
        this.round = Round(c.round, 5);
        this.playDuration = PlayDuration(c.playDuration, 300);
        
    }

    async play() {
        const [start, end] = await selectPages([], this.lobby.lang, 2) as [WikiPage, WikiPage];
        return new Playing(start, end, this.lobby, this.playDuration); 
    }

}

type RandomConfig = {
    round?:number,
    voteDuration?:number,
    playDuration?:number
}

