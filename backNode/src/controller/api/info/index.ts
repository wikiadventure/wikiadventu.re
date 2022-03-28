import type { PhaseType } from 'src/game/lobby/gameLoop/phase/types';
import type { GameLoopType } from 'src/game/lobby/gameLoop/types';
import type { FastifyReply, FastifyRequest } from "fastify";
import type { LobbyType } from "src/game/lobby/types";
import type { Lang } from 'src/lang';

export const getInfoUrl = '/api/info/:lobbyId';

export type GetInfoParams = {
    lobbyId: string
}

export async function getInfo(req: FastifyRequest, rep: FastifyReply) {
    const { lobbyId } = (req.params as GetInfoParams);
    const twitchId = lobbyId.startsWith("twitch:") ? lobbyId.substring(7) : null;
    //TODO: add lobby find
    
    rep.send();
}

enum InfoStatusSuccess {
    Found
}

enum InfoStatusError {
    NotFound,
    ServerError
}

type InfoStatus = InfoStatusSuccess | InfoStatusError;

type InfoReply = {
    status:InfoStatusSuccess,
    lobbyID:string,
    lobbyType:LobbyType,
    gameMode:GameLoopType,
    gamePhase:PhaseType,
    lobbyLang:Lang,
    slot:number,
    players:number,
}