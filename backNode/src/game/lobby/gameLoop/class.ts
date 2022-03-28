import { ConnectError } from 'src/reply/ConnectError';
import type { GameLoopType } from './types';

export class GameLoop {
    type:GameLoopType;
    packetHandlers:Map<>

    start() {
        
    }

    constructor(type: GameLoopType) {
        this.type = type;
    }
}

export function gameLoopSelect( type:GameLoopType, config?:any):GameLoop {
    switch (type) {
        default:
            throw ConnectError.InvalidGameLoop;
    }
}