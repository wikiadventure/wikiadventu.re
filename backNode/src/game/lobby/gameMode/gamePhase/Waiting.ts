import type { Lobby } from "@lobby/class";
import { GamePhase } from "./class";
import { GamePhaseType } from "./types";

export class Waiting extends GamePhase {

    override type = GamePhaseType.Waiting as const;
    
    constructor(lobby:Lobby, duration = -1) {
        super(lobby, duration);
    }
}