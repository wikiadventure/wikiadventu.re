import { GameLoopType, VanillaLoopType } from "src/store/lobby/game/loop/type";

/**
 * add an interface in the conditionnal type chain
 * to add custom player data for your mod
 */
export type PlayerData<T extends  GameLoopType | unknown = unknown> = T extends VanillaLoopType.Classic ? unknown : 
                                                                    T extends VanillaLoopType.Random ? unknown : 
                                                                    unknown;

/**
 * Player extends custom data depending on the gameloop
 */
export type Player<T extends  GameLoopType | unknown = unknown> = PlayerData<T> & {
    pseudo: string,
    id: number,
    score: number,
    voteSkip: boolean,
    isConnected: boolean
}
