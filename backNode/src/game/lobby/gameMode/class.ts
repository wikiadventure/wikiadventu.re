import { ConnectError } from '@reply/ConnectError';
import type { GameModType } from './types';

export class GameMode {
    type:GameModType;
    // packetHandlers:Map<>

    start() {
        
    }

    constructor(type: GameModType) {
        this.type = type;
    }
}

export function GameModeSelect( type:GameModType, config?:any):GameMode {
    switch (type) {
        default:
            throw ConnectError.InvalidGameMode;
    }
}