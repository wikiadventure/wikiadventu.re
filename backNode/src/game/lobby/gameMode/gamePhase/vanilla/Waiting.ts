import { VanillaGamePhaseType } from './../types';
import { GamePhase } from './../class';
import type { Lobby } from '@game/lobby/class';

export class Waiting extends GamePhase {
    
    constructor(lobby:Lobby, duration = -1) {
        super(lobby, duration);
        this.type = VanillaGamePhaseType.Waiting;
    }
}