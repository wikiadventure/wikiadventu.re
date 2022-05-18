import type { Lobby } from "@lobby/class";
import { GamePhase } from "./class";
import { GamePhaseType } from "./types";


export class RoundFinish extends GamePhase {

    override type = GamePhaseType.RoundFinish as const;
    
    constructor(lobby:Lobby, duration = 10) {
        super(lobby, duration);
    }
}