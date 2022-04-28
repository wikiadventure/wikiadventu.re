import type { PhaseType } from "@game/lobby/gameMode/phase/types";
import type { GameModType } from "@game/lobby/gameMode/types";
import type { LobbyType } from "@game/lobby/types";
import type { Lang } from "@lang";
import type { FastifyReply, FastifyRequest } from "fastify";

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
    gameMode:GameModType,
    gamePhase:PhaseType,
    lobbyLang:Lang,
    slot:number,
    players:number,
}