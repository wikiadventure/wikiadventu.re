import type { Lobby } from "@lobby/class";
import { GamePhase } from "./class";
import { GamePhaseType } from "./types";

export class GameFinish extends GamePhase {

    override type = GamePhaseType.GameFinish as const;

    override async onEnd(data?:any):Promise<any> {
        this.lobby.players.forEach(p=>p.reset());
        return;
    }
    
    constructor(lobby:Lobby, duration = 30) {
        super(lobby, duration);
    }
}